import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Microsoft Playwright Testing Cloud Configuration
 *
 * Setup Instructions:
 * 1. Create Microsoft Playwright Testing workspace in Azure Portal
 * 2. Set PLAYWRIGHT_SERVICE_URL in .env file
 * 3. Set PLAYWRIGHT_SERVICE_ACCESS_TOKEN in .env file
 * 4. Run: npm run test:cloud
 *
 * Environment Variables Required:
 * - PLAYWRIGHT_SERVICE_URL: Your workspace URL from Azure
 * - PLAYWRIGHT_SERVICE_ACCESS_TOKEN: Access token from Azure
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 20, // Cloud supports high parallelism

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    ['blob', { outputDir: 'blob-report' }], // For cloud reporting
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://demo.nopcommerce.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // Microsoft Playwright Testing service configuration
    connectOptions: process.env.PLAYWRIGHT_SERVICE_URL
      ? {
          wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}?cap=${JSON.stringify({
            os: 'windows',
            runId: process.env.GITHUB_RUN_ID || `local-${Date.now()}`,
          })}`,
          timeout: 30000,
          headers: {
            'x-mpt-access-key': process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN || '',
          },
          exposeNetwork: '<loopback>',
        }
      : undefined,
  },

  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  projects: [
    {
      name: 'chrome-windows',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'firefox-windows',
      use: {
        ...devices['Desktop Firefox'],
        channel: 'firefox',
      },
    },
    {
      name: 'edge-windows',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
    {
      name: 'safari-macos',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome-android',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari-ios',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
