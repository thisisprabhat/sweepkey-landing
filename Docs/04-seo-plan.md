# 04 · SEO plan

> Status: draft for review · 2026-10-27

## Site config
- `src/data/site.ts`: `SITE_URL = 'https://sweepkey.waygosquad.tech'`, `GITHUB_OWNER = 'thisisprabhat'`, `REPO_URL = 'https://github.com/thisisprabhat/sweepkey'`, `DMG_LATEST_URL = REPO_URL + '/releases/download/v{ver}/Sweepkey-{ver}.dmg'`, `BREW_CMD = 'brew install --cask thisisprabhat/tap/sweepkey'`.
- `astro.config.mjs`: `site: SITE_URL`, `trailingSlash: 'never'`, `build: { format: 'file' }`, `integrations: [sitemap({ filter: (p) => !p.includes('404') })]`.
- One canonical host. `http://` and `www.` (if DNS ever adds it) 301 to `https://sweepkey.waygosquad.tech` at the host/proxy.
- `public/site.webmanifest`: name "Sweepkey", `short_name` "Sweepkey", icons 192/512, `theme_color` `#0D0F29`, `background_color` `#0D0F29`, `display: browser`.
- `<meta name="theme-color" content="#0D0F29" media="(prefers-color-scheme: dark)">` and `content="#F6F7FF" media="(prefers-color-scheme: light)"`.

## Page metadata
`src/components/Seo.astro` props: `title`, `description`, `path`, `ogImage`, `jsonLd[]`, `noindex?`.

| Path | `<title>` (≤ 60) | Meta description (≤ 155) |
|---|---|---|
| `/` | Sweepkey — developer disk cleaner and secrets vault for Mac *(59)* | Reclaim Mac disk space from node_modules, DerivedData, build folders and dev caches, and keep .env files and signing keys in a vault. Free and open source. *(155)* |
| `/404` | Page not found · Sweepkey | — (`noindex`) |

### Head tags for `/`
```html
<title>Sweepkey — developer disk cleaner and secrets vault for Mac</title>
<meta name="description" content="Reclaim Mac disk space from node_modules, DerivedData, build folders and dev caches, and keep .env files and signing keys in a vault. Free and open source.">
<link rel="canonical" href="https://sweepkey.waygosquad.tech/">
<meta name="robots" content="index, follow, max-image-preview:large">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Sweepkey">
<meta property="og:url" content="https://sweepkey.waygosquad.tech/">
<meta property="og:title" content="Sweepkey — Sweep the rebuildable. Keep the keys.">
<meta property="og:description" content="A free, open-source Mac app that clears node_modules, DerivedData and dev caches, and vaults your .env files and signing keys first.">
<meta property="og:image" content="https://sweepkey.waygosquad.tech/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Sweepkey icon and wordmark with the tagline Sweep the rebuildable. Keep the keys., beside the app's dashboard">
<meta property="og:locale" content="en_US">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Sweepkey — Sweep the rebuildable. Keep the keys.">
<meta name="twitter:description" content="Free, open-source Mac app: clear node_modules, DerivedData and dev caches; keep .env files and signing keys in a vault.">
<meta name="twitter:image" content="https://sweepkey.waygosquad.tech/og-image.png">
<meta name="twitter:image:alt" content="Sweepkey icon, wordmark and dashboard">

<!-- Icons -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```
No `twitter:site` / `twitter:creator` until there is an account to name.

## Structured data (JSON-LD)
Emitted by `src/lib/jsonld.ts` from `site.ts` and `release.json`, so version, size and date are never typed by hand. Three nodes in one `@graph` on `/`, plus a `FAQPage`.

Placeholders: `thisisprabhat` (GitHub owner), `{ver}`, `{size}` (e.g. `"18 MB"`), `{date}` (release date, ISO 8601). Everything else is a real value.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sweepkey.waygosquad.tech/#website",
      "url": "https://sweepkey.waygosquad.tech/",
      "name": "Sweepkey",
      "inLanguage": "en"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://sweepkey.waygosquad.tech/#app",
      "name": "Sweepkey",
      "description": "A native macOS app and command-line tool that reclaims disk space by removing regenerable developer artifacts and caches, and collects un-committed secrets into a vault before you clean.",
      "url": "https://sweepkey.waygosquad.tech/",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Disk cleaner",
      "operatingSystem": "macOS 26",
      "softwareRequirements": "macOS 26 or later",
      "softwareVersion": "{ver}",
      "datePublished": "{date}",
      "fileSize": "{size}",
      "downloadUrl": "https://github.com/thisisprabhat/sweepkey/releases/download/v{ver}/Sweepkey-{ver}.dmg",
      "installUrl": "https://github.com/thisisprabhat/sweepkey/releases/download/v{ver}/Sweepkey-{ver}.dmg",
      "releaseNotes": "https://github.com/thisisprabhat/sweepkey/releases/tag/v{ver}",
      "image": "https://sweepkey.waygosquad.tech/icon-512.png",
      "screenshot": [
        "https://sweepkey.waygosquad.tech/screenshots/dashboard.png",
        "https://sweepkey.waygosquad.tech/screenshots/projects.png",
        "https://sweepkey.waygosquad.tech/screenshots/vault.png"
      ],
      "featureList": [
        "Removes rebuildable project folders such as node_modules, target, build, .venv, Pods and DerivedData across 20+ ecosystems",
        "Cleans developer tool caches: Xcode, Android, package managers, version managers, containers and IDEs",
        "Collects .env files, keystores, certificates and other un-committed secrets into a vault (folder, zip or encrypted disk image)",
        "Restores secrets by original path or by git remote on a new Mac",
        "Dry run first, git-tracked guard, path guards and risk levels",
        "History of every clean, with Move to Trash and Put Back",
        "sweepkey command-line tool with JSON output"
      ],
      "isAccessibleForFree": true,
      "license": "https://opensource.org/license/mit",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "author": {
        "@type": "Person",
        "name": "Prabhat Kumar",
        "url": "https://github.com/thisisprabhat"
      }
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://sweepkey.waygosquad.tech/#source",
      "name": "Sweepkey",
      "codeRepository": "https://github.com/thisisprabhat/sweepkey",
      "programmingLanguage": "Swift",
      "runtimePlatform": "macOS 26",
      "license": "https://opensource.org/license/mit",
      "targetProduct": { "@id": "https://sweepkey.waygosquad.tech/#app" },
      "author": { "@type": "Person", "name": "Prabhat Kumar" }
    }
  ]
}
```
- `offers` with `price: 0` is accurate (the app is free); it is required for Google's software-app rich result. **Do not add `aggregateRating`** until real ratings exist; inventing them breaks Google's guidelines.
- `author` is the copyright holder from `LICENSE` ("Copyright (c) 2026 Prabhat Kumar").
- Screenshot URLs point at the optimized copies the build writes (stable names in `public/screenshots/`).
- **`FAQPage`**: generated from the same `src/data/faq.ts` as the accordion (the 9 Q&As in [03](03-content-and-features.md)). Google shows FAQ rich results only for a few authoritative sites now, but the markup is harmless and helps other consumers.
- Validate with the Schema.org validator and Google's Rich Results Test before launch.

## Crawlability
### `public/robots.txt`
```
User-agent: *
Allow: /
Disallow: /downloads/

Sitemap: https://sweepkey.waygosquad.tech/sitemap-index.xml
```
`/downloads/` (the DMG mirror) is disallowed so crawlers don't fetch large binaries. The page itself links there normally.

### Sitemap
`@astrojs/sitemap` → `/sitemap-index.xml` + `/sitemap-0.xml`, containing only `https://sweepkey.waygosquad.tech/`. `lastmod` set from the build date. `/404` excluded.

### On-page
- One `h1` (hero headline). Each section is a `<section aria-labelledby>` with an `h2`. FAQ questions are `h3`.
- Semantic landmarks: `header`, `nav`, `main#main`, `footer`.
- All six feature-tour panels are in the HTML (hidden with `hidden`, not removed), so their copy is crawlable.
- FAQ answers are in the HTML when collapsed.
- Descriptive alt text from [02](02-asset-plan.md) §3.
- In-page anchors with readable IDs: `#demo`, `#ecosystems`, `#tour`, `#tour-vault`, `#safety`, `#cli`, `#recipes`, `#faq`, `#download`.
- External links (GitHub) use `rel="noopener"`; no `nofollow` on our own repo.
- `lang="en"`.

## Keywords
Use naturally in headings, the subhead, tab blurbs and FAQ. No keyword-stuffed sections.

| Cluster | Terms | Where it lands |
|---|---|---|
| Core | developer disk cleaner mac, mac disk cleaner for developers, free up disk space mac developer | Title, h1/subhead, hero |
| JS | node_modules cleaner, delete node_modules mac, remove all node_modules | Subhead, Sweep demo, Projects tab |
| Apple | DerivedData cleaner, clear Xcode DerivedData, Xcode cache cleanup, delete unavailable simulators | Subhead, Caches tab |
| Other ecosystems | clean cargo target folders, gradle cache cleanup, flutter build folder clean, python venv cleanup | Works with, Projects/Caches tabs |
| Containers | docker disk space mac, docker build cache cleanup | Caches tab |
| Secrets | env file backup, backup .env files, keystore backup, signing key backup mac | Subhead, Vault tab, recipes |
| Migration | move developer setup to new mac, migrate projects to new mac | Move to a New Mac recipe |
| Trust | open source mac cleaner, notarized mac app, mac cleaner no telemetry | FAQ, footer |
| CLI | disk cleanup cli mac, node_modules cleanup script | CLI section |

## Performance budget
Lighthouse ≥ 95 in Performance, Accessibility, Best Practices and SEO, on mobile and desktop.

| Metric / resource | Budget |
|---|---|
| LCP (mobile, simulated 4G) | < 2.0 s; the LCP element is the hero headline text or the first hero screenshot (preloaded AVIF, `fetchpriority="high"`) |
| CLS | < 0.05 (all images have `width`/`height`; terminal and demo have fixed heights; fonts use `size-adjust` fallbacks) |
| INP | < 200 ms (demo and tabs do no layout work on input beyond class toggles) |
| TBT | < 150 ms |
| HTML | < 60 KB gzipped |
| CSS | < 30 KB gzipped, inlined critical CSS for the hero |
| JS | < 35 KB gzipped total, all `type="module"`, deferred; no framework runtime |
| Fonts | ≤ 3 files on first load (display + text latin subsets; mono loaded on demand), ≤ 120 KB |
| Hero image | ≤ 150 KB AVIF at 1280w |
| Initial page weight (above the fold) | < 500 KB |
| Full page weight (all lazy screenshots loaded) | < 2.5 MB |
| Third-party requests | 0 (fonts self-hosted, no analytics, no CDNs) |

Other rules:
- Screenshots below the fold use `loading="lazy"` and `decoding="async"`; hero frames 2–3 load after `load`.
- `<link rel="preload">` for the display font and hero AVIF only.
- nginx: gzip + brotli (if the image has the module) for text, `Cache-Control: public, max-age=31536000, immutable` for hashed `/_astro/*` assets, `no-cache` for `index.html` (see [05](05-download-and-release.md)).
- Measure on every build in CI (or before each deploy): `npx lighthouse https://sweepkey.waygosquad.tech --preset=desktop` and the mobile default.
