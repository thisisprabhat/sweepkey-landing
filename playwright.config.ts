import { defineConfig } from '@playwright/test';

// Uses the installed Google Chrome (no browser download). Serves the built site with `astro preview`.
export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4330',
    channel: 'chrome',
    headless: true,
  },
  webServer: {
    command: 'npx astro preview --port 4330',
    url: 'http://localhost:4330',
    reuseExistingServer: false,
  },
});
