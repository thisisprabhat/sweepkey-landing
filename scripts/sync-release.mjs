// Puts a Sweepkey DMG on the site's download mirror and records its version, size and checksum
// in src/data/release.json, which the Download buttons are built from.
//
// Usage:
//   npm run sync-release                      newest build/release/dist/Sweepkey-<ver>.dmg in the app repo
//   npm run sync-release -- --dmg <path>      a specific DMG (name must be Sweepkey-<ver>.dmg)
//   npm run sync-release -- --preview         allow a DMG Gatekeeper rejects (local testing only;
//                                             the page then says "Preview build, not notarized")
//
// Without --preview the DMG must pass `spctl -a -t open --context context:primary-signature`,
// i.e. be Developer ID signed and notarized. That is the launch gate in Docs/05.
import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const preview = args.includes('--preview');
const dmgArg = args.includes('--dmg') ? args[args.indexOf('--dmg') + 1] : null;
const appDist = resolve(root, '../../../utils/cleaner/build/release/dist');

function fail(message) {
  console.error(`sync-release: ${message}`);
  process.exit(1);
}

async function newestDmg(dir) {
  if (!existsSync(dir)) fail(`no --dmg given and ${dir} does not exist (run the app's scripts/release.sh first)`);
  const dmgs = (await readdir(dir)).filter((n) => /^Sweepkey-[\w.+-]+\.dmg$/.test(n));
  if (dmgs.length === 0) fail(`no Sweepkey-<version>.dmg in ${dir}`);
  const withTimes = await Promise.all(dmgs.map(async (n) => ({ n, t: (await stat(join(dir, n))).mtimeMs })));
  return join(dir, withTimes.sort((a, b) => b.t - a.t)[0].n);
}

const dmg = dmgArg ? resolve(dmgArg) : await newestDmg(appDist);
if (!existsSync(dmg)) fail(`${dmg} not found`);
const match = basename(dmg).match(/^Sweepkey-([\w.+-]+)\.dmg$/);
if (!match) fail(`${basename(dmg)} is not named Sweepkey-<version>.dmg`);
const version = match[1];

let notarized = true;
try {
  execFileSync('spctl', ['-a', '-t', 'open', '--context', 'context:primary-signature', dmg], { stdio: 'pipe' });
} catch (error) {
  notarized = false;
  const reason = String(error.stderr || error.message).trim();
  if (!preview) fail(`Gatekeeper rejects ${basename(dmg)} (${reason}). Notarize it, or pass --preview for a local test.`);
  console.warn(`sync-release: WARNING, not notarized (${reason}); writing a preview release`);
}

const hash = createHash('sha256');
await new Promise((ok, ko) => createReadStream(dmg).on('data', (c) => hash.update(c)).on('end', ok).on('error', ko));
const { size, mtime } = await stat(dmg);

const downloads = join(root, 'public', 'downloads');
await rm(downloads, { recursive: true, force: true });
await mkdir(downloads, { recursive: true });
await copyFile(dmg, join(downloads, `Sweepkey-${version}.dmg`));

const release = {
  version,
  size,
  sha256: hash.digest('hex'),
  date: mtime.toISOString().slice(0, 10),
  notarized,
};
await writeFile(join(root, 'src', 'data', 'release.json'), JSON.stringify(release, null, 2) + '\n');
console.log('sync-release:', release);
