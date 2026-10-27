# 03 · Content and features

> Status: final copy for review · 2026-10-27

All claims below are checked against the app repo: `README.md` (Features, Safety model, Full Disk Access, CLI, Privacy), `docs/01-features.md`, `docs/02-cleaning-rules.md`, `docs/03-safety.md`, `docs/04-secrets-vault.md`, `docs/05-automation-and-insights.md`, `docs/10-open-source-release.md`, and UI strings in `App/Features/`. The "Source" column or note says where each fact comes from.

## Words to use and avoid
| Use | Avoid | Why |
|---|---|---|
| "up to X GB freed" | "frees X GB" | APFS clones may not free every block; the app says "up to" (`03-safety.md`). |
| "rebuildable", "regenerable" | "junk", "garbage" | The folders are useful; they can just be rebuilt. ("dev junk" is fine only when quoting the dashboard chart.) |
| "secrets", "un-committed secrets", "signing keys" | "passwords" | The vault collects files, not passwords. |
| "dry run first", "nothing is deleted until you confirm" | "one-click clean" | Every clean is confirmed. |
| "macOS 26 or later" | "Apple silicon only", "Intel supported" | The only documented requirement is the deployment target, macOS 26. |
| "masked previews" | "reveal", "Quick Look", "diff" in the vault | Reveal/copy, Quick Look and the vault diff view are v1.1 (`08-roadmap.md`). |
| "open source (MIT)", "free" | "freemium", "pro" | There is no paid tier. |

Placeholders used below: `{ver}`, `{size}`, `{sha256}`, `{date}` come from `src/data/release.json`; `thisisprabhat` is the GitHub owner.

---

## S1 · Nav
- Logo alt: "Sweepkey home"
- Links: **Features** · **How it works** · **Vault** · **CLI** · **FAQ**
- GitHub link: "GitHub" (with star icon; `aria-label="Sweepkey on GitHub"`)
- Button: **Download**
- Skip link: "Skip to content"

## S2 · Hero
- **Eyebrow:** Free and open source · macOS 26 or later
- **Headline (h1):** Sweep the rebuildable. Keep the keys.
- **Subhead:** Sweepkey clears `node_modules`, `DerivedData`, build folders and developer caches from your Mac, and keeps your `.env` files and signing keys safe in a vault before anything is deleted.
- **Primary CTA:** Download for Mac
- **CTA meta:** Version {ver} · {size} · macOS 26 or later
- **Secondary line:** `brew install --cask thisisprabhat/tap/sweepkey` — copy button label: "Copy Homebrew command"
- **Under the window:** Reclaimable — `{demo total}` *(caption: demo data)*

## S3 · Sweep demo — "How it works"
- **Eyebrow:** 01 — How it works
- **Title (h2):** Tick what can be rebuilt. Sweep. Your secrets stay.
- **Intro:** Sweepkey only offers a folder when a marker file proves what it is: `build/` counts next to `pubspec.yaml` or `build.gradle`, `target/` next to `Cargo.toml`. Try it on a demo project tree.
- **Row hint format:** `node_modules · 1.8 GB · Safe · npm install`
- **Secret rows:** "secret — kept" (for `.env.local`, `upload-keystore.jks`) and "always collected" (for `pubspec.yaml`, which the app collects even when git tracks it).
- **Toggle:** Dry run first
- **Buttons:** Sweep {selected size} · Select all · Reset
- **Confirmation panel:** You're about to remove {n} folders · up to {size}. {k} secret files will be copied to the vault first. — **Confirm sweep** / **Cancel**
- **Freed card label:** Freed
- **Vault card label:** Vault · empty state "Nothing yet" · after: "{k} files kept"
- **Result (live region):** Freed up to {size}. {k} secret files kept in the vault. Rebuild any time with `npm install`, `cargo build` or `flutter pub get`.
- **Footnote:** Demo data. In the app you see every item, its size, its risk level and the command that rebuilds it before you confirm.
- **No-JS caption:** The interactive demo needs JavaScript. Here is what it shows: …(static list)

Demo fixture (fictional; sizes illustrative). Each row's rule facts are real, from `docs/02-cleaning-rules.md`:

| Project | Marker | Artifact | Risk | Regenerate |
|---|---|---|---|---|
| storefront-web | `package.json` | `node_modules`, `.next` | Safe | `npm install` |
| ledger-rs | `Cargo.toml` | `target` | Safe | `cargo build` |
| FieldNotes (iOS) | `*.xcodeproj` / `Package.swift` | `DerivedData` (kept inside the project), `.build` | Safe | Build in Xcode / `swift build` |
| tide_app (Flutter) | `pubspec.yaml` | `build`, `.dart_tool` | Safe | `flutter pub get` |
| ml-notebooks | `pyproject.toml` | `.venv`, `__pycache__` | Safe | recreate the venv |

Secrets in the fixture: `storefront-web/.env.local` (env file), `tide_app/android/upload-keystore.jks` (signing keystore), `tide_app/pubspec.yaml` (always-collect list).

## S4 · Works with
- **Title (h2):** Finds rebuildable folders across 20+ ecosystems
- **Sub:** JavaScript and TypeScript, Python, Swift and Xcode, Flutter, Android and Gradle, Rust, Go, .NET, C/C++, Elixir, Haskell, Ruby, PHP, Zig, Scala, Bazel, Terraform, Unity, Unreal, and the caches of the tools around them.
- **Pause button:** Pause logos / Play logos
- *(Source: ecosystem ids in `02-cleaning-rules.md`; logos from the app's `EcosystemLogos`.)*

## S5 · Feature tour
- **Eyebrow:** 02 — Inside the app
- **Title (h2):** One window for every project, cache and secret.

| Tab | Panel title | Blurb | Points | Screenshot |
|---|---|---|---|---|
| **Projects** | Every project, sized up | Add your project folders once. Sweepkey finds each project's rebuildable folders, shows how big they are, when you last worked on it, and the command that brings them back. | • Results stream in live with a running total, and rescans only redo changed folders. • Git details at a glance: branch, uncommitted changes, unpushed commits, stashes. • Projects untouched for 30 days are flagged "Stale, safe to clean". | `02-projects-inspector` |
| **Caches** | Developer caches, grouped | The caches your tools leave outside projects, grouped by tool. Where a tool has its own cleanup command, Sweepkey runs that instead of deleting files by hand. | • Xcode: DerivedData, Archives, device support, unavailable simulators. • Package and version managers: npm, pnpm, Yarn, pip, uv, Cargo, Go, Maven, CocoaPods, nvm, pyenv, rustup and more. • Docker, OrbStack and Colima, IDE caches, and opt-in AI model caches. | `05-caches` |
| **Vault** | Keep the keys | Before you clean, collect the files git doesn't have and can't rebuild: `.env` files, keystores, certificates, cloud credentials. Export them as a folder, a zip or an encrypted disk image. | • Git-aware: finds ignored and untracked files that match secret patterns. • Keeps each project's folder layout, plus a manifest with checksums. • Restore to the original paths, or by git remote after a fresh clone on a new Mac. | `06-vault-findings` (+ `07-vault-export`) |
| **History** | Every clean, on record | Each clean is journaled: what was removed, where, how big, and how. See your lifetime space reclaimed and the trend over time. | • Runs that moved items to the Trash can be undone with Put Back. • After a clean, affected projects are rescanned and you see free space before and after. • A menu bar extra shows free space and reclaimable space at a glance. | `08-history` (+ `09-history-detail`) |
| **Rules** | Rules are just JSON | What counts as rebuildable is data, not code. Turn rules on or off, or add your own with a marker file, a target and a risk level. | • A rule only matches when its marker file exists, so `build/` is never touched in the wrong project. • Ambiguous folders like `dist`, `vendor` and `env` are off by default. • Exclude paths, add a `.sweepkeyignore`, or pin a project so it's never offered. | `10-rules` (+ `11-rules-editor`) |
| **Recipes** | Guided jobs | Recipes combine cleaning and the vault into step-by-step jobs. Each one plans everything first and shows you the result before anything is deleted. | • Free Up Space: ask for a number of GB and review the safest plan. • Archive a Project: save secrets, clean, optionally zip. • Move to a New Mac: a bundle with your vault, your repo list and a restore script. | `12-recipes` |

*(Sources: `01-features.md` A, C, E, F, H, I; `02-cleaning-rules.md`; `04-secrets-vault.md`; `05-automation-and-insights.md`; Recipes copy from `RecipesView.swift`.)*

## S6 · Safety
- **Eyebrow:** 03 — Safety
- **Title (h2):** Conservative by design.
- **Intro:** Sweepkey deletes files, so it treats every folder as important until it's sure it can be rebuilt.

| Card | Title | Text | Source |
|---|---|---|---|
| 1 | Dry run first | Nothing is deleted until you've seen the full list and total size and confirmed. The CLI has `--dry-run` and won't run unattended without `--yes`. | README Safety model |
| 2 | Git-tracked guard | A folder that contains any git-tracked file is skipped, so a `build/` or `dist/` you committed on purpose stays put. If git can't answer, the folder is skipped. | `03-safety.md` |
| 3 | Never follows symlinks | Symlinks are never followed, and hard links are counted once. | README, `01-features.md` |
| 4 | Move to Trash or delete | Delete permanently or move to the Trash, per run or as your default. Trash runs can be undone with Put Back. | `03-safety.md`, Settings |
| 5 | Path guards | Nothing outside your scan roots is removed. Your scan roots, your home folder, `/` and system folders never are. | README |
| 6 | Pinned and active projects | Pin a project or exclude a path and it's never offered. You're warned when a project looks open in an editor or terminal. | README |
| 7 | Risk levels | Every item is Safe, Caution or Danger. Danger needs an extra confirmation. | README |
| 8 | Vault before clean | Optionally require a vault export before cleaning. If the export fails, nothing is deleted. | README CLI, `03-safety.md` |

- **Pull quote next to the confirmation screenshot:** "Sweepkey never deletes anything without your confirmation." *(onboarding welcome string)*
- **Small print:** Sizes are shown as "up to" because APFS clones may share blocks. Unattended cleans (menu bar, schedule, Shortcuts) only touch Safe folders in stale projects, never global caches.

## S7 · CLI
- **Eyebrow:** 04 — For the terminal
- **Title (h2):** The same engine, scriptable.
- **Text:** The `sweepkey` command ships inside the app (Homebrew puts it on your PATH) and as a standalone zip in every release. Plan with `--dry-run`, read `--json`, and use it in scripts.
- **Chips:** `scan` · `clean --dry-run` · `caches` · `vault collect`
- **Terminal commands** (outputs from `assets/cli/`):
  1. `sweepkey scan ~/Projects --stale-only`
  2. `sweepkey clean ~/Projects --dry-run`
  3. `sweepkey caches`
  4. `sweepkey vault collect ~/Projects --to ~/Desktop/vault --format zip`
- **Reference block** (static, below the terminal, collapsible "All commands"):
  ```
  sweepkey scan [paths...] [--json] [--stale-only] [--min-size 100MB]
  sweepkey clean [paths...] [--dry-run] [--trash] [--stale-only] [--rule <id>]... [--yes] [--skip-vault]
  sweepkey caches [--json]
  sweepkey caches clean <group-id>... [--dry-run] [--yes]
  sweepkey vault collect <paths...> --to <dest> [--format folder|zip|dmg] [--uncommitted] [--scan-contents]
  sweepkey vault restore <vault> [--by-remote <searchRoot>...] [--overwrite] [--dry-run]
  sweepkey history [--json]
  ```
- **Fine print:** Exit codes: `0` ok, `1` error, `2` nothing to do. `clean` asks `Proceed? [y/N]` unless you pass `--yes`. Always try `--dry-run` first.
- **Link:** Read the CLI reference → `https://github.com/thisisprabhat/sweepkey#cli`
- **Pause button:** Pause / Play

## S8 · Recipes
- **Eyebrow:** 05 — Recipes
- **Title (h2):** Guided jobs for common situations.
- **Intro (from the app):** Recipes are guided, step-by-step jobs for common situations. Each one combines cleaning and the vault, plans everything first, and shows you the result before anything is deleted.

Cards (title, "when", steps: verbatim from `App/Features/Recipes/RecipesView.swift`; detail line from each recipe view):

**Free Up Space**
- When: Your disk is nearly full and you need a set amount of space back.
- 1. Pick how much space you need
- 2. Sweepkey plans the safest items first
- 3. Review the plan, then clean
- Detail: Picks the safest items first: stale projects, then caches, then other projects. You review the list before anything is deleted.

**Archive a Project**
- When: You're done with a project but want to keep it.
- 1. Save the project's secrets to a vault
- 2. Delete its rebuildable folders
- 3. Optionally zip it and trash the original
- Detail: Saves the project's secrets to a vault, deletes its build artifacts, then optionally zips it and moves the original to the Trash once the zip is verified.

**Move to a New Mac**
- When: You're setting up another Mac and want your projects and secrets there.
- 1. Collect secrets from all projects
- 2. List every git repo and where it lives
- 3. Run restore.sh on the new Mac
- Detail: Writes a bundle with a vault of your secrets, a list of every git repo (`repos.json`) and a `restore.sh` that clones them to the same relative paths. On the new Mac, run `restore.sh`, then restore the vault by git remote.

## S9 · FAQ
- **Eyebrow:** 06 — FAQ
- **Title (h2):** Questions, answered.

Answers are 40–70 words so they work as featured snippets. They also feed the `FAQPage` JSON-LD ([04](04-seo-plan.md)).

**Is it safe?**
Sweepkey is conservative by design. Every clean starts as a dry run: you see each folder, its size and its risk level before you confirm. Folders containing git-tracked files are skipped, symlinks are never followed, nothing outside your scan roots is touched, and Danger items need an extra confirmation. You can also send everything to the Trash instead of deleting it.

**Why does it need Full Disk Access?**
Developer projects often live in places macOS protects, like Desktop, Documents, Downloads and external drives, and some tool caches do too. Without Full Disk Access, scans silently miss those folders and deletions can fail. Sweepkey still works without it, on the folders it can read. Onboarding links straight to the right page in System Settings.

**Where does my data go?**
Nowhere. Sweepkey has no telemetry, no analytics and no accounts. Scans, history and the vault stay on your Mac, and vault contents leave it only if you export them somewhere yourself. The only network request is the Sparkle update check, which fetches the update feed from GitHub Releases.

**Why isn't the app sandboxed?**
A sandboxed app can't clean arbitrary project folders, so the App Sandbox is off for the app. The bundled widget is sandboxed. The app is signed with a Developer ID, uses the Hardened Runtime and is notarized by Apple, and the source is public so you can check exactly what it does.

**How do I uninstall it?**
Quit Sweepkey (turn off "Launch at login" in Settings → Automation first if you enabled it), then drag it from Applications to the Trash. To remove its data too, delete `~/Library/Application Support/Sweepkey` and `~/Library/Preferences/com.prabhatkumar.Sweepkey.plist`. With Homebrew: `brew uninstall --zap --cask sweepkey`. Vaults you exported stay where you saved them.

**Is it open source?**
Yes. Sweepkey is free and open source under the MIT licence, and the code is on GitHub. Cleaning rules are plain JSON, so adding support for a new tool is usually a small pull request. Releases are built by a public GitHub Actions workflow.

**Which Macs does it run on?**
Any Mac running macOS 26 or later. Building from source needs Xcode 27. The download is a single DMG; the `sweepkey` command-line tool is included in the app and is also available as a separate zip.

**Will macOS warn me when I open it?**
No. Every release is signed with an Apple Developer ID and notarized by Apple, and the notarization ticket is stapled to both the app and the DMG, so Gatekeeper opens it without a warning, even offline. You can check with `spctl -a -vv /Applications/Sweepkey.app`, which should report "Notarized Developer ID".

**How does it update?**
Through Sparkle 2, with EdDSA-signed updates published on GitHub Releases. Choose "Check for Updates…" in the app menu, or let it check automatically. If you installed with Homebrew, the cask is marked auto-updating, so Sparkle handles updates there too.

*(Sources: README Safety model, Full Disk Access, Privacy, Install, Releasing; `10-open-source-release.md`; `Casks/sweepkey.rb` (`zap`, `auto_updates true`, `depends_on macos: ">= :tahoe"`); Settings labels in `AutomationSettingsTab.swift`.)*

Note for the launch gate: the "Will macOS warn me" answer is only true once the notarized release exists. The page must not ship before that (see [05](05-download-and-release.md)).

## S10 · Download
- **Eyebrow:** 07 — Download
- **Title (h2):** Get Sweepkey
- **Primary CTA:** Download for Mac — `aria-label="Download Sweepkey {ver} for Mac (DMG, {size})"`
- **Meta:** Version {ver} · {size} · macOS 26 or later · Notarized by Apple · Released {date}
- **Checksum label:** SHA-256 — copy button "Copy checksum"; hint: Verify with `shasum -a 256 ~/Downloads/Sweepkey-{ver}.dmg`
- **Mirror:** Mirror download (this site)
- **Homebrew:** `brew install --cask thisisprabhat/tap/sweepkey` — "Installs the app and puts `sweepkey` on your PATH."
- **CLI only:** Command-line tool only (`sweepkey-{ver}-macos.zip`)
- **Links:** Release notes · Source code · All releases
- **After click note:** Open the DMG and drag Sweepkey to Applications. On first launch, Sweepkey walks you through choosing project folders and Full Disk Access.

Note on file names: the GitHub "latest" button downloads `Sweepkey.dmg`; the mirror and the versioned GitHub asset are `Sweepkey-{ver}.dmg`. All three are the same bytes, so the checksum hint uses whichever name the visitor has; show both names in the `title` of the checksum.

## S11 · Footer
- **Tagline:** Sweep the rebuildable. Keep the keys.
- **Columns:**
  - Product: Features · How it works · Safety · CLI · FAQ · Download
  - Project: GitHub · Releases · Issues · Contributing · Licence (MIT)
- **Privacy note:** This site sets no cookies and uses no tracking. The app has no telemetry: your files never leave your Mac unless you export them.
- **Trademark note:** Ecosystem logos are from Simple Icons (CC0) and remain trademarks of their respective owners; their use does not imply endorsement. Apple, Mac, macOS and Xcode are trademarks of Apple Inc. Sweepkey is not affiliated with Apple.
- **Copyright:** © 2026 Prabhat Kumar. Released under the MIT licence.
- **Theme toggle:** "Switch to light theme" / "Switch to dark theme"

## 404 page
- **Title:** Swept away.
- **Text:** This page could be rebuilt, but we couldn't find it.
- **Button:** Back to Sweepkey

## Feature inventory (for reference, not all on the page)
Kept here so copy edits can be checked quickly. Everything listed is in v1.

| Area | v1 facts | Source |
|---|---|---|
| Scanning | Multiple scan roots; marker-based detection; parallel walker; live results with running total; cancellable; incremental rescans with FSEvents; allocated sizes, hard links counted once; staleness (default 30 days) | `01-features.md` A |
| Project metadata | Last commit date, last modified, branch, remote, dirty state, unpushed commits, stashes, ecosystem icons | `01-features.md` A |
| Rules | JSON rules, 20+ ecosystems, custom rules, per-rule overrides, `.sweepkeyignore`, global excludes, pinning | `02-cleaning-rules.md` |
| Caches | Xcode, Android, package managers, version managers, containers, browser/test tools, IDEs, AI/ML models (opt-in), misc (diagnostic reports opt-in, iOS backups Danger) | `02-cleaning-rules.md` |
| Safety | Dry run, git-tracked guard (fails closed), path guards, active-project guard, pinned projects, stricter unattended cleans, vault-before-clean, risk badges, regenerate hints, APFS-aware sizes | `03-safety.md` |
| Execution | Permanent delete (default) or Trash, progress, cancellable, journal, Put Back for Trash runs, auto rescan with free-space delta | `03-safety.md` |
| Vault | Git-aware detection, default patterns, always-collect (`pubspec.yaml`), optional uncommitted-work mode, optional content scanner, mirror layout, `manifest.json` with SHA-256, folder/zip/encrypted disk image (AES-256; password in Keychain behind Touch ID), versions (last 5), restore by path or git remote, masked previews | `04-secrets-vault.md` |
| Recipes | Free Up Space, Archive a Project, Move to a New Mac, pre-clean safety pass (unpushed commits/stashes) | `05-automation-and-insights.md`, `RecipesView.swift` |
| Automation | Menu bar extra, low-space alert (default 20 GB), scheduled scan / auto-clean / vault snapshot, launch at login, widgets, App Intents/Shortcuts ("Free Up Space"), Finder integration (Dock drop, Services, `sweepkey://` URLs) | `05-automation-and-insights.md` |
| Insights | Dashboard, treemap/sunburst, suggestions (e.g. pnpm/Bun to dedupe `node_modules`) | `05-automation-and-insights.md` |
| Distribution | MIT, notarized DMG on GitHub Releases, CLI zip, Sparkle 2 (EdDSA), Homebrew cask | README, `10-open-source-release.md` |
| Not in v1 | Quick Look, vault diff view, vault reveal/copy, custom-rule live preview, rule import/export, `~/Library/Caches` dev items, automatic cask update | `08-roadmap.md` |
