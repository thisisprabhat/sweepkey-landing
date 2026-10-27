// Copies the collected assets/ (the source of truth) into the places Astro serves them from.
// src/assets/ gets images Astro optimises; public/ gets files served as-is.
// Run automatically by `npm run build`; run `npm run assets` after changing assets/.
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const from = (...p) => join(root, 'assets', ...p);
const to = (...p) => join(root, ...p);

async function copyDir(src, dest) {
  if (!existsSync(src)) return 0;
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  await cp(src, dest, { recursive: true, filter: (f) => !f.endsWith('.DS_Store') });
  return (await readdir(dest)).length;
}

const report = {
  screenshots: await copyDir(from('screenshots'), to('src', 'assets', 'screenshots')),
  brand: await copyDir(from('brand'), to('src', 'assets', 'brand')),
  cli: await copyDir(from('cli'), to('src', 'assets', 'cli')),
  logos: await copyDir(from('logos'), to('public', 'logos')),
  video: await copyDir(from('video'), to('public', 'video')),
};

for (const name of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og-image.png']) {
  if (existsSync(from('social', name))) await cp(from('social', name), to('public', name));
}

console.log('assets synced', report);
