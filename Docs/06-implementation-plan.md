# 06 · Implementation plan — Sweepkey landing page

> **For agentic workers:** use superpowers:executing-plans (inline) or superpowers:subagent-driven-development. Steps use `- [ ]` checkboxes. Read docs 00–05 first; they are the spec. Each task ends with **Accept when**: do not tick a task until every criterion is checked.

**Goal:** a static Astro site at `sweepKeyLanding/` for `https://sweepkey.waygosquad.tech`, with the 11 sections in [01](01-design-spec.md), copy from [03](03-content-and-features.md), SEO from [04](04-seo-plan.md), and a working DMG download (GitHub latest + site mirror) per [05](05-download-and-release.md). Launch is gated on a notarized DMG.

**Stack:** Astro (static, TS strict), `@astrojs/sitemap`, `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/geist`, `@fontsource-variable/jetbrains-mono`, sharp (via Astro). No UI framework; client code is plain `<script>` islands. Docker (`node` build → nginx runtime). Playwright for smoke tests.

**Skills along the way:** frontend-design and ui-ux-pro-max (Phase 3), cmux-cua for driving the app during capture (Phase 2), claude-in-chrome + web-design-reviewer (Phase 5), verification-before-completion (Phases 5–6). Optional: gemini-image-harvest (OG/background art).

## File structure (target)
```
sweepKeyLanding/
├─ Docs/                     00…06 (this set)
├─ assets/                   brand/ logos/ screenshots/{dark,light}/ cli/ social/   (see 02)
├─ astro.config.mjs  package.json  tsconfig.json  playwright.config.ts
├─ Dockerfile  nginx.conf  .dockerignore  .gitignore
├─ public/   robots.txt  site.webmanifest  favicon.svg  favicon-32.png  apple-touch-icon.png
│            icon-192.png  icon-512.png  og-image.png  downloads/ (DMG mirror, git-ignored)
├─ scripts/  sync-release.mjs  sync-assets.mjs  render-og.mjs
├─ src/
│  ├─ data/        site.ts  release.json  release.ts  demo.ts  tour.ts  faq.ts  cli.ts  logos.ts
│  ├─ lib/         jsonld.ts  format.ts
│  ├─ styles/      tokens.css  global.css
│  ├─ layouts/     Base.astro
│  ├─ components/  Seo.astro  Nav.astro  Footer.astro  Section.astro  Button.astro
│  │               CopyButton.astro  CodePill.astro  Screenshot.astro  RiskBadge.astro
│  │               ThemeToggle.astro
│  ├─ sections/    Hero.astro  SweepDemo.astro  WorksWith.astro  FeatureTour.astro
│  │               Safety.astro  Cli.astro  Recipes.astro  Faq.astro  Download.astro
│  ├─ scripts/     sweep-demo.ts  tabs.ts  terminal.ts  accordion.ts  marquee.ts  counters.ts
│  ├─ assets/      (copied from ../assets by sync-assets.mjs)
│  └─ pages/       index.astro  404.astro
└─ tests/          smoke.spec.ts  a11y.spec.ts  reduced-motion.spec.ts
```

---

## Phase 1 — Docs (done)

### Task 1.1: Planning docs
- [x] `Docs/00-overview.md` — product, audience, goals, decisions, site map
- [x] `Docs/01-design-spec.md` — tokens, type, scale, motion, wireframes for 11 sections
- [x] `Docs/02-asset-plan.md` — asset manifest
- [x] `Docs/03-content-and-features.md` — all copy, checked against the app docs
- [x] `Docs/04-seo-plan.md` — metadata, JSON-LD, robots/sitemap, keywords, budget
- [x] `Docs/05-download-and-release.md` — release pipeline, mirror, nginx, Homebrew, Sparkle, checklist
- [x] `Docs/06-implementation-plan.md` — this file

**Accept when:** all seven files exist; every product claim in 03 cites an app-repo source; owner/version/size are the only placeholders. Done.

---

## Phase 2 — Assets

> **Status 27 Oct 2026:** tasks 2.1 and 2.3–2.6 are done (see `02-asset-plan.md` → *Collection status*). Task 2.2 is partly done: 17 screenshots exist; the sheets, inspector, menu bar popover, onboarding and DMG window still need a focused-window capture. New: the user's screen recording becomes `assets/video/sweepkey-demo.{mp4,gif}` via `scripts/mov-to-gif.swift` once the file is saved to a readable path.

### Task 2.1: Demo-data launch flag (app repo)
- [ ] `App/Platform/AppRuntime.swift`: add a DEBUG-only `-SweepkeyDemo YES` argument, following the existing DEBUG-flag pattern there.
- [ ] `App/Automation/SafeClean.swift`: when the flag is set, `AppModel.shared` uses `.preview` services (`PreviewServices` + `MockData`, projects under `/Users/demo`).
- [ ] `App/Services/MockData.swift`: add 4–6 demo `CleanReport`s (mixed permanent/Trash, different dates) so History and the trend chart have data.
- [ ] Optional: a DEBUG start-tab argument (e.g. `-SweepkeyStartTab vault`) to open a given sidebar item for capture.
- [ ] `make test` still passes.

**Accept when:** a Release build ignores the flag (it is compiled out); a Debug build launched with `-SweepkeyDemo YES` shows only `/Users/demo` projects, the History list and the trend chart have data, and nothing reads or writes the real `~/Library/Application Support/Sweepkey`.

### Task 2.2: Screenshots
- [ ] Launch the Debug build with the flag; set the window to 1280×800 pt.
- [ ] Capture the 15 screens in [02](02-asset-plan.md) §3 with `screencapture -l <windowID>` (cmux-cua or the start-tab flag to navigate), dark appearance → `assets/screenshots/dark/`.
- [ ] Repeat in light appearance → `assets/screenshots/light/`, same window position and state.
- [ ] Capture the menu bar popover and the DMG installer window (mount a locally built DMG).
- [ ] Review every image by eye for real names/paths.

**Accept when:** 30 PNGs exist with the exact names from 02; window captures are 2560×1600; dark/light pairs match frame-for-frame; no real usernames, hostnames, remotes or secrets are visible; manifest status updated to "done".

### Task 2.3: Brand assets
- [ ] Export `icon-1024/512/256/128/64.png` (and optional dark look) from `App/AppIcon.icon` with Icon Composer; fallback: composite the three layer SVGs on the indigo gradient.
- [ ] Copy `keyhole.svg`, `sweep.svg`, `sparkles.svg`, and `MenuBarIcon.svg` → `menubar.svg`.
- [ ] Extract the wordmark from `Branding/dmg-background.svg`, outline the text → `wordmark.svg`; recolour → `wordmark-dark.svg`.
- [ ] Write `tokens.json` and `tokens.css` from [01](01-design-spec.md) §1.

**Accept when:** all `assets/brand/` rows in 02 exist; the wordmark renders identically with no fonts installed; tokens files match 01 exactly.

### Task 2.4: Logos
- [ ] Copy the 32 SVGs + 7 `-dark` variants from `App/Assets.xcassets/EcosystemLogos/*/` to `assets/logos/` (flat).

**Accept when:** 39 SVG files; no VS Code logo; names match the 02 table.

### Task 2.5: CLI captures
- [ ] Build the release CLI (`make cli`); create the demo fixture tree (scratch folder with the fictional projects from 03 and their marker files + small artifact folders).
- [ ] Run the four commands from [02](02-asset-plan.md) §4 plus `--help`; strip ANSI; rewrite the scratch path to `~/Projects`; save to `assets/cli/`.

**Accept when:** 5 text files exist; each starts with its command; `grep -rn "/Users/" assets/cli | grep -v "/Users/demo"` finds nothing; output is real (not hand-written).

### Task 2.6: Social images
- [ ] `scripts/render-og.mjs`: Playwright renders a 1200×630 HTML template (night gradient, icon, dark wordmark, tagline, angled dashboard crop) → `assets/social/og-image.png`.
- [ ] Make `favicon.svg` (simplified keyhole + sweep), then `favicon-32.png`, `apple-touch-icon.png` (180, opaque), `icon-192/512.png`.

**Accept when:** OG image < 300 KB and readable at 600×315; favicon legible at 16px in both browser themes; all `assets/social/` rows done.

---

## Phase 3 — Site build

> **Status 27 Oct 2026:** the site is built (Astro 5.18.2, pinned; local Node is 20, Astro 6+ needs 22). `npm run check` has 0 errors, 6 Playwright smoke tests pass, and there is no horizontal scroll from 320 to 1600 px wide in either theme. Deviations from the wireframes, by design: the interactive Sweep demo *is* the hero (a disk treemap), section eyebrow labels ("01 — …") were dropped, and Safety is a checklist rather than cards. Docker: `docker compose up -d --build` builds and runs it on http://localhost:8090, `nginx -t` passes and the container reports healthy. Not done yet: Lighthouse run, the "See it run" video (waiting on the recording), and the launch tasks (notarized release, deploy).

### Task 3.1: Scaffold
- [ ] `npm create astro@latest . -- --template minimal --typescript strict --no-git --install` (inside `sweepKeyLanding/`, keeping `Docs/` and `assets/`).
- [ ] Install `@astrojs/sitemap` and the three fontsource packages; dev deps `@playwright/test`, `@astrojs/check`, `typescript`.
- [ ] `astro.config.mjs`: `site: 'https://sweepkey.waygosquad.tech'`, sitemap (exclude 404), `trailingSlash: 'never'`, `build.format: 'file'`.
- [ ] Scripts: `dev`, `build`, `preview`, `check`, `test`, `assets` (`node scripts/sync-assets.mjs`), `sync-release` (`node scripts/sync-release.mjs`).
- [ ] `.gitignore`: `node_modules`, `dist`, `public/downloads/*.dmg`, `test-results`.

**Accept when:** `npm run build` and `npx astro check` pass on the empty template.

### Task 3.2: Tokens, base layout, data
- [ ] `src/styles/tokens.css` (from `assets/brand/tokens.css`) and `global.css`: reset, themes (`[data-theme]` + `prefers-color-scheme`), type scale, focus ring, reveal utilities, reduced-motion overrides.
- [ ] `src/layouts/Base.astro`: head theme script (no flash), `Seo`, font preloads, skip link, `Nav`, `<main id="main">`, `Footer`.
- [ ] `src/data/site.ts` (URLs, owner, brew command), `demo.ts`, `tour.ts`, `faq.ts`, `cli.ts` (reads `assets/cli/*.txt` at build), `logos.ts`.
- [ ] `src/data/release.ts`: loads `release.json`, validates (see 05), exports typed values and formatted labels.
- [ ] `scripts/sync-assets.mjs`: copies `assets/` into `src/assets/` and the favicons/OG into `public/`.

**Accept when:** a blank page renders with the full `<head>` from 04; theme follows the OS and the toggle persists without a flash; build fails when `release.json` is absent.

### Task 3.3: Shared components
- [ ] `Seo.astro` + `lib/jsonld.ts` (WebSite, SoftwareApplication, SoftwareSourceCode, FAQPage).
- [ ] `Nav.astro` (sticky, active-section underline, mobile sheet), `Footer.astro`, `Section.astro`, `Button.astro`, `CopyButton.astro` (clipboard + `aria-live`), `CodePill.astro`, `Screenshot.astro` (`<picture>` with theme sources, AVIF/WebP, width/height), `RiskBadge.astro`, `ThemeToggle.astro`.

**Accept when:** components render in both themes; copy buttons work by keyboard and announce "Copied"; screenshots swap with the theme without layout shift.

### Task 3.4: Hero (S2)
- [ ] Headline with one-time sweep stroke; subhead; Download button (latest URL) with meta from `release.json`; brew pill.
- [ ] Mock window cross-fading 3 screenshots with pause/play; reclaimable counter.

**Accept when:** matches 01 S2 at 390/768/1280/1600; LCP element is preloaded; cross-fade pauses on hover/focus/hidden tab; reduced motion shows one static frame.

### Task 3.5: Sweep demo (S3)
- [ ] `SweepDemo.astro` renders the fixture from `demo.ts` as real checkboxes + secret rows.
- [ ] `scripts/sweep-demo.ts`: live total on the button, dry-run confirmation panel, FLIP of secrets into the Vault card, row sweep/collapse, Freed counter, result live region, Reset.
- [ ] No-JS static fallback.

**Accept when:** all behaviours in 01 S3 work by mouse, touch and keyboard; the live region announces the result; Reset restores the initial state; reduced motion has no movement but the same end state; no layout shift outside the stage.

### Task 3.6: Works with (S4)
- [ ] Two-row marquee from `logos.ts`, mask-based monochrome, colour on hover/focus, dark variants by theme, pause control, off-screen pause.

**Accept when:** 32 logos named for screen readers once (duplicates `aria-hidden`); static grid in reduced motion and under 640px.

### Task 3.7: Feature tour (S5)
- [ ] `FeatureTour.astro` with six tabs from `tour.ts`; `scripts/tabs.ts` implementing the WAI-ARIA tabs pattern (arrows, Home/End, automatic activation), sliding indicator, hash deep links (`#tour-vault`).

**Accept when:** keyboard behaviour matches the APG tabs pattern; all panels' text is in the HTML; `/#tour-vault` opens the Vault tab; mobile pills scroll-snap.

### Task 3.8: Safety (S6) and Recipes (S8)
- [ ] Eight safety cards + confirmation screenshot + small print.
- [ ] Three recipe cards with verbatim app copy + Recipes screenshot.

**Accept when:** copy matches 03 word for word; grids reflow 4→2→1 and 3→1.

### Task 3.9: CLI terminal (S7)
- [ ] `Cli.astro` + `scripts/terminal.ts`: typing, line-by-line output, command chips, per-command copy, pause, start at 40% visible, one pass then stop; screen-reader transcript; reference block.

**Accept when:** fixed height (no CLS); copy copies the command only; reduced motion shows the whole transcript; output text equals the files in `assets/cli/`.

### Task 3.10: FAQ (S9)
- [ ] `Faq.astro` from `faq.ts`; `scripts/accordion.ts` (buttons in `h3`, `aria-expanded`, animated height, `#faq-<slug>` deep links, `hidden="until-found"`).

**Accept when:** Enter/Space toggle; multiple items open; find-in-page reveals collapsed answers where supported; FAQPage JSON-LD has the same 9 Q&As.

### Task 3.11: Download (S10), Footer (S11), 404
- [ ] Download section: primary (latest URL), meta, checksum + copy, verify hint, mirror, brew, CLI zip, notes, post-click note with DMG screenshot.
- [ ] Footer with privacy and trademark notes, theme toggle.
- [ ] `404.astro` with copy from 03.

**Accept when:** every value comes from `release.json`/`site.ts`; mirror link resolves to a file in `public/downloads/`; the trademark note mentions Simple Icons (CC0) and owners' trademarks.

### Task 3.12: Design pass
- [ ] Run frontend-design and ui-ux-pro-max over the built page; fix spacing, rhythm, contrast and hover/focus states.

**Accept when:** no section reads as a generic template; both themes reviewed; contrast checks pass.

### Task 3.13: Docker
- [ ] `Dockerfile`: `node:22-alpine` build stage (`npm ci && npm run build`) → `nginxinc/nginx-unprivileged:alpine` with `nginx.conf` from 05 and `dist/`; `HEALTHCHECK` on `/healthz`.
- [ ] `.dockerignore` excludes `node_modules`, `dist`, `Docs`, `tests`, but **not** `public/downloads`.

**Accept when:** `docker build` succeeds; `docker run -p 8080:8080` serves `/`, `/healthz` → 200, unknown path → 404 page with status 404.

---

## Phase 4 — Download wiring

### Task 4.1: Unversioned DMG asset (app repo)
- [ ] Edit the "Create GitHub Release" step in `cleaner/.github/workflows/release.yml` as in [05](05-download-and-release.md) step 6.

**Accept when:** a release run uploads `Sweepkey-{ver}.dmg`, `Sweepkey.dmg`, `appcast.xml` and `sweepkey-{ver}-macos.zip`; the two DMGs have the same SHA-256.

### Task 4.2: `scripts/sync-release.mjs` (site)
- [ ] Implement per 05: notarization gate (`spctl … primary-signature` + `source=Notarized Developer ID` + `stapler validate`), SHA-256 + size, optional GitHub cross-check, atomic copy to `public/downloads/`, prune old DMGs, write `src/data/release.json`.

**Accept when:** an ad-hoc-signed DMG (from `scripts/make-dmg.sh`) is refused with a clear message and nothing is written; a notarized DMG produces a valid `release.json` and mirror file; running twice is idempotent.

### Task 4.3: nginx download rules
- [ ] `nginx.conf` per 05 (MIME, attachment, immutable caching, 404 for missing, security headers, `/healthz`).

**Accept when:** in the local container, `curl -I /downloads/Sweepkey-{ver}.dmg` → 200, `application/x-apple-diskimage`, `attachment`, correct length; a missing DMG → 404; `/_astro/*` immutable; HTML `no-cache`.

### Task 4.4: Release prerequisites (owner actions, from 05)
- [ ] GitHub repo `thisisprabhat/sweepkey` created; `scripts/configure-repo.sh thisisprabhat` run and committed.
- [ ] Developer ID certificate + `sweepkey-notary` profile; Sparkle keys; 7 Actions secrets.
- [ ] Homebrew tap `thisisprabhat/homebrew-tap` with the cask.
- [ ] Replace `thisisprabhat` in `src/data/site.ts`.

**Accept when:** `git grep OWNER` in the app repo is clean apart from the two scripts; no `thisisprabhat` in the site source.

### Task 4.5: First notarized release
- [ ] Tag `v0.1.0`; CI publishes the release; update the cask `version`/`sha256`.
- [ ] `npm run sync-release` → commit `release.json`.

**Accept when:** all "Release" items in the 05 pre-launch checklist are ticked.

---

## Phase 5 — QA

### Task 5.1: Build checks
- [ ] `npm run build`, `npx astro check` with zero errors.
- [ ] `grep -r "OWNER\|thisisprabhat\|{ver}\|{size}" dist/` is empty.

**Accept when:** both pass.

### Task 5.2: Playwright smoke tests
- [ ] `tests/smoke.spec.ts`: all 11 sections render (`#demo`, `#ecosystems`, `#tour`, `#safety`, `#cli`, `#recipes`, `#faq`, `#download`, nav, hero, footer); Download `href` equals the GitHub latest URL; mirror link points to an existing `/downloads/*.dmg` (HEAD 200); checksum on page equals `release.json`.
- [ ] Demo: select items → Sweep → confirm → Freed counter > 0, Vault card lists 3 files; Reset restores.
- [ ] Tabs: ArrowRight moves selection; `/#tour-vault` opens Vault.
- [ ] FAQ: focus a question, Enter opens, `aria-expanded="true"`, Enter closes.
- [ ] `tests/reduced-motion.spec.ts`: with `reducedMotion: 'reduce'`, no running CSS animations after load (`document.getAnimations()` empty), terminal shows full transcript, marquee static.
- [ ] `tests/a11y.spec.ts`: axe-core scan with no serious/critical issues in both themes.

**Accept when:** `npx playwright test` passes in Chromium and WebKit.

### Task 5.3: Lighthouse
- [ ] Run on the production build (container) for mobile and desktop.

**Accept when:** ≥ 95 in Performance, Accessibility, Best Practices and SEO in both; budgets in 04 met (JS < 35 KB gz, no third-party requests).

### Task 5.4: Visual review
- [ ] web-design-reviewer with Claude in Chrome at 390, 768, 1280 and 1600 px, light and dark; fix issues at the source.

**Accept when:** no horizontal scroll at any width; no overlapping or clipped text; focus rings visible everywhere; screenshots crisp on 2x.

### Task 5.5: Content and privacy review
- [ ] Re-read every line of copy against 03 and the app docs; nothing from the v1.1 list is claimed.
- [ ] Re-check every screenshot and CLI file for real names/paths.
- [ ] JSON-LD passes the Schema.org validator and Rich Results Test.

**Accept when:** all three are clean.

---

## Phase 6 — Launch

### Task 6.1: Deploy
- [ ] DNS `sweepkey.waygosquad.tech` → host; TLS certificate; `http` → `https` redirect.
- [ ] Build and run the container on the host behind the reverse proxy.

**Accept when:** `https://sweepkey.waygosquad.tech/` serves the page with a valid certificate; `/healthz` 200.

### Task 6.2: Post-deploy download verification
- [ ] `curl -sIL` on the GitHub latest URL → 200 after redirect; `curl -sI` on the mirror → 200 with the right type and disposition.
- [ ] Both downloads hash to the page's SHA-256.
- [ ] On a second Mac or a fresh user account: download via the page, open the DMG, drag to Applications, launch — **no Gatekeeper warning**; `spctl -a -vv` → "Notarized Developer ID".
- [ ] `brew install --cask thisisprabhat/tap/sweepkey` on a clean machine works.

**Accept when:** every item above passes. This is the launch gate.

### Task 6.3: Announce and follow up
- [ ] Set the GitHub repo website to the domain; add the site link to the app README.
- [ ] Submit `sitemap-index.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Record day-1 baseline: GitHub release download counts, mirror hits from nginx logs.
- [ ] Add the release runbook (05, "Runbook for later releases") to the app repo's maintainer notes.

**Accept when:** the site is indexed-requestable, metrics baseline recorded, runbook linked.
