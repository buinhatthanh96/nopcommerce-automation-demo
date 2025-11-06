import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { getEnvironment, getBaseUrl } from './config/environments';

dotenv.config();

// Get current environment configuration
const env = getEnvironment(process.env.TEST_ENV);

console.log(`🌍 Running tests on: ${env.name} environment`);
console.log(`🔗 Base URL: ${getBaseUrl()}`);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    ['allure-playwright'],
  ],

  use: {
    baseURL: getBaseUrl(),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: env.timeout.action,
    navigationTimeout: env.timeout.navigation,
    viewport: { width: 1920, height: 1080 },
  },

  timeout: 100000,
  expect: {
    timeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // }
  ],
});
