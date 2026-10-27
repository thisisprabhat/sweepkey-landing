import { squarify, type Rect } from '../lib/treemap';

// The hero's demo disk. Fictional projects with illustrative sizes; every rule fact is real
// (marker file, target folder, risk, rebuild command) and comes from the app's cleaning rules.

interface Artifact {
  name: string;
  bytes: number;
  regenerate: string;
}

interface Secret {
  name: string;
  why: string;
}

interface DemoProject {
  name: string;
  marker: string;
  ecosystem: string;
  artifacts: Artifact[];
  secrets: Secret[];
}

const GB = 1e9;
const MB = 1e6;

export const demoProjects: DemoProject[] = [
  {
    name: 'ledger-rs',
    marker: 'Cargo.toml',
    ecosystem: 'rust',
    artifacts: [{ name: 'target', bytes: 3.1 * GB, regenerate: 'cargo build' }],
    secrets: [],
  },
  {
    name: 'storefront-web',
    marker: 'package.json',
    ecosystem: 'javascript',
    artifacts: [
      { name: 'node_modules', bytes: 1.8 * GB, regenerate: 'npm install' },
      { name: '.next', bytes: 420 * MB, regenerate: 'npm run build' },
    ],
    secrets: [{ name: '.env.local', why: 'Git-ignored env file' }],
  },
  {
    name: 'FieldNotes',
    marker: 'FieldNotes.xcodeproj',
    ecosystem: 'swift',
    artifacts: [
      { name: 'DerivedData', bytes: 2.4 * GB, regenerate: 'Build in Xcode' },
      { name: '.build', bytes: 610 * MB, regenerate: 'swift build' },
    ],
    secrets: [],
  },
  {
    name: 'tide_app',
    marker: 'pubspec.yaml',
    ecosystem: 'flutter',
    artifacts: [
      { name: 'build', bytes: 1.3 * GB, regenerate: 'flutter build' },
      { name: '.dart_tool', bytes: 380 * MB, regenerate: 'flutter pub get' },
    ],
    secrets: [
      { name: 'upload-keystore.jks', why: 'Android signing keystore' },
      { name: 'pubspec.yaml', why: 'Always collected' },
    ],
  },
  {
    name: 'ml-notebooks',
    marker: 'pyproject.toml',
    ecosystem: 'python',
    artifacts: [
      { name: '.venv', bytes: 900 * MB, regenerate: 'Recreate the venv' },
      { name: '__pycache__', bytes: 60 * MB, regenerate: 'Regenerated on run' },
    ],
    secrets: [],
  },
];

/** Map area in arbitrary units; percentages are derived from it. Aspect matches the CSS (16:11). */
const AREA: Rect = { x: 0, y: 0, w: 160, h: 110 };
const GAP = 1.2; // between projects, in map units
const LABEL = 9; // space for the project name at the top of each project, in map units

export interface LaidOutTile extends Artifact {
  id: string;
  project: string;
  rect: Rect; // percentages of the map
}

export interface LaidOutProject {
  name: string;
  marker: string;
  ecosystem: string;
  rect: Rect; // percentages of the map
  secrets: (Secret & { id: string })[];
  tiles: LaidOutTile[];
}

const pct = (r: Rect): Rect => ({
  x: (r.x / AREA.w) * 100,
  y: (r.y / AREA.h) * 100,
  w: (r.w / AREA.w) * 100,
  h: (r.h / AREA.h) * 100,
});

const projectRects = squarify(
  demoProjects.map((p) => p.artifacts.reduce((a, t) => a + t.bytes, 0)),
  AREA,
);

export const demoLayout: LaidOutProject[] = demoProjects.map((project, pi) => {
  const outer = projectRects[pi];
  const inner: Rect = {
    x: outer.x + GAP / 2,
    y: outer.y + GAP / 2 + LABEL,
    w: Math.max(0, outer.w - GAP),
    h: Math.max(0, outer.h - GAP - LABEL),
  };
  const tileRects = squarify(project.artifacts.map((a) => a.bytes), inner);
  return {
    name: project.name,
    marker: project.marker,
    ecosystem: project.ecosystem,
    rect: pct({ x: outer.x + GAP / 2, y: outer.y + GAP / 2, w: outer.w - GAP, h: outer.h - GAP }),
    secrets: project.secrets.map((s, si) => ({ ...s, id: `${project.name}-secret-${si}` })),
    tiles: project.artifacts.map((a, ai) => ({
      ...a,
      id: `${project.name}-${ai}`,
      project: project.name,
      rect: pct(tileRects[ai]),
    })),
  };
});

export const demoTotalBytes = demoProjects.reduce(
  (sum, p) => sum + p.artifacts.reduce((a, t) => a + t.bytes, 0),
  0,
);
