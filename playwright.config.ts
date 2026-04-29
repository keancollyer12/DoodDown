import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 0,
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
  },
});
