/**
 * Environment Configuration
 * 
 * Validates and exports typed environment variables.
 */

interface EnvironmentConfig {
  database: {
    url: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  ai: {
    geminiApiKey: string;
  };
  app: {
    nodeEnv: string;
    logLevel: string;
  };
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export function getEnvConfig(): EnvironmentConfig {
  return {
    database: {
      url: getRequiredEnv('DATABASE_URL'),
    },
    supabase: {
      url: getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
      anonKey: getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      serviceRoleKey: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    },
    ai: {
      geminiApiKey: getRequiredEnv('GOOGLE_GEMINI_API'),
    },
    app: {
      nodeEnv: getOptionalEnv('NODE_ENV', 'development'),
      logLevel: getOptionalEnv('LOG_LEVEL', 'info'),
    },
  };
}

export const env = getEnvConfig();
