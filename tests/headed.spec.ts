import { test } from '@playwright/test';

test('headed smoke (stays open for manual interaction)', async ({ page }) => {
  const url = process.env.TARGET_URL;
  if (!url) throw new Error('TARGET_URL env var is required');

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await new Promise(() => {});
});
