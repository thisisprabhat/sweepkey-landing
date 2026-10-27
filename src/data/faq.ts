// Answers come from Docs/03-content-and-features.md (checked against the app repo).
// Plain text, because they also feed the FAQPage structured data.
export const faq: { question: string; answer: string }[] = [
  {
    question: 'Is it safe?',
    answer:
      'Sweepkey is conservative by design. Every clean starts as a dry run: you see each folder, its size and its risk level before you confirm. Folders containing git-tracked files are skipped, symlinks are never followed, nothing outside your scan roots is touched, and Danger items need an extra confirmation. You can also send everything to the Trash instead of deleting it.',
  },
  {
    question: 'Why does it need Full Disk Access?',
    answer:
      'Developer projects often live in places macOS protects, like Desktop, Documents, Downloads and external drives, and some tool caches do too. Without Full Disk Access, scans silently miss those folders and deletions can fail. Sweepkey still works without it, on the folders it can read. Onboarding links straight to the right page in System Settings.',
  },
  {
    question: 'Where does my data go?',
    answer:
      'Nowhere. Sweepkey has no telemetry, no analytics and no accounts. Scans, history and the vault stay on your Mac, and vault contents leave it only if you export them somewhere yourself. The only network request is the Sparkle update check, which fetches the update feed from GitHub Releases.',
  },
  {
    question: "Why isn't the app sandboxed?",
    answer:
      "A sandboxed app can't clean arbitrary project folders, so the App Sandbox is off for the app. The bundled widget is sandboxed. The app is signed with a Developer ID, uses the Hardened Runtime and is notarized by Apple, and the source is public so you can check exactly what it does.",
  },
  {
    question: 'How do I uninstall it?',
    answer:
      'Quit Sweepkey (turn off "Launch at login" in Settings first if you enabled it), then drag it from Applications to the Trash. To remove its data too, delete ~/Library/Application Support/Sweepkey and ~/Library/Preferences/com.prabhatkumar.Sweepkey.plist. With Homebrew: brew uninstall --zap --cask sweepkey. Vaults you exported stay where you saved them.',
  },
  {
    question: 'Is it open source?',
    answer:
      'Yes. Sweepkey is free and open source under the MIT licence, and the code is on GitHub. Cleaning rules are plain JSON, so adding support for a new tool is usually a small pull request. Releases are built by a public GitHub Actions workflow.',
  },
  {
    question: 'Which Macs does it run on?',
    answer:
      'Any Mac running macOS 26 or later. Building from source needs Xcode 27. The download is a single DMG; the sweepkey command-line tool is included in the app and is also available as a separate zip.',
  },
  {
    question: 'Will macOS warn me when I open it?',
    answer:
      'No. Every release is signed with an Apple Developer ID and notarized by Apple, and the notarization ticket is stapled to both the app and the DMG, so Gatekeeper opens it without a warning, even offline. You can check with spctl -a -vv /Applications/Sweepkey.app, which should report "Notarized Developer ID".',
  },
  {
    question: 'How does it update?',
    answer:
      'Through Sparkle 2, with EdDSA-signed updates published on GitHub Releases. Choose "Check for Updates…" in the app menu, or let it check automatically. If you installed with Homebrew, the cask is marked auto-updating, so Sparkle handles updates there too.',
  },
];
