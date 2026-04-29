import { chromium } from '@playwright/test';

function usage() {
  // Intentionally no comments per repo preference.
  console.error('Usage: node ./src/run-headed.mjs <url>');
  process.exit(2);
}

const url = process.argv[2];
if (!url) usage();

const browser = await chromium.launch({
  headless: false,
});

const context = await browser.newContext();
const page = await context.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded' });

console.log('Browser launched in headed mode. Close the tab or press Ctrl+C to stop the run.');

await new Promise(() => {});
