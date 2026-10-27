// Converts a screen recording into the hero GIF (assets/video/sweepkey-demo.gif), using only macOS
// frameworks (no ffmpeg). Pass --mp4 to also write an H.264 MP4 of the same clip.
//
// Usage (compile first: `swift file.swift` crashes the compiler on top-level await in script mode):
//   swiftc -O scripts/mov-to-gif.swift -o /tmp/mov-to-gif
//   /tmp/mov-to-gif <recording.mov> [--out assets/video] [--name sweepkey-demo]
//                   [--start 0] [--end <seconds>] [--keep 0-4.4,9.4-12.6,17-] [--crop l,t,r,b]
//                   [--width 960] [--fps 12] [--mp4]
// --keep joins several time ranges into one GIF (e.g. to cut out parts that show private names);
// an open end ("17-") runs to the end of the recording. --crop takes fractions of the frame.
// --mp4 ignores --keep and --crop and uses --start/--end.
// Then `npm run assets` copies assets/video into public/video, and the hero shows the GIF.
//
// The hero GIF was made with:
//   --keep 0-4.4,9.2-11.9,16.6- --crop 0.0552,0.0525,0.9448,0.8994 --width 1076 --fps 12
//
// Before publishing, look through the output for real names or paths (Docs/02-asset-plan.md);
// trim with --start/--end if needed.
import AVFoundation
import Foundation
import ImageIO
import UniformTypeIdentifiers

func value(_ flag: String, _ fallback: String? = nil) -> String? {
    let args = CommandLine.arguments
    guard let i = args.firstIndex(of: flag), i + 1 < args.count else { return fallback }
    return args[i + 1]
}

func fail(_ message: String) -> Never {
    FileHandle.standardError.write(Data("mov-to-gif: \(message)\n".utf8))
    exit(1)
}

guard CommandLine.arguments.count > 1, !CommandLine.arguments[1].hasPrefix("--") else {
    fail("usage: swift scripts/mov-to-gif.swift <recording.mov> [--out dir] [--name base] [--start s] [--end s] [--width px] [--fps n]")
}
let input = URL(fileURLWithPath: CommandLine.arguments[1])
let outDir = URL(fileURLWithPath: value("--out", "assets/video")!, isDirectory: true)
let name = value("--name", "sweepkey-demo")!
let width = Double(value("--width", "960")!) ?? 960
let fps = Double(value("--fps", "12")!) ?? 12

let asset = AVURLAsset(url: input)
let duration = try await asset.load(.duration).seconds
guard duration.isFinite, duration > 0 else { fail("could not read \(input.path)") }
let start = max(0, Double(value("--start", "0")!) ?? 0)
let end = min(duration, Double(value("--end", "\(duration)")!) ?? duration)
guard end > start else { fail("--end must be after --start") }
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

// GIF: sample frames at `fps`, scaled to `width`, looping forever.
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: width, height: width * 4)
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = CMTime(seconds: 0.5 / fps, preferredTimescale: 600)

// Ranges to keep: --keep "a-b,c-d,e-" or just --start/--end.
let ranges: [(Double, Double)] = value("--keep").map { spec in
    spec.split(separator: ",").map { part in
        let bounds = part.split(separator: "-", omittingEmptySubsequences: false)
        let a = Double(bounds.first ?? "") ?? 0
        let b = bounds.count > 1 ? Double(bounds[1]) ?? duration : duration
        return (max(0, a), min(duration, b))
    }
} ?? [(start, end)]
let times = ranges.flatMap { range in
    stride(from: range.0, to: range.1, by: 1 / fps).map { CMTime(seconds: $0, preferredTimescale: 600) }
}
guard !times.isEmpty else { fail("no frames in the requested ranges") }
let gifURL = outDir.appendingPathComponent("\(name).gif")
guard let gif = CGImageDestinationCreateWithURL(gifURL as CFURL, UTType.gif.identifier as CFString, times.count, nil) else {
    fail("cannot write \(gifURL.path)")
}
CGImageDestinationSetProperties(gif, [kCGImagePropertyGIFDictionary: [kCGImagePropertyGIFLoopCount: 0]] as CFDictionary)
let frameProps = [kCGImagePropertyGIFDictionary: [kCGImagePropertyGIFUnclampedDelayTime: 1 / fps]] as CFDictionary
// --crop l,t,r,b as fractions of the frame (e.g. to drop the black margin around a recorded window).
let crop: [Double]? = value("--crop").map { $0.split(separator: ",").compactMap { Double($0) } }
if let crop, crop.count != 4 { fail("--crop needs four fractions: left,top,right,bottom") }
for (i, time) in times.enumerated() {
    var (image, _) = try await generator.image(at: time)
    if let crop {
        let w = Double(image.width), h = Double(image.height)
        let rect = CGRect(x: crop[0] * w, y: crop[1] * h, width: (crop[2] - crop[0]) * w, height: (crop[3] - crop[1]) * h).integral
        guard let cropped = image.cropping(to: rect) else { fail("crop \(rect) is outside the frame") }
        image = cropped
    }
    CGImageDestinationAddImage(gif, image, frameProps)
    if i % 24 == 0 { print("gif frame \(i + 1)/\(times.count)") }
}
guard CGImageDestinationFinalize(gif) else { fail("finalizing the GIF failed") }
print("wrote \(gifURL.path)")

// Optional MP4: same clip, H.264, no audio, web-friendly (moov atom first).
guard CommandLine.arguments.contains("--mp4") else { exit(0) }
let mp4URL = outDir.appendingPathComponent("\(name).mp4")
try? FileManager.default.removeItem(at: mp4URL)
guard let export = AVAssetExportSession(asset: asset, presetName: AVAssetExportPreset1920x1080) else {
    fail("no H.264 export preset available")
}
export.timeRange = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600), end: CMTime(seconds: end, preferredTimescale: 600))
export.shouldOptimizeForNetworkUse = true
if let audio = try await asset.loadTracks(withMediaType: .audio).first {
    // Drop audio: the page plays the clip muted anyway.
    let mix = AVMutableAudioMix()
    let params = AVMutableAudioMixInputParameters(track: audio)
    params.setVolume(0, at: .zero)
    mix.inputParameters = [params]
    export.audioMix = mix
}
try await export.export(to: mp4URL, as: .mp4)
print("wrote \(mp4URL.path)")
