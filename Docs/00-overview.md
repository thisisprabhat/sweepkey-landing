# 00 · Overview — Sweepkey landing page

> Status: plan approved · 2026-10-27 · Source plan: `~/.claude/plans/now-start-planning-to-swift-castle.md`

## Context
Sweepkey (formerly "Cleaner", repo `/Users/prabhatkumar/Projects/utils/cleaner`) is a native macOS 26+ app with a companion `sweepkey` CLI. It needs a public, interactive landing page with a working DMG download. The site lives in `/Users/prabhatkumar/Projects/creations/websites/sweepKeyLanding/`.

All product facts on the site come from the app repo (`README.md`, `docs/`, `Branding/README.md`, and the app's own UI strings). Nothing is claimed that the v1 app does not do. Features moved to v1.1 (`docs/08-roadmap.md`), such as Quick Look, the vault diff view and vault reveal/copy, are **not** mentioned on the page.

## The product in one paragraph
Sweepkey reclaims disk space by removing regenerable developer files (`node_modules`, `target`, `build`, `.venv`, `Pods`, `DerivedData` and more, across 20+ ecosystems) and developer tool caches (Xcode, Android, package managers, version managers, containers, IDEs). Before you clean, it collects your un-committed secrets (`.env` files, signing keystores, certificates, cloud credentials) into a vault you can restore later, even on a new Mac by matching git remotes. Every clean is a dry run first. It is open source (MIT), has no telemetry, and is distributed outside the App Store.

**Tagline:** *Sweep the rebuildable. Keep the keys.*

## Audience
| Segment | What they want | What the page must show |
|---|---|---|
| **Mac developers with full disks** (primary): JS/TS, iOS/Swift, Flutter, Android, Rust, Python | Tens of GB back without breaking anything | The Sweep demo, the safety model, real numbers from the app UI |
| **Developers changing or archiving** (switching Macs, closing projects) | Not losing `.env` files and signing keys that git never had | The vault, restore by git remote, the Move to a New Mac recipe |
| **Terminal-first and CI users** | A scriptable tool | The CLI section, Homebrew, `--dry-run` / `--json` |
| **Open-source evaluators** | Trust: who made it, what it touches, where data goes | MIT licence, GitHub link, "no telemetry", notarized build, FAQ |

## Goals and success metrics
The site's job is **downloads and Homebrew installs**.

| Goal | Metric | Target / how it is measured |
|---|---|---|
| Downloads | DMG downloads | GitHub Releases `download_count` (via `gh api repos/thisisprabhat/sweepkey/releases`) + mirror hits from nginx access logs (aggregate counts only) |
| Homebrew installs | Tap installs | Third-party taps have no Homebrew analytics; use the GitHub repo traffic page for the tap as a proxy |
| Trust | GitHub stars and issues opened | Trend after launch, no target |
| Quality | Lighthouse | ≥ 95 in Performance, Accessibility, Best Practices and SEO, on mobile and desktop |
| Speed | Core Web Vitals | LCP < 2.0 s (mobile 4G), CLS < 0.05, INP < 200 ms |
| Install success | Gatekeeper | 0 warnings when a fresh Mac opens the downloaded DMG (`spctl -a -vv` reports "Notarized Developer ID") |

Privacy matches the app: no analytics by default. If analytics is added later, it must be cookie-less and privacy-friendly (for example self-hosted Plausible or Umami) and the footer privacy note is updated.

## Decisions (final)
| Topic | Decision |
|---|---|
| Domain | `https://sweepkey.waygosquad.tech` (canonical) |
| DMG hosting | **Both.** Primary button → GitHub Releases (`releases/download/v{ver}/Sweepkey-{ver}.dmg`). A copy on the site at `/downloads/Sweepkey-<version>.dmg` is the mirror. |
| Launch gate | **The DMG must be Developer-ID signed and notarized before the site goes live.** Today's local DMG is ad-hoc signed, so Gatekeeper would warn every visitor. The mirror sync script refuses an un-notarized DMG. |
| Stack | Astro (static output), served by Docker + nginx. Same shape as `deckTv_landing` (Astro, Dockerfile + `nginx.conf`, Playwright). |
| Interactivity | Vanilla JS / small Astro `<script>` islands. No UI framework. |
| Themes | Dark-first (the icon is night-indigo), with a full light theme that follows `prefers-color-scheme`. |
| Screenshots | Mock data only (projects under `/Users/demo`), captured from a DEBUG `-SweepkeyDemo YES` launch argument. No real paths or usernames. |

## Site map
A single long page plus the plumbing.

- **`/`**, in this order:
  1. Nav
  2. Hero
  3. Interactive "Sweep" demo
  4. Works with (logo marquee)
  5. Feature tour (tabs)
  6. Safety
  7. CLI
  8. Recipes
  9. FAQ
  10. Download
  11. Footer
- **`/404`**, `robots.txt`, `sitemap-index.xml`, `site.webmanifest`.
- **`/downloads/Sweepkey-<version>.dmg`** (mirror, static file).

## Stack summary
| Layer | Choice |
|---|---|
| Framework | Astro (static), TypeScript strict |
| Integrations | `@astrojs/sitemap`; Astro `<Picture>` for AVIF/WebP |
| Fonts | Self-hosted via `@fontsource` (see [01](01-design-spec.md)) |
| Data | `src/data/site.ts` (domain, owner, links), `src/data/release.json` (written by `scripts/sync-release.mjs`) |
| Hosting | Docker image: `node` build stage → `nginx:alpine` runtime with `nginx.conf` |
| Tests | Playwright smoke tests, Lighthouse CI run, `astro check` |

## Documents
| File | Contents |
|---|---|
| [01-design-spec.md](01-design-spec.md) | Tokens (dark + light), typography, spacing/radius/shadow scale, motion rules, wireframes and interactions for all 11 sections |
| [02-asset-plan.md](02-asset-plan.md) | Manifest of every file under `assets/`, with source, size, use and status |
| [03-content-and-features.md](03-content-and-features.md) | Final copy for every section, feature-tour blurbs, safety points, recipes, FAQ |
| [04-seo-plan.md](04-seo-plan.md) | Metadata, OG/Twitter, JSON-LD, sitemap/robots, keywords, performance budget |
| [05-download-and-release.md](05-download-and-release.md) | Notarized release, stable download URL, mirror sync, nginx rules, Homebrew, Sparkle, pre-launch checklist |
| [06-implementation-plan.md](06-implementation-plan.md) | Phased checklist with acceptance criteria |

## Open items (need the owner's answer before launch)
- **GitHub owner:** decided — `thisisprabhat` (`scripts/configure-repo.sh thisisprabhat` fills it in the app repo).
- **Homebrew tap name** (default assumption: `thisisprabhat/homebrew-tap`, so `brew install --cask thisisprabhat/tap/sweepkey`).
- **Apple Developer Program membership** and Developer ID Application certificate (blocks the launch gate).
- **Analytics:** decided — none.
