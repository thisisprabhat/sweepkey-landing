# 02 · Asset plan

> Status: all assets pending · 2026-10-27

Every file the page uses lives under `sweepKeyLanding/assets/`, copied or exported from the app repo (`/Users/prabhatkumar/Projects/utils/cleaner`, below written as `cleaner/`). The app repo stays the source of truth: nothing in `assets/` is hand-edited except the composed social images. The site build reads from `assets/` (via `src/assets/` imports or a small copy step) and Astro `<Picture>` produces AVIF/WebP derivatives, so masters stay PNG/SVG.

```
assets/
├─ brand/         app icon PNGs, menubar.svg, wordmarks, tokens
├─ logos/         32 ecosystem SVGs (+7 dark variants)
├─ screenshots/
│  ├─ dark/       15 app screenshots, dark appearance
│  └─ light/      15 app screenshots, light appearance
├─ cli/           captured CLI output for the terminal
└─ social/        OG image, favicons
```

## Rules for every screenshot
- **Mock data only.** Real scans show the owner's project names and paths. Screenshots come from the Debug build launched with `-SweepkeyDemo YES` (a new DEBUG-only flag that makes `AppModel.shared` use the `.preview` services: `PreviewServices` + `MockData`, projects under `/Users/demo`). `MockData` gets 4–6 demo `CleanReport`s so History and the trend chart have data.
- **Capture:** window size 1280×800 pt, captured with `screencapture -l <windowID>` on a Retina display, so files are **2560×1600 PNG** (window shadow included). Sheets are captured with their parent window. Smaller surfaces (menu bar popover, DMG window) are captured at their natural size at 2x.
- **Appearance:** each screen once in dark and once in light (System Settings → Appearance, or `defaults write -g AppleInterfaceStyle`), same window position and same data, so the theme swap on the page is seamless.
- **Review:** open every file and check by eye that only `/Users/demo` and fictional project names appear. No real usernames, hostnames, remotes or secrets. A grep over the CLI text files does the same for `assets/cli/`.
- **Naming:** `NN-screen-name.png`, same name in `dark/` and `light/`.

## 1. `assets/brand/`
| File | Dimensions / format | Source | Used on the page | Status |
|---|---|---|---|---|
| `icon-1024.png` | 1024×1024 PNG, transparent | Exported from `cleaner/App/AppIcon.icon` with Icon Composer (keeps the Liquid Glass look). Fallback: flat composite of `Assets/keyhole.svg`, `sweep.svg`, `sparkles.svg` on the `#3F49B4 → #141739` gradient. | JSON-LD `image`, source for other sizes | pending |
| `icon-512.png` | 512×512 PNG | Same export | Download section (shown at 128–160 CSS px, 2x+) | pending |
| `icon-256.png` | 256×256 PNG | Same export | Hero eyebrow, OG composition | pending |
| `icon-128.png` | 128×128 PNG | Same export | Nav (shown at 32 CSS px), footer | pending |
| `icon-64.png` | 64×64 PNG | Same export | Small UI uses, fallback favicon source | pending |
| `icon-dark-1024.png` | 1024×1024 PNG | Icon Composer, dark look (`#333B99 → #0D0F29`) | Optional: swap in dark theme | pending |
| `keyhole.svg`, `sweep.svg`, `sparkles.svg` | SVG | `cleaner/App/AppIcon.icon/Assets/` (copied as is) | Keyhole motif in hero background and vault cards; sweep stroke; sparkle bullets | pending |
| `menubar.svg` | SVG, one-colour template | `cleaner/App/Assets.xcassets/MenuBarIcon.imageset/MenuBarIcon.svg` | Feature-tour/automation mention next to the menu bar screenshot | pending |
| `wordmark.svg` | SVG, outlined text | Extracted from `cleaner/Branding/dmg-background.svg` ("Sweep" in ink `#161A3A`, "key" in indigo `#3F49B4`, SF Pro Display Bold). Convert text to outlines so no font is needed. | Light theme nav and footer | pending |
| `wordmark-dark.svg` | SVG, outlined text | Derived from `wordmark.svg`: "Sweep" in `#EEF0FF`, "key" in mint `#5DE3B8` | Dark theme nav and footer | pending |
| `tokens.json` | JSON | Written from [01](01-design-spec.md) §1 (brand + derived values, dark and light) | Reference for design tools; imported by `src/styles/tokens.css` generator (optional) | pending |
| `tokens.css` | CSS custom properties | Same values as `tokens.json` | Imported by `src/styles/global.css` | pending |

## 2. `assets/logos/` — "Works with" strip
Copied from `cleaner/App/Assets.xcassets/EcosystemLogos/<name>.imageset/<name>.svg`. These are **Simple Icons** (CC0). The logos themselves **remain trademarks of their owners**; the footer carries a trademark note and the page never implies endorsement.

**The VS Code logo is intentionally absent**: it is not in the app's logo set, and the app's set is the source of truth for this strip. Do not add it, even though the app cleans VS Code extension caches.

| File | Format | Dark variant | Status |
|---|---|---|---|
| `android.svg` | SVG | — | pending |
| `bazel.svg` | SVG | — | pending |
| `cocoapods.svg` | SVG | — | pending |
| `cpp.svg` | SVG | — | pending |
| `docker.svg` | SVG | — | pending |
| `dotnet.svg` | SVG | — | pending |
| `elixir.svg` | SVG | `elixir-dark.svg` | pending |
| `flutter.svg` | SVG | — | pending |
| `go.svg` | SVG | — | pending |
| `gradle.svg` | SVG | `gradle-dark.svg` | pending |
| `haskell.svg` | SVG | — | pending |
| `homebrew.svg` | SVG | — | pending |
| `huggingface.svg` | SVG | — | pending |
| `javascript.svg` | SVG | — | pending |
| `jetbrains.svg` | SVG | `jetbrains-dark.svg` | pending |
| `jvm.svg` | SVG | — | pending |
| `nodejs.svg` | SVG | — | pending |
| `npm.svg` | SVG | — | pending |
| `ollama.svg` | SVG | `ollama-dark.svg` | pending |
| `php.svg` | SVG | — | pending |
| `pnpm.svg` | SVG | — | pending |
| `python.svg` | SVG | — | pending |
| `ruby.svg` | SVG | — | pending |
| `rust.svg` | SVG | `rust-dark.svg` | pending |
| `scala.svg` | SVG | — | pending |
| `swift.svg` | SVG | — | pending |
| `terraform.svg` | SVG | — | pending |
| `unity.svg` | SVG | `unity-dark.svg` | pending |
| `unreal.svg` | SVG | `unreal-dark.svg` | pending |
| `xcode.svg` | SVG | — | pending |
| `yarn.svg` | SVG | — | pending |
| `zig.svg` | SVG | — | pending |

All 32 (+7 dark) are used in **S4 · Works with**. The marquee renders them monochrome via CSS `mask-image` and in brand colour on hover, so the files are used as is. Ollama, Hugging Face and JetBrains appear because the app cleans their caches (AI model caches are opt-in in the app; the page does not need to say more than "caches").

## 3. `assets/screenshots/{dark,light}/`
Each row is two files (dark + light). Window captures are 2560×1600 PNG unless noted.

| File | Screen (demo data) | Dimensions / format | Used on the page | Status |
|---|---|---|---|---|
| `01-dashboard.png` | Dashboard: tiles, category card and treemap | 2560×1600 PNG | Hero window (frame 1); OG image composition | pending |
| `02-projects-inspector.png` | Projects with the inspector open | 2560×1600 PNG | Hero window (frame 2); Feature tour → Projects | pending |
| `03-clean-confirmation.png` | The clean confirmation sheet (list, total, risk badges) | 2560×1600 PNG | Safety section | pending |
| `04-clean-result.png` | The clean result (freed space, free space before/after) | 2560×1600 PNG | Feature tour → History (inset) or Safety (alt) | pending |
| `05-caches.png` | Global Caches, with ecosystem logos | 2560×1600 PNG | Feature tour → Caches | pending |
| `06-vault-findings.png` | Vault findings, with file and framework icons, masked previews | 2560×1600 PNG | Hero window (frame 3); Feature tour → Vault | pending |
| `07-vault-export.png` | Vault export sheet (folder / zip / encrypted disk image) | 2560×1600 PNG | Feature tour → Vault (second image) | pending |
| `08-history.png` | History list with lifetime reclaimed and trend chart | 2560×1600 PNG | Feature tour → History | pending |
| `09-history-detail.png` | History details sheet | 2560×1600 PNG | Feature tour → History (second image) | pending |
| `10-rules.png` | Rules, with the help card | 2560×1600 PNG | Feature tour → Rules | pending |
| `11-rules-editor.png` | Rules editor sheet (custom rule) | 2560×1600 PNG | Feature tour → Rules (second image) | pending |
| `12-recipes.png` | Recipes cards | 2560×1600 PNG | Recipes section; Feature tour → Recipes | pending |
| `13-onboarding-welcome.png` | Onboarding welcome step | 2560×1600 PNG | FAQ "Full Disk Access" (optional thumbnail) | pending |
| `14-menubar-popover.png` | Menu bar popover (free-space gauge, reclaimable, quick clean) | natural size at 2x, about 720×900 PNG, transparent background | Feature tour → History/automation note | pending |
| `15-dmg-installer.png` | The DMG installer window (`Branding/dmg-background`) | 1320×800 PNG (660×400 pt at 2x) | Download section post-click hint | pending |

Notes:
- The DMG window background is the same in both appearances, but Finder's chrome is not, so capture both.
- Feature-tour panels with two images show the second as a smaller overlapping inset.
- Page weight: the build produces AVIF/WebP at 640, 960, 1280 and 1920 widths; only the hero frame 1 is eager-loaded.

### Alt text (used on the page)
| File | Alt |
|---|---|
| `01-dashboard` | Sweepkey dashboard showing reclaimable space by category and a treemap of projects (demo data) |
| `02-projects-inspector` | Projects list with a selected project's rebuildable folders, sizes and regenerate commands in the inspector |
| `03-clean-confirmation` | Confirmation sheet listing every folder to be removed, its size and risk level, before anything is deleted |
| `04-clean-result` | Clean result showing space freed and the disk's free space before and after |
| `05-caches` | Global developer caches grouped by tool, such as Xcode, package managers and containers |
| `06-vault-findings` | Vault listing secret files found in projects, such as .env files and keystores, with values masked |
| `07-vault-export` | Vault export options: plain folder, zip, or encrypted disk image |
| `08-history` | History of past cleans with lifetime space reclaimed and a trend chart |
| `09-history-detail` | Details of one clean, item by item |
| `10-rules` | Cleaning rules by ecosystem, with a help card explaining markers and risk |
| `11-rules-editor` | Editor for a custom cleaning rule with marker files, target and risk level |
| `12-recipes` | Recipes: Free Up Space, Archive a Project and Move to a New Mac |
| `13-onboarding-welcome` | Sweepkey welcome screen |
| `14-menubar-popover` | Menu bar popover with free space, reclaimable total and a quick clean button |
| `15-dmg-installer` | Sweepkey installer window: drag the app to Applications |

## 4. `assets/cli/`
Real output of the release CLI, run against the demo fixture (a temp tree under `/Users/demo`-style paths, or a scratch folder whose path is rewritten to `~/Projects`). Plain UTF-8 text, ANSI colour stripped (the terminal component adds its own colours), one file per command. The first line of each file is the command itself.

| File | Command | Used on the page | Status |
|---|---|---|---|
| `scan.txt` | `sweepkey scan ~/Projects --stale-only` | CLI terminal, command 1 | pending |
| `clean-dry-run.txt` | `sweepkey clean ~/Projects --dry-run` | CLI terminal, command 2 | pending |
| `caches.txt` | `sweepkey caches` | CLI terminal, command 3 | pending |
| `vault-collect.txt` | `sweepkey vault collect ~/Projects --to ~/Desktop/vault --format zip` | CLI terminal, command 4 | pending |
| `help.txt` | `sweepkey --help` | Reference for the CLI section copy (not shown) | pending |

Note: the source plan names `vault collect --dry-run`, but `vault collect` has no `--dry-run` flag (only `clean`, `caches clean` and `vault restore` do; see `Packages/SweepkeyKit/Sources/SweepkeyCLI/`). The terminal therefore shows `clean --dry-run` plus a real `vault collect` into a throwaway folder. Re-check the fixture output for real paths before committing.

## 5. `assets/social/`
| File | Dimensions / format | Source | Used on the page | Status |
|---|---|---|---|---|
| `og-image.png` | 1200×630 PNG (< 300 KB) | Composed: `--night` gradient, `icon-256.png`, `wordmark-dark.svg`, the tagline, and a cropped `screenshots/dark/01-dashboard.png` at an angle. Rendered with Playwright from a small HTML template (`scripts/render-og.mjs`). | `og:image`, `twitter:image` | pending |
| `og-image.jpg` | 1200×630 JPEG q85 | Same render | Fallback for platforms that prefer JPEG (optional) | pending |
| `favicon.svg` | SVG | Flat keyhole + sweep on the indigo gradient (simplified from the icon layers; must read at 16px) | `<link rel="icon" type="image/svg+xml">` | pending |
| `favicon-32.png` | 32×32 PNG | From `favicon.svg` | `<link rel="icon" sizes="32x32">` | pending |
| `apple-touch-icon.png` | 180×180 PNG, no transparency | From `icon-1024.png` on `#141739` | `<link rel="apple-touch-icon">` | pending |
| `icon-192.png`, `icon-512.png` | PNG | From `icon-1024.png` | `site.webmanifest` | pending |

## 6. Not collected (and why)
| Item | Reason |
|---|---|
| `cleaner/docs/images/icon.png` | Duplicate of the icon export; use the Icon Composer export instead. |
| `Branding/dmg-background.tiff` | Installer art; shown on the page only through the DMG window screenshot. |
| VS Code logo | Intentionally absent (see §2). |
| Real-scan screenshots | Privacy: contain the owner's paths and project names. |
| Generated "sweep" background art (optional, via `gemini-image-harvest`) | Only if the CSS gradient + keyhole motif looks flat in review. If made, add rows here first. |

## Collection status (27 Oct 2026)

Collected into `assets/`. Screenshots use the app's DEBUG demo mode (`-SweepkeyDemo YES`, fake projects under `/Users/demo`), so no real paths appear.

| Asset | Status | Notes |
|---|---|---|
| `screenshots/{dark,light}/` dashboard, projects, caches, vault, history, rules, recipes | Done | 2560×1600 (1280×800 @2x), window only, no shadow |
| `screenshots/dark/vault-findings.png` | Done | Findings expanded: framework logos + file-type icons |
| `screenshots/dark/projects-selected.png` | Done | Two projects ticked, action bar "4 selected · 5.79 GB" |
| Sheets: clean confirmation, clean result, history details, rule editor, vault export; Projects inspector; menu bar popover; onboarding; DMG installer window | Pending | Need a focused window (menu shortcuts are disabled in the background). Capture when the Mac is free, with the scripts below. |
| Active-window re-shoot of all screens | Optional | Current shots were taken in the background, so traffic lights and sidebar selection look inactive. |
| `brand/icon.svg`, `icon-{1024,512,256,128,64}.png` | Done | Flat web rendition of `App/AppIcon.icon` (no Liquid Glass). Swap for an Icon Composer export if wanted. |
| `brand/icon-layer-{keyhole,sweep,sparkles}.svg`, `menubar.svg`, `dmg-background.svg` | Done | Copied from the app repo |
| `brand/wordmark.svg`, `wordmark-dark.svg`, `colors.json`, `colors.css` | Done | Tokens match `01-design-spec.md` |
| `logos/*.svg` | Done | 32 logos + 7 dark variants (Simple Icons 13.21.0, CC0; trademarks of their owners; no VS Code logo) |
| `cli/scan.txt`, `cli/clean-dry-run.txt`, `cli/vault-collect.txt` | Done | Real CLI output against a throwaway fixture; paths rewritten to `~/Projects/...` |
| `social/og-image.png` (1200×630), `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Done | OG composed from icon, wordmark, tagline and the dark Dashboard shot |

**Re-capturing:** build the app (`make build` in the app repo), then use `assets/scripts/launch.sh <tab> <dark|light>` and `assets/scripts/capture.sh <out.png>` (compile `winid.swift` next to them first: `swiftc -O winid.swift -o winid`). The scripts launch the Debug build with `-ApplePersistenceIgnoreState YES -SweepkeyDemo YES -SweepkeyStartTab <tab>` at a 1280×800 window frame, and capture with `screencapture -x -o -l <windowID>`. Demo settings live in `$TMPDIR/sweepkey-preview-settings.json` (`hasCompletedOnboarding: true`, scan root `/Users/demo/Projects/`).


## Final asset set (27 Oct 2026, redesign)
Only what the page uses is kept (user request: "only add the required assets").

| Folder | Files | Used by |
|---|---|---|
| `screenshots/{light,dark}/` | `dashboard` (hero until the GIF exists), `projects-inspector`, `caches`, `vault-findings`, `history`, `rules`, `recipes` (feature tour), `clean-confirm` (Safety) | Light shots for the light theme, dark for graphite dark mode |
| `brand/` | `icon.svg`, `icon-1024.png` (source), `icon-512.png` (hero, Download), `icon-128.png` (nav) | |
| `logos/` | 32 Simple Icons SVGs + 7 dark variants | Works-with strip, demo disk |
| `cli/` | `scan.txt`, `clean-dry-run.txt`, `vault-collect.txt` | CLI terminal |
| `social/` | `og-image.png` (1200×630, light), `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` (web manifest) | Head tags, `site.webmanifest` |
| `video/` | `sweepkey-demo.gif` (958×652, 16.5 s, 12 fps, 2.8 MB) | Hero. Made from the user's 27 Oct recording with the stretches showing real project names cut out (kept 0–4.4 s, 9.2–11.9 s, 16.6 s–end) and the black margin cropped; command in `scripts/mov-to-gif.swift` |

Removed as unused: the other sheet captures, the old `projects`/`projects-selected`/empty `vault` shots, icon layers, menu bar SVG, DMG background, wordmarks and colour token files. Capture tooling moved to `scripts/capture/`.
