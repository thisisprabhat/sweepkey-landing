import { RELEASES_URL } from './site';

/** Shape of src/data/release.json, written by scripts/sync-release.mjs. */
interface ReleaseFile {
  version: string;
  size: number;
  sha256: string;
  date: string;
  notarized: boolean;
}

export interface Release extends ReleaseFile {
  sizeLabel: string;
  dmgName: string;
  /** Primary download: the versioned GitHub release asset. */
  githubUrl: string;
  /** The same bytes served by this site. */
  mirrorUrl: string;
  cliZipUrl: string;
  notesUrl: string;
}

// release.json only exists after a release has been synced, so it is loaded optionally.
const files = import.meta.glob<{ default: ReleaseFile }>('./release.json', { eager: true });
const file = Object.values(files)[0]?.default;

function isReleaseFile(value: unknown): value is ReleaseFile {
  const v = value as ReleaseFile | undefined;
  return !!v && typeof v.version === 'string' && /^[\w.+-]+$/.test(v.version) && Number.isFinite(v.size)
    && /^[0-9a-f]{64}$/.test(v.sha256) && typeof v.notarized === 'boolean';
}

export function formatSize(bytes: number): string {
  return bytes >= 1e9 ? `${(bytes / 1e9).toFixed(1)} GB` : `${Math.max(1, Math.round(bytes / 1e6))} MB`;
}

/** The current release, or null before the first one is synced (the page then shows "coming soon"). */
export const release: Release | null = isReleaseFile(file)
  ? {
      ...file,
      sizeLabel: formatSize(file.size),
      dmgName: `Sweepkey-${file.version}.dmg`,
      githubUrl: `${RELEASES_URL}/download/v${file.version}/Sweepkey-${file.version}.dmg`,
      mirrorUrl: `/downloads/Sweepkey-${file.version}.dmg`,
      cliZipUrl: `${RELEASES_URL}/download/v${file.version}/sweepkey-${file.version}-macos.zip`,
      notesUrl: `${RELEASES_URL}/tag/v${file.version}`,
    }
  : null;
