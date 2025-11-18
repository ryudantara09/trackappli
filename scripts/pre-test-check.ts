#!/usr/bin/env tsx
/**
 * Pre-Test Environment Check
 * 
 * This script validates that the environment is properly configured
 * before running integration tests.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_URL',
];

const OPTIONAL_ENV_VARS = [
  'GOOGLE_GEMINI_API',
  'SUPABASE_SERVICE_ROLE_KEY',
];

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}${message}${reset}`);
}

async function checkEnvironmentVariables() {
  log('\n=== Checking Environment Variables ===\n', 'info');

  let allRequired = true;

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    if (value) {
      log(`✓ ${varName}: configured`, 'success');
    } else {
      log(`✗ ${varName}: MISSING`, 'error');
      allRequired = false;
    }
  }

  log('\n=== Optional Environment Variables ===\n', 'info');

  for (const varName of OPTIONAL_ENV_VARS) {
    const value = process.env[varName];
    if (value) {
      log(`✓ ${varName}: configured`, 'success');
    } else {
      log(`⚠ ${varName}: not configured (some tests may be skipped)`, 'warn');
    }
  }

  return allRequired;
}

async function checkSupabaseConnection() {
  log('\n=== Checking Supabase Connection ===\n', 'info');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log('✗ Cannot check Supabase connection: missing credentials', 'error');
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to get session (this will fail if Supabase is not accessible)
    const { error } = await supabase.auth.getSession();
    
    if (error && error.message !== 'Auth session missing!') {
      throw error;
    }

    log('✓ Supabase connection successful', 'success');
    log(`  URL: ${supabaseUrl}`, 'info');
    return true;
  } catch (error) {
    log('✗ Supabase connection failed', 'error');
    log(`  Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    return false;
  }
}

async function checkServerRunning() {
  log('\n=== Checking Development Server ===\n', 'info');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const response = await fetch(appUrl, { method: 'HEAD' });
    
    if (response.ok || response.status === 404) {
      log('✓ Development server is running', 'success');
      log(`  URL: ${appUrl}`, 'info');
      return true;
    } else {
      log('✗ Development server returned unexpected status', 'error');
      log(`  Status: ${response.status}`, 'error');
      return false;
    }
  } catch (error) {
    log('✗ Development server is not running', 'error');
    log(`  URL: ${appUrl}`, 'error');
    log('  Please start the server with: npm run dev', 'warn');
    return false;
  }
}

async function checkAPIEndpoints() {
  log('\n=== Checking API Endpoints ===\n', 'info');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const endpoints = [
    '/api/health',
    '/api/applications',
    '/api/profile',
    '/api/export',
  ];

  let allAccessible = true;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${appUrl}${endpoint}`, { method: 'HEAD' });
      
      // 401 is acceptable for protected endpoints
      if (response.ok || response.status === 401 || response.status === 405) {
        log(`✓ ${endpoint}: accessible`, 'success');
      } else {
        log(`⚠ ${endpoint}: returned ${response.status}`, 'warn');
      }
    } catch (error) {
      log(`✗ ${endpoint}: not accessible`, 'error');
      allAccessible = false;
    }
  }

  return allAccessible;
}

async function main() {
  log('\n╔════════════════════════════════════════╗', 'info');
  log('║   Pre-Test Environment Validation     ║', 'info');
  log('╚════════════════════════════════════════╝', 'info');

  const envCheck = await checkEnvironmentVariables();
  const supabaseCheck = await checkSupabaseConnection();
  const serverCheck = await checkServerRunning();
  const apiCheck = await checkAPIEndpoints();

  log('\n=== Summary ===\n', 'info');

  if (envCheck && supabaseCheck && serverCheck) {
    log('✓ Environment is ready for integration testing', 'success');
    log('\nYou can now run: npm run test:integration', 'info');
    process.exit(0);
  } else {
    log('✗ Environment is not ready for integration testing', 'error');
    log('\nPlease fix the issues above before running tests', 'warn');
    
    if (!envCheck) {
      log('\n→ Configure missing environment variables in .env.local', 'warn');
    }
    if (!supabaseCheck) {
      log('\n→ Check Supabase credentials and project status', 'warn');
    }
    if (!serverCheck) {
      log('\n→ Start the development server: npm run dev', 'warn');
    }
    
    process.exit(1);
  }
}

main().catch(error => {
  log(`\nFatal error: ${error.message}`, 'error');
  process.exit(1);
});
