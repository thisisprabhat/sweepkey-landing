// Logos available in assets/logos (copied to public/logos by scripts/sync-assets.mjs).
const darkVariants = new Set(['rust', 'elixir', 'unity', 'unreal', 'gradle', 'jetbrains', 'ollama']);

export const logoHasDarkVariant = (id: string) => darkVariants.has(id);

/** The "Works with" strip: project ecosystems first, then the tools whose caches Sweepkey cleans. */
export const worksWith: { id: string; name: string }[] = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'nodejs', name: 'Node.js' },
  { id: 'python', name: 'Python' },
  { id: 'swift', name: 'Swift' },
  { id: 'xcode', name: 'Xcode' },
  { id: 'flutter', name: 'Flutter' },
  { id: 'android', name: 'Android' },
  { id: 'jvm', name: 'Kotlin' },
  { id: 'gradle', name: 'Gradle' },
  { id: 'rust', name: 'Rust' },
  { id: 'go', name: 'Go' },
  { id: 'dotnet', name: '.NET' },
  { id: 'cpp', name: 'C++' },
  { id: 'elixir', name: 'Elixir' },
  { id: 'haskell', name: 'Haskell' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'php', name: 'PHP' },
  { id: 'zig', name: 'Zig' },
  { id: 'scala', name: 'Scala' },
  { id: 'bazel', name: 'Bazel' },
  { id: 'terraform', name: 'Terraform' },
  { id: 'unity', name: 'Unity' },
  { id: 'unreal', name: 'Unreal Engine' },
  { id: 'docker', name: 'Docker' },
  { id: 'npm', name: 'npm' },
  { id: 'pnpm', name: 'pnpm' },
  { id: 'yarn', name: 'Yarn' },
  { id: 'cocoapods', name: 'CocoaPods' },
  { id: 'homebrew', name: 'Homebrew' },
  { id: 'jetbrains', name: 'JetBrains' },
  { id: 'huggingface', name: 'Hugging Face' },
  { id: 'ollama', name: 'Ollama' },
];
