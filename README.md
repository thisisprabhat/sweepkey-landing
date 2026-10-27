# Sweepkey landing page

Static Astro site for [sweepkey.waygosquad.tech](https://sweepkey.waygosquad.tech). Planning docs live in `Docs/`; every image, logo and transcript the page uses is collected in `assets/` and copied into the build by `scripts/sync-assets.mjs`.

## Develop
```sh
npm install
npm run assets     # copy assets/ into src/assets and public/ (also done by build)
npm run dev
```

## Build, check, test
```sh
npm run build      # sync assets + astro build -> dist/
npm run check      # astro check (types, templates)
npm test           # Playwright smoke tests against `astro preview` (uses your installed Chrome)
```

## Releases and the Download button
The Download buttons are built from `src/data/release.json`. Without it the page shows "Download coming soon".

```sh
npm run sync-release                     # newest notarized DMG from ../../../utils/cleaner/build/release/dist
npm run sync-release -- --dmg <path>     # a specific Sweepkey-<version>.dmg
npm run sync-release -- --preview        # local testing only: allows an unnotarized DMG, page shows a warning
```

`sync-release` copies the DMG to `public/downloads/` (the mirror), records version, size and SHA-256, and refuses a DMG that Gatekeeper rejects unless `--preview` is given. The primary button links to `https://github.com/thisisprabhat/sweepkey/releases/download/v<version>/Sweepkey-<version>.dmg`. Both files are gitignored. Never deploy a preview release (see `Docs/05-download-and-release.md`).

## Hero GIF (screen recording)
Save the screen recording somewhere readable, then:
```sh
swiftc -O scripts/mov-to-gif.swift -o /tmp/mov-to-gif
/tmp/mov-to-gif <recording.mov> --out assets/video [--start s] [--end s]
npm run assets
```
The hero shows `assets/video/sweepkey-demo.gif` when it exists, and the Dashboard screenshot until then. Check every frame for real names or paths first.

## Run in Docker
```sh
npm run sync-release          # optional locally; notarized release only for a real deploy
docker compose up -d --build  # http://localhost:8090
docker compose ps             # shows (healthy) once /health answers
docker compose down
```
The image builds the site with Node 22 and serves `dist/` with nginx.
- `/health` returns `{"status":"ok","service":"sweepkey-landing"}`. The Dockerfile `HEALTHCHECK` and the compose `healthcheck` both poll it.
- `/downloads/*.dmg` is served as `application/x-apple-diskimage` with `Content-Disposition: attachment`; missing files are a real 404.
- Security headers come from `nginx-security-headers.conf`, included in every location.
- Port 8090 on the host, so it can run next to deckTv (8080).

## Screenshots
App screenshots use the app's DEBUG demo mode (fake projects under `/Users/demo`). Build the app's Debug target, compile the helpers once (`swiftc -O scripts/capture/winlist.swift -o scripts/capture/winlist` and the same for `winid.swift`), then:
```sh
scripts/capture/launch.sh projects light inspector   # tab, look, optional screen to open
scripts/capture/front.sh assets/screenshots/light/projects-inspector.png
```
Screens to open: `inspector`, `cleanConfirm`, `findSecrets` (also `cleanResult`, `vaultExport`, `historyDetail`, `ruleEditor` if a section needs them).
