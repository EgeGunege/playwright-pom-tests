// playwright.config.js
import { defineConfig } from '@playwright/test';
import 'dotenv/config';

const isCI = !!process.env.CI;
const isExternal = process.env.EXTERNAL_MONITOR === 'true';

const WIDTH = 2560;
const HEIGHT_EXTERNAL = 1440;

const launchArgs = isExternal
  ? [`--window-size=${WIDTH},${HEIGHT_EXTERNAL}`, '--window-position=0,0']
  : ['--start-maximized'];

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js'],
  timeout: 30 * 1000,
  expect: { timeout: 10 * 1000 },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: isCI,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: null,
    launchOptions: isCI ? {} : { args: launchArgs },
  },
  projects: [
    {
      name: 'chromium-dynamic',
    },
  ],
});
