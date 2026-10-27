# 01 · Design spec — Sweepkey landing page

> Status: draft for review · 2026-10-27 · Brand source: `cleaner/Branding/README.md`

## Art direction: "night sweep"
The app icon is a keyhole (the vault) on a night-indigo gradient, crossed by a mint sweep and two sparkles. The page takes the same idea: a deep indigo night, one bright mint stroke that "sweeps" across content, and a keyhole motif for anything vault-related. It should feel like a precise developer tool, not a generic SaaS template: hairline borders, monospaced numbers, real UI screenshots, and one signature interaction (the Sweep demo).

Two visual verbs run through the page:
- **Sweep** (mint): things that can be rebuilt leave. Used for sizes freed, the Sweep button, progress.
- **Keep** (indigo + keyhole): things that matter are kept. Used for the vault, safety guards, secrets.

## 1. Colour tokens
Brand values come from `Branding/README.md`. Values marked *derived* are new, chosen to fit the brand and pass WCAG AA; they are not in the app.

### Brand reference (from the app)
| Role | Light | Dark |
|---|---|---|
| Accent (`AccentColor`) | Indigo `#3F49B4` | Mint `#5DE3B8` |
| Icon background | `#3F49B4` → `#141739` | `#333B99` → `#0D0F29` |
| Sweep | Mint `#3EE6B5` → `#D2FFF2` | same |
| Ink (wordmark, text) | `#161A3A` / muted `#5B6290` | n/a |

### Dark theme (default)
```css
:root, [data-theme="dark"] {
  color-scheme: dark;
  /* surfaces */
  --bg:          #0D0F29;  /* icon dark gradient end */
  --bg-raised:   #141739;  /* icon light gradient end */
  --surface:     #1A1E4A;  /* derived: cards */
  --surface-hi:  #242A63;  /* derived: hover, active tab */
  --rule:        rgb(210 255 242 / .08);  /* hairline */
  --rule-strong: rgb(210 255 242 / .16);
  /* text */
  --text:        #EEF0FF;  /* derived */
  --text-muted:  #A3A9D6;  /* derived, 8:1 on --bg */
  /* brand */
  --accent:      #5DE3B8;  /* AccentColor dark */
  --on-accent:   #0D0F29;  /* text on mint buttons */
  --indigo:      #3F49B4;
  --indigo-deep: #333B99;
  --sweep-from:  #3EE6B5;
  --sweep-to:    #D2FFF2;
  --sweep: linear-gradient(90deg, var(--sweep-from), var(--sweep-to));
  --night: linear-gradient(160deg, #333B99 0%, #0D0F29 70%);
  /* risk badges (derived, mirror the app's Safe/Caution/Danger) */
  --safe:    #5DE3B8;
  --caution: #FFC266;
  --danger:  #FF6B7A;
  --focus:   #D2FFF2;  /* focus ring */
}
```

### Light theme
```css
[data-theme="light"] {           /* also applied by @media (prefers-color-scheme: light) */
  color-scheme: light;
  --bg:          #F6F7FF;  /* derived */
  --bg-raised:   #EDEFFC;  /* derived */
  --surface:     #FFFFFF;
  --surface-hi:  #E4E7FA;  /* derived */
  --rule:        rgb(22 26 58 / .08);
  --rule-strong: rgb(22 26 58 / .16);
  --text:        #161A3A;  /* brand ink */
  --text-muted:  #5B6290;  /* brand ink muted, 5.8:1 on --bg */
  --accent:      #3F49B4;  /* AccentColor light */
  --on-accent:   #FFFFFF;
  --night: linear-gradient(160deg, #3F49B4 0%, #141739 80%); /* hero panel stays dark */
  --safe:    #12936C;  /* derived: mint darkened for text contrast */
  --caution: #A86400;
  --danger:  #C8283B;
  --focus:   #3F49B4;
}
```

**Rules**
- Mint is never used for body text on a light background (it fails contrast). In light mode, mint appears only as fills, the sweep stroke and icons, with ink text on top.
- The hero mock window, the Sweep demo stage and the terminal stay on the dark night gradient in both themes. They read as "the app" and "a terminal", which are dark in the screenshots too.
- Theme follows the OS. A small toggle in the footer (sun/moon, `aria-pressed`) overrides it and is stored in `localStorage`. An inline script in `<head>` sets `data-theme` before paint to avoid a flash.
- Tokens also ship as `assets/brand/tokens.json` and `assets/brand/tokens.css` (see [02](02-asset-plan.md)).

## 2. Typography
| Use | Family | Source | Weights |
|---|---|---|---|
| Display (h1, h2, big numbers) | **Bricolage Grotesque** (variable, `opsz` axis) | Google Fonts, OFL; self-host with `@fontsource-variable/bricolage-grotesque` | 600–800, `opsz` 48–96 for headlines |
| Text (body, UI, buttons) | **Geist** (variable) | Google Fonts, OFL; `@fontsource-variable/geist` | 400, 500, 600 |
| Code, sizes, terminal | **JetBrains Mono**, with `ui-monospace, "SF Mono", Menlo` first on Apple devices | Google Fonts, OFL; `@fontsource-variable/jetbrains-mono` | 400, 600 |

Why: Bricolage Grotesque has a slightly quirky, inky character that keeps the page from looking templated, and it stays legible at heavy weights. Geist is clean and neutral for long text and UI. On Macs the mono stack resolves to SF Mono, which matches the app's own monospaced digits.

Font stacks:
```css
--font-display: "Bricolage Grotesque Variable", "Geist Variable", system-ui, sans-serif;
--font-text:    "Geist Variable", system-ui, -apple-system, sans-serif;
--font-mono:    ui-monospace, "SF Mono", "JetBrains Mono Variable", Menlo, monospace;
```
- The **wordmark** is an SVG (SF Pro Display Bold from `Branding/dmg-background.svg`), so it does not need SF Pro as a web font.
- Load only the latin subset; preload the display font (one file); `font-display: swap`.
- Sizes and counters use `font-variant-numeric: tabular-nums` so counting numbers do not jitter.

### Type scale (fluid, `clamp()`)
| Token | Size | Line height | Use |
|---|---|---|---|
| `--fs-display` | `clamp(2.75rem, 6vw + 1rem, 5.5rem)` | 1.02 | Hero h1 |
| `--fs-h2` | `clamp(2rem, 3vw + 1rem, 3.25rem)` | 1.08 | Section titles |
| `--fs-h3` | `clamp(1.25rem, 1vw + 1rem, 1.625rem)` | 1.2 | Card titles |
| `--fs-lead` | `clamp(1.125rem, .5vw + 1rem, 1.375rem)` | 1.5 | Subheads |
| `--fs-body` | `1.0625rem` (17px) | 1.6 | Body |
| `--fs-small` | `0.875rem` | 1.5 | Captions, meta |
| `--fs-mono` | `0.875rem` | 1.55 | Terminal, code, checksum |
| `--fs-eyebrow` | `0.75rem`, uppercase, `+0.12em` tracking, mono | 1.4 | Section eyebrows ("01 — SWEEP") |

Display headings use `-0.02em` tracking (matching the wordmark's "slightly tight tracking").

## 3. Spacing, radius, shadow

### Spacing (4px base)
| Token | Value | Typical use |
|---|---|---|
| `--sp-1` | 4px | Icon gaps |
| `--sp-2` | 8px | Inline gaps, chip padding |
| `--sp-3` | 12px | Button padding (y) |
| `--sp-4` | 16px | Card inner gaps, mobile gutter |
| `--sp-5` | 24px | Card padding, desktop gutter |
| `--sp-6` | 32px | Between card groups |
| `--sp-7` | 48px | Section header → content |
| `--sp-8` | 64px | Mobile section padding |
| `--sp-9` | 96px | Desktop section padding |
| `--sp-10` | 128px | Hero top padding (desktop) |

Layout: content max width `1200px`; text measure `64ch`; 12-column grid on ≥ 1024px, 6 on ≥ 640px, 1 below. Side gutter 16px on phones, 24px on tablets, auto on desktop.

### Radius
| Token | Value | Use |
|---|---|---|
| `--r-sm` | 6px | Chips, badges, code |
| `--r-md` | 12px | Buttons, inputs, small cards |
| `--r-lg` | 20px | Cards, terminal, demo stage |
| `--r-xl` | 28px | Screenshot frames (matches macOS 26 window corners at the shown scale) |
| `--r-full` | 999px | Pills, the Download pill in the nav |

### Shadow and depth
Depth comes mainly from layered surfaces and hairlines. Shadows are soft and tinted indigo, never grey.

| Token | Value | Use |
|---|---|---|
| `--sh-1` | `0 1px 0 var(--rule), 0 1px 2px rgb(8 10 30 / .25)` | Buttons, chips |
| `--sh-2` | `0 8px 24px -8px rgb(8 10 30 / .45)` | Cards on hover |
| `--sh-3` | `0 40px 80px -24px rgb(8 10 30 / .65), 0 0 0 1px var(--rule-strong)` | App window mock, screenshot frames |
| `--glow-mint` | `0 0 0 1px rgb(93 227 184 / .5), 0 0 32px rgb(62 230 181 / .25)` | Primary button hover, Sweep button, focus on dark |

Light theme uses the same tokens with lower alpha (`/ .12`, `/ .18`, `/ .25`).

## 4. Motion
| Token | Value |
|---|---|
| `--dur-1` | 120ms (hover, press) |
| `--dur-2` | 240ms (tab swap, accordion) |
| `--dur-3` | 480ms (section reveals) |
| `--dur-sweep` | 900ms (demo items leaving) |
| `--ease-out` | `cubic-bezier(.2, .8, .2, 1)` |
| `--ease-sweep` | `cubic-bezier(.65, 0, .35, 1)` |

**Rules**
1. Animate only `transform` and `opacity` (plus `clip-path` for the sweep stroke). No layout-shifting animation.
2. Section reveals: a 12px rise + fade, once, via `IntersectionObserver` (or `animation-timeline: view()` where supported). Content is visible by default; the reveal class is added by JS, so no-JS users see everything.
3. Counters count up over ≤ 1.2 s with `requestAnimationFrame` and tabular numerals.
4. Nothing loops forever except the logo marquee, which pauses on hover, on focus within, and when off screen.
5. No autoplaying video. No parallax on scroll.
6. **`prefers-reduced-motion: reduce`:**
   - all transitions drop to an instant opacity change (`--dur-*: 0.01ms`);
   - the hero window shows one static screenshot (no cross-fade) and the final reclaimable number;
   - the Sweep demo still works, but items disappear instantly and the counter jumps to its final value; secret files appear in the Vault card without flying;
   - the marquee becomes a static, wrapping logo grid;
   - the terminal shows the complete output immediately (no typing).
   Playwright verifies this mode (see [06](06-implementation-plan.md)).
7. Respect `prefers-reduced-transparency`: replace backdrop blur on the nav with a solid `--bg-raised`.

## 5. Components (shared)
- **Button / primary:** mint fill (`--accent` dark / indigo light), `--on-accent` text, `--r-md`, 48px tall, a leading download arrow icon (no Apple logo). Hover: `--glow-mint`. Press: scale .98.
- **Button / secondary:** transparent, 1px `--rule-strong`, text colour.
- **Copy button:** icon-only 32px square, `aria-label="Copy <thing>"`. On success: check icon for 1.5 s and a polite `aria-live` message "Copied".
- **Code pill:** mono, `--surface`, `--r-sm`, a copy button at the end. Used for `brew install …` and checksums.
- **Card:** `--surface`, 1px `--rule`, `--r-lg`, `--sp-5` padding.
- **Risk badge:** small pill, Safe / Caution / Danger, using `--safe` / `--caution` / `--danger` at 16% fill with full-colour text.
- **Screenshot frame:** the PNG as captured (it already includes the macOS window chrome), `--r-xl` clip, `--sh-3`. Each image has a `<picture>` with AVIF/WebP and a `prefers-color-scheme` source swap between `screenshots/dark/` and `screenshots/light/`.
- **Icons:** 1.5px-stroke line icons (Lucide-style, inline SVG). The keyhole and sparkle are taken from the app icon's layer SVGs.

## 6. Page sections — wireframes and behaviour
Widths shown are desktop (≥ 1024px). Each section lists its mobile layout below the box.

### S1 · Nav
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [icon] Sweepkey      Features  How it works  Vault  CLI  FAQ     [★ GitHub]  ( Download ) │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Sticky, 64px, translucent `--bg` at 72% with `backdrop-filter: blur(16px)` and a bottom hairline that appears after 8px of scroll.
- Links are in-page anchors: Features → `#tour`, How it works → `#demo`, Vault → `#tour-vault` (opens the Vault tab), CLI → `#cli`, FAQ → `#faq`. The active section's link gets an underline (IntersectionObserver).
- **Download** pill (primary) links to `#download`, not directly to the file, so visitors see the version and requirements first. It hides while the hero's own Download button is on screen and appears after.
- Skip link "Skip to content" is the first focusable element.
- **Mobile (< 768px):** icon + wordmark, Download pill, and a menu button (`aria-expanded`, `aria-controls`) that opens a full-width sheet with the links. Escape and outside click close it; focus returns to the button.

### S2 · Hero
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ⟡ Free & open source · macOS 26+                                            │
│                                                                              │
│  Sweep the rebuildable.          ┌────────────────────────────────────────┐  │
│  Keep the keys.                  │ ● ● ●   Sweepkey                        │  │
│                                  │ ┌──────┐ ┌────────────────────────────┐ │  │
│  Sweepkey clears node_modules,   │ │ side │ │  [screenshot cross-fade]   │ │  │
│  DerivedData, build folders and  │ │ bar  │ │  Dashboard → Projects →    │ │  │
│  dev caches from your Mac, and   │ │      │ │  Vault                     │ │  │
│  keeps your .env files and       │ └──────┘ └────────────────────────────┘ │  │
│  signing keys safe in a vault.   │      Reclaimable ▸ {demo total} (counts)  │  │
│                                  └────────────────────────────────────────┘  │
│  ( ⬇ Download for Mac )  Version {ver} · {size} · macOS 26+              │
│  $ brew install --cask thisisprabhat/tap/sweepkey                     [copy]       │
│  ─────────── mint sweep stroke drawn across the headline ───────────         │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Two columns on desktop (text 5/12, window 7/12); stacked on mobile, with the window below the CTAs and scaled to the screen width.
- Background: the `--night` gradient with a faint, large keyhole silhouette at 4% opacity, bottom right.
- **Headline:** "Sweep the rebuildable." in `--text`, "Keep the keys." in `--accent`. On load, a mint stroke (`--sweep`, `clip-path` inset from right to left over 700ms) passes under the first line, once.
- **Download button:** `href` is the GitHub latest URL (see [05](05-download-and-release.md)). The meta line (version, size, "macOS 26+") is read from `release.json` at build time.
- **Brew line:** a code pill with a copy button.
- **Mock window:** a frame that cross-fades between three dark screenshots (Dashboard, Projects with inspector, Vault findings) every 4 s, pausing on hover/focus and when the tab is hidden. Under it, a "Reclaimable" counter counts up from 0 to the demo-data value once, when the hero first appears. A pause/play button sits in the frame's corner (WCAG 2.2.2).
- The number is the reclaimable total from the demo-data Dashboard screenshot, so the counter and image agree. It is labelled "demo data" in the image's alt text.

### S3 · Interactive "Sweep" demo (centrepiece) — `#demo`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  01 — HOW IT WORKS                                                           │
│  Tick what can be rebuilt. Sweep. Your secrets stay.                         │
│                                                                              │
│  ┌──────────── ~/Projects (demo) ───────────────┐   ┌──── Freed ─────────┐   │
│  │ ▾ storefront-web            package.json     │   │   0.0 GB  → 12.4 GB │   │
│  │   [x] node_modules    1.8 GB  Safe  npm i    │   │   ▁▂▃▅▇ (bar fills) │   │
│  │   [x] .next           412 MB  Safe           │   └────────────────────┘   │
│  │   ◆ .env.local                       secret │   ┌──── ◆ Vault ───────┐   │
│  │ ▾ ledger-rs                 Cargo.toml       │   │  (empty)            │   │
│  │   [x] target          6.1 GB  Safe  cargo b  │   │  → .env.local       │   │
│  │ ▾ FieldNotes (iOS)          *.xcodeproj      │   │  → upload-keystore  │   │
│  │   [x] DerivedData     3.2 GB  Safe           │   │  → pubspec.yaml     │   │
│  │ ▾ tide_app (Flutter)        pubspec.yaml     │   │  3 files kept       │   │
│  │   [x] build           640 MB  Safe           │   └────────────────────┘   │
│  │   ◆ android/upload-keystore.jks     secret  │                            │
│  │   ◆ pubspec.yaml            always collect  │                            │
│  │ ▾ ml-notebooks              pyproject.toml   │                            │
│  │   [ ] .venv           1.1 GB  Safe           │                            │
│  └──────────────────────────────────────────────┘                            │
│   [ Select all ]  ( ✦ Sweep 11.2 GB )   [ ↺ Reset ]    ☐ Dry run first       │
└──────────────────────────────────────────────────────────────────────────────┘
```
Data is a fixed, fictional fixture in `src/data/demo.ts` (project names above are placeholders; sizes are illustrative). Each item carries its real rule facts: marker file, target, risk and the regenerate command from `docs/02-cleaning-rules.md` (`npm install`, `cargo build`, `flutter pub get` …).

**Behaviour**
1. Each artifact row is a real `<input type="checkbox">` with a `<label>` (name, size, risk badge, regenerate hint in mono). Secret rows (◆ keyhole icon, not a checkbox) cannot be selected: their label says "secret — kept" or "always collect".
2. The Sweep button's label updates live with the selected total ("Sweep 11.2 GB"). It is disabled when nothing is selected.
3. The **Dry run first** toggle is on by default, mirroring the app. With it on, Sweep first shows an inline confirmation panel ("You're about to remove 4 folders · up to 11.2 GB. Secrets will be copied to the vault first.") with **Confirm sweep** / **Cancel**. Turning it off skips the panel. This teaches the safety model by doing.
4. On confirm:
   - secret files fly first (FLIP animation, 600ms) from their rows into the Vault card, which lists them and ends with "3 files kept";
   - then the selected rows sweep away: a mint stroke passes over each row left to right, the row collapses (`grid-template-rows: 1fr → 0fr`), staggered 80ms;
   - the Freed counter counts up to the total and the bar fills.
5. Result line (`aria-live="polite"`): "Freed up to 11.2 GB. 3 secret files kept in the vault. Rebuild any time with `npm install`, `cargo build`…". "Up to" matches the app's APFS-aware wording.
6. **Reset** restores the tree, empties the vault and zeroes the counter. Focus moves to the first checkbox.
7. Keyboard: Tab through checkboxes, Space toggles, Enter on Sweep. The confirmation panel takes focus when it opens.
8. Reduced motion: no flying or collapsing; rows switch to a struck-through "swept" state, the vault list fills instantly, the counter jumps.
9. No-JS fallback: the tree renders as a static list with the caption "Interactive demo needs JavaScript".

**Mobile:** the stage stacks: tree (scrollable, max 60vh), then the Freed card and Vault card side by side as two small cards, then a sticky action bar with Sweep and Reset.

### S4 · Works with — `#ecosystems`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Finds rebuildable folders across 20+ ecosystems                             │
│  ◂ [node] [npm] [pnpm] [yarn] [python] [rust] [go] [swift] [xcode] [flutter] ▸│
│  ◂ [gradle] [android] [docker] [unity] [unreal] [zig] [elixir] [haskell] … ▸ │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Two rows of the 32 Simple Icons logos (see [02](02-asset-plan.md)), monochrome by default (`--text-muted` via CSS `mask-image`), full brand colour on hover/focus. Rows scroll in opposite directions (40 s per loop) with faded edges (`mask-image` gradient).
- Each logo is an `<li>` with `aria-label` ("Rust") and a `title`; the duplicated second copy used for the seamless loop is `aria-hidden`.
- Pauses on hover, on `:focus-within`, and when off screen. A visible "Pause" toggle sits at the right end.
- Reduced motion or < 640px: a static wrapping grid (6 per row on mobile).
- Logos with `-dark` variants (elixir, gradle, jetbrains, ollama, rust, unity, unreal) swap by theme.

### S5 · Feature tour (tabs) — `#tour`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  02 — INSIDE THE APP                                                         │
│  ┌Projects┐ Caches  Vault  History  Rules  Recipes                           │
│  ┌───────────────────────────┐  ┌──────────────────────────────────────────┐ │
│  │ Projects                  │  │                                          │ │
│  │ Every project, its        │  │        [ screenshot for the tab ]        │ │
│  │ rebuildable folders, size,│  │                                          │ │
│  │ last activity and how to  │  │                                          │ │
│  │ regenerate.               │  │                                          │ │
│  │ • point  • point  • point │  └──────────────────────────────────────────┘ │
│  └───────────────────────────┘                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```
- WAI-ARIA tabs pattern: `role="tablist"`, `role="tab"` with `aria-selected` / `aria-controls`, `role="tabpanel"`. Roving `tabindex`: **Left/Right arrows** move between tabs and activate them (automatic activation), **Home/End** jump to first/last. Tab moves into the panel.
- Each panel: title, a 1–2 sentence blurb, three bullet points (copy in [03](03-content-and-features.md)), and its screenshot (theme-matched). The image cross-fades (240ms) and the text slides 8px; reduced motion swaps instantly.
- A mint underline slides between tabs (`transform` on one indicator element).
- Deep links: `#tour-projects`, `#tour-caches`, `#tour-vault` … select the tab on load and on `hashchange`. The nav's "Vault" link uses `#tour-vault`.
- All six panels are in the HTML (hidden with `hidden`), so all text is crawlable. Screenshots in hidden panels use `loading="lazy"`.
- **Mobile:** the tablist becomes a horizontally scrollable row of pills (scroll-snap); the screenshot sits above the text.

### S6 · Safety — `#safety`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  03 — SAFETY                                                                 │
│  Conservative by design.                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │ ◉ Dry    │ │ ⎇ Git-    │ │ ↯ Never   │ │ ⌫ Trash  │                         │
│  │ run first│ │ tracked  │ │ follows  │ │ or delete│                         │
│  │          │ │ guard    │ │ symlinks │ │          │                         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │ ⛨ Path    │ │ ⊙ Pinned │ │ ● Risk    │ │ ◆ Vault  │                         │
│  │ guards   │ │ & active │ │ levels   │ │ before   │                         │
│  │          │ │ projects │ │ S/C/D    │ │ clean    │                         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                         │
│  [ screenshot: clean confirmation sheet ]  "Nothing is deleted until you've  │
│                                             seen the list and confirmed."    │
└──────────────────────────────────────────────────────────────────────────────┘
```
- 4×2 grid of cards (2 columns on tablet, 1 on mobile). Each card: a 24px line icon, a title, one or two sentences. Copy in [03](03-content-and-features.md).
- The Risk levels card shows the three badges (Safe / Caution / Danger).
- Below the grid: the clean confirmation sheet screenshot with a pull quote.
- No interaction beyond reveal-on-scroll. Cards are not links.

### S7 · CLI — `#cli`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  04 — FOR THE TERMINAL                                                       │
│  The same engine, scriptable.         ┌─ ● ● ●  zsh — sweepkey ───────────┐  │
│                                       │ $ sweepkey scan --stale-only  ⧉   │  │
│  [scan] [clean --dry-run] [caches]    │ <output from assets/cli/…>       │  │
│  [vault collect]                      │ …                                 │  │
│                                       │ $ sweepkey clean --dry-run    ⧉   │  │
│  Ships inside the app; also a         │ █                                 │  │
│  standalone zip in every release.     └───────────────────────────────────┘  │
│  ( Read the CLI reference ↗ )   [ ⏸ Pause ]                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```
- A terminal on the night gradient, mono 14px, 18 lines tall (fixed height, so typing never shifts layout).
- Content comes from the captured text files in `assets/cli/` (real output against the demo fixture). The `$ command` line types at ~35 chars/s with a blinking block cursor; the output then appears line by line (30ms each); a 1.5 s pause; next command.
- Command chips on the left jump straight to a command (and stop autoplay). Each prompt line has a copy button that copies only the command.
- Starts when 40% visible; pauses when off screen, on hover, on focus, or with the Pause button. Runs through the sequence once, then stays on the last command (no endless loop).
- Accessibility: the terminal is a `<pre>` region with `aria-label="Example sweepkey commands"`; the typing animation is `aria-hidden` and the full transcript is in a visually hidden copy so screen readers get it once.
- Reduced motion: all commands and outputs are shown at once (scrollable).
- **Mobile:** chips above the terminal (scrollable row); terminal font 12.5px with horizontal scroll inside the `<pre>` only.

### S8 · Recipes — `#recipes`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  05 — RECIPES                                                                │
│  Guided jobs for common situations.                                          │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐        │
│  │ ◔ Free Up Space    │ │ ▣ Archive a Project│ │ ⇢ Move to a New Mac│        │
│  │ When: …            │ │ When: …            │ │ When: …            │        │
│  │ 1. …               │ │ 1. …               │ │ 1. …               │        │
│  │ 2. …               │ │ 2. …               │ │ 2. …               │        │
│  │ 3. …               │ │ 3. …               │ │ 3. …               │        │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘        │
│             [ screenshot: Recipes view ]                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Three equal cards; icon, title, "when to use" line and three numbered steps, all copied from the app's `RecipesView.swift` (see [03](03-content-and-features.md)).
- Hover/focus: the card lifts 2px and its icon tile turns mint. Cards are static (not links).
- **Mobile:** one column; the screenshot is hidden below 640px to save weight.

### S9 · FAQ — `#faq`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  06 — FAQ                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Is it safe?                                                      ＋  │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ Why does it need Full Disk Access?                               －  │   │
│  │   Answer text …                                                      │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ …                                                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Accessible accordion: each item is an `<h3>` containing a `<button aria-expanded aria-controls>`; the answer is a region with `aria-labelledby`. (Built on buttons rather than `<details>` so the open/close animation and the heading structure are both controlled.)
- Enter/Space toggle; Tab moves between questions; several can be open at once. The `+` rotates to `−` (reduced motion: swap instantly).
- Opening animates height with `grid-template-rows: 0fr → 1fr` (240ms).
- Deep link `#faq-<slug>` opens that item on load.
- Answers are in the HTML when collapsed (`hidden="until-found"` where supported, so browser find-in-page reveals them).
- Single column, max width 820px, on all screens.

### S10 · Download — `#download`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│               [ app icon 128 ]                                               │
│               Get Sweepkey                                                   │
│        ( ⬇ Download for Mac — Sweepkey.dmg )                                 │
│        Version {ver} · {size} · macOS 26 or later · Notarized by Apple        │
│                                                                              │
│  SHA-256  {sha256, middle-truncated}  [copy]          Mirror: sweepkey.waygosquad.tech  │
│  $ brew install --cask thisisprabhat/tap/sweepkey                         [copy]   │
│  CLI only: sweepkey-{ver}-macos.zip   ·   Release notes ↗   ·   Source ↗     │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Centered, on the `--night` panel in both themes, with the mint sweep stroke behind the icon.
- **Primary button** → `https://github.com/thisisprabhat/sweepkey/releases/download/v{ver}/Sweepkey-{ver}.dmg`.
- **Mirror** link → `/downloads/Sweepkey-<version>.dmg` (same file, same checksum).
- **Checksum:** full SHA-256 in mono, truncated visually in the middle on narrow screens (full value in the copy button and `title`). Copy button copies the full value. A one-line "Verify: `shasum -a 256 Sweepkey.dmg`" hint.
- **CLI zip** → `https://github.com/thisisprabhat/sweepkey/releases/download/v<version>/sweepkey-<version>-macos.zip`.
- **Release notes** → `https://github.com/thisisprabhat/sweepkey/releases/tag/v<version>`.
- All values (version, size, sha256, date) come from `src/data/release.json`. If that file is missing, the build fails (no stale or fake numbers ship).
- After clicking Download, a small inline note appears: "Open the DMG and drag Sweepkey to Applications." with the DMG installer screenshot as a thumbnail.

### S11 · Footer
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [wordmark]  Sweep the rebuildable. Keep the keys.                            │
│ Product: Features · Safety · CLI · FAQ · Download                            │
│ Project: GitHub · Releases · Issues · Contributing · MIT Licence             │
│ Privacy: This site uses no cookies and no tracking. The app has no telemetry.│
│ Logos are from Simple Icons (CC0) and are trademarks of their owners;        │
│ their use does not imply endorsement. macOS is a trademark of Apple Inc.     │
│ © 2026 Prabhat Kumar · MIT                              [☾/☀ theme toggle]   │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Three link columns on desktop, stacked on mobile. Theme toggle at the bottom right.

## 7. Accessibility checklist (applies to every section)
- One `h1` (hero). Each section has an `h2` and `aria-labelledby`.
- Visible focus ring: 2px `--focus` outline with 2px offset, never removed.
- Colour contrast ≥ 4.5:1 for text, ≥ 3:1 for UI and focus indicators, in both themes.
- Every animation that runs > 5 s has a pause control (hero cross-fade, marquee, terminal).
- Touch targets ≥ 44×44px.
- All screenshots have descriptive alt text (written in [03](03-content-and-features.md)); decorative art has `alt=""`.
- Works at 200% zoom and 320px width with no horizontal page scroll.

## 8. Breakpoints and visual QA
Breakpoints: 640, 768, 1024, 1280px. Visual QA widths: 390, 768, 1280 and 1600px, in light and dark (see [06](06-implementation-plan.md)).
