import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // Reporter to use
  reporter: 'html',

  use: {
    browserName: 'chromium',
    headless: false,
    baseURL: 'http://localhost:3000', // Update with your actual URL
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
