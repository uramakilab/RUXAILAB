// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const devBaseUrl = 'http://localhost:8080';

module.exports = defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Output directory for screenshots of failed tests */
  outputDir: './playwright/output',

  use: {
    baseURL: devBaseUrl,
    ...devices['Desktop Chrome'],
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Create a screenshot if a test fails */
    screenshot: { mode: 'only-on-failure', fullPage: true },

    /* Set global timeout for actions (e.g., click, fill) */
    actionTimeout: 10000,

    /* Set global timeout for navigation */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      retries: 1,
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      retries: 1,
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      retries: 1,
    },
  ],
});
