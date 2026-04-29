import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

function usage() {
  // Intentionally no comments per repo preference.
  console.error('Usage: node ./src/run-headed.mjs <url>');
  process.exit(2);
}

const url = process.argv[2];
if (!url) usage();

// Find latest cookies file from bypass tool
function findLatestCookiesFile() {
  const outputDir = path.join('.', 'cloudflare-bypass-2026', 'output', 'cookies');
  if (!fs.existsSync(outputDir)) return null;

  const files = fs.readdirSync(outputDir)
    .filter(f => f.startsWith('cookies_') && f.endsWith('.json'))
    .map(f => ({
      name: f,
      path: path.join(outputDir, f),
      mtime: fs.statSync(path.join(outputDir, f)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0].path : null;
}

// Convert bypass tool cookies to Playwright format
function convertCookies(bypassData) {
  const { hostname } = new URL(url);
  const cookies = [];

  for (const [name, value] of Object.entries(bypassData.cookies)) {
    cookies.push({
      name,
      value,
      domain: hostname,
      path: '/',
      httpOnly: false,
      secure: true
    });
  }

  return cookies;
}

const browser = await chromium.launch({
  headless: false,
});

const context = await browser.newContext();

// Load cookies from bypass tool if available
const cookieFile = findLatestCookiesFile();
if (cookieFile) {
  const bypassData = JSON.parse(fs.readFileSync(cookieFile, 'utf-8'));
  const cookies = convertCookies(bypassData);
  await context.addCookies(cookies);
}

const page = await context.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded' });

console.log('Browser launched in headed mode. Close the tab or press Ctrl+C to stop the run.');

await new Promise(() => {});
