import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Mirrors src/data/release.json, which exists only after `npm run sync-release`.
const releaseFile = new URL('../src/data/release.json', import.meta.url);
const release = existsSync(releaseFile) ? JSON.parse(readFileSync(releaseFile, 'utf8')) : null;

test('every section renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sweep the rebuildable.');
  for (const id of ['how', 'features', 'safety', 'cli', 'recipes', 'faq', 'download']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
});

test('download button points at the release, or says it is coming', async ({ page, request }) => {
  await page.goto('/');
  const button = page.locator('#download [data-download-link]');
  if (release) {
    await expect(button).toHaveAttribute(
      'href',
      `https://github.com/thisisprabhat/sweepkey/releases/download/v${release.version}/Sweepkey-${release.version}.dmg`,
    );
    const mirror = page.getByRole('link', { name: 'Mirror download (this site)' });
    const href = await mirror.getAttribute('href');
    expect(href).toBe(`/downloads/Sweepkey-${release.version}.dmg`);
    expect((await request.head(href!)).ok()).toBe(true);
    if (!release.notarized) await expect(page.locator('#download .download__warning')).toBeVisible();
  } else {
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button).toContainText('coming soon');
  }
});

test('sweep demo frees space and keeps the secrets', async ({ page }) => {
  await page.goto('/');
  const disk = page.locator('[data-disk]');
  await disk.locator('[data-tile]').first().click(); // keep one folder
  await expect(disk.locator('[data-tile][aria-pressed="false"]')).toHaveCount(1);
  await disk.locator('[data-sweep]').click();
  await expect(disk.locator('[data-freed]')).not.toHaveText('0 GB');
  await expect(disk.locator('[data-vault] li')).toHaveCount(3);
  await expect(disk.locator('[data-vault]')).toContainText('upload-keystore.jks');
  await expect(disk.locator('.tile.is-gone')).toHaveCount((await disk.locator('[data-tile]').count()) - 1);
  // Reset right away, while the count-up is still running: it must not overwrite "0 GB" afterwards.
  await disk.locator('[data-reset]').click();
  await page.waitForTimeout(1200);
  await expect(disk.locator('[data-freed]')).toHaveText('0 GB');
  await expect(disk.locator('.tile.is-gone')).toHaveCount(0);
});

test('feature tour tabs work from the keyboard', async ({ page }) => {
  await page.goto('/');
  const first = page.getByRole('tab', { name: /Projects/ });
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tab', { name: /Caches/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tour-panel-caches')).toBeVisible();
  await expect(page.locator('#tour-panel-projects')).toBeHidden();
  await page.keyboard.press('End');
  await expect(page.locator('#tour-panel-recipes')).toBeVisible();
});

test('FAQ opens from the keyboard', async ({ page }) => {
  await page.goto('/');
  const summary = page.locator('#faq summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#faq details').first()).toHaveAttribute('open', '');
});

test('reduced motion stops the logo marquee', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const animation = await page.locator('.marquee__track').evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe('none');
  await context.close();
});
