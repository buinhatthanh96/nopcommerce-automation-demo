/**
 * Test Environment Configuration
 * Supports multiple environments: demo, test, production
 */

export interface Environment {
  name: string;
  baseUrl: string;
  apiUrl?: string;
  timeout: {
    default: number;
    navigation: number;
    action: number;
  };
}

export const environments: Record<string, Environment> = {
  demo: {
    name: 'Demo',
    baseUrl: 'https://demo.nopcommerce.com',
    timeout: {
      default: 30000,
      navigation: 30000,
      action: 15000,
    },
  },
  test: {
    name: 'Test',
    baseUrl: 'https://test.nopcommerce.com',
    timeout: {
      default: 30000,
      navigation: 30000,
      action: 15000,
    },
  },
  staging: {
    name: 'Staging',
    baseUrl: 'https://staging.nopcommerce.com',
    timeout: {
      default: 45000,
      navigation: 45000,
      action: 20000,
    },
  },
  production: {
    name: 'Production',
    baseUrl: 'https://www.nopcommerce.com',
    timeout: {
      default: 60000,
      navigation: 60000,
      action: 30000,
    },
  },
};

/**
 * Get environment configuration
 * @param envName - Environment name (demo, test, staging, production)
 * @returns Environment configuration object
 */
export function getEnvironment(envName?: string): Environment {
  const env = envName || process.env.TEST_ENV || 'demo';
  const environment = environments[env.toLowerCase()];

  if (!environment) {
    console.warn(`Environment '${env}' not found. Falling back to 'demo'.`);
    return environments.demo;
  }

  return environment;
}

/**
 * Get base URL from environment or override
 */
export function getBaseUrl(): string {
  return process.env.BASE_URL || getEnvironment().baseUrl;
}

