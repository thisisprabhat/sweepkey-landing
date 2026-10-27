import CoreGraphics
import Foundation
// Prints the window number of the largest on-screen window owned by the given pid.
let pid = Int(CommandLine.arguments[1])!
let list = CGWindowListCopyWindowInfo([.optionAll], kCGNullWindowID) as? [[String: Any]] ?? []
let best = list.filter { ($0[kCGWindowOwnerPID as String] as? Int) == pid && ($0[kCGWindowLayer as String] as? Int) == 0 }
    .max { a, b in
        let ra = a[kCGWindowBounds as String] as? [String: Double] ?? [:]
        let rb = b[kCGWindowBounds as String] as? [String: Double] ?? [:]
        return (ra["Width"] ?? 0) * (ra["Height"] ?? 0) < (rb["Width"] ?? 0) * (rb["Height"] ?? 0)
    }
if let n = best?[kCGWindowNumber as String] as? Int { print(n) }
