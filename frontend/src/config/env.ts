/**
 * frontend/src/config/env.ts
 * 
 * Validated environment variables for the frontend.
 * Centralized configuration with type safety and validation.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ENV = process.env.NEXT_PUBLIC_ENV || 'development';
const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

if (!API_URL) {
  console.warn('⚠️ NEXT_PUBLIC_API_URL is not set. API calls will fail.');
}

export const config = {
  api: {
    url: API_URL || 'http://localhost:8000',
    timeout: 30000,
    retries: 3,
  },
  env: ENV as 'development' | 'staging' | 'production',
  isDev: ENV === 'development',
  isProd: ENV === 'production',
  analytics: {
    enabled: ENABLE_ANALYTICS,
  },
} as const;

export default config;
