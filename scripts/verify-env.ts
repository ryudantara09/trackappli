/**
 * Environment Variable Verification Script
 * 
 * This script checks if all required environment variables are properly configured.
 * Run with: npx tsx scripts/verify-env.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load .env.local file manually
function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    console.error(`❌ Error: ${filePath} not found!`);
    console.log('\nPlease create a .env.local file by copying .env.example:');
    console.log('  cp .env.example .env.local');
    process.exit(1);
  }
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Parse KEY=VALUE
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Set environment variable if not already set
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
loadEnvFile(envPath);

interface EnvCheck {
  name: string;
  required: boolean;
  description: string;
}

const envChecks: EnvCheck[] = [
  // Required Supabase variables
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key (public)',
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    required: false,
    description: 'Supabase service role key (only needed for admin operations)',
  },
  // Required AI variables
  {
    name: 'GOOGLE_GEMINI_API',
    required: true,
    description: 'Google Gemini API key',
  },
  // Optional variables
  {
    name: 'DATABASE_URL',
    required: false,
    description: 'Direct PostgreSQL connection string',
  },
  {
    name: 'GOOGLE_ID',
    required: false,
    description: 'Google OAuth Client ID',
  },
  {
    name: 'GOOGLE_SECRET',
    required: false,
    description: 'Google OAuth Client Secret',
  },
  {
    name: 'NODE_ENV',
    required: false,
    description: 'Application environment',
  },
  {
    name: 'LOG_LEVEL',
    required: false,
    description: 'Logging verbosity',
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    required: false,
    description: 'Public application URL',
  },
];

function checkEnvironmentVariables() {
  console.log('🔍 Verifying Environment Configuration...\n');
  
  let hasErrors = false;
  let hasWarnings = false;
  
  const results = envChecks.map(check => {
    const value = process.env[check.name];
    const isSet = value !== undefined && value !== '';
    
    let status: 'OK' | 'MISSING' | 'EMPTY' = 'OK';
    if (!value) {
      status = 'MISSING';
    } else if (value.trim() === '') {
      status = 'EMPTY';
    }
    
    if (check.required && status !== 'OK') {
      hasErrors = true;
    } else if (!check.required && status !== 'OK') {
      hasWarnings = true;
    }
    
    return {
      ...check,
      value: isSet ? (value.length > 50 ? value.substring(0, 47) + '...' : value) : undefined,
      status,
    };
  });
  
  // Print required variables
  console.log('📋 Required Variables:');
  console.log('─'.repeat(80));
  results
    .filter(r => r.required)
    .forEach(result => {
      const icon = result.status === 'OK' ? '✅' : '❌';
      const statusText = result.status === 'OK' ? 'SET' : result.status;
      console.log(`${icon} ${result.name.padEnd(35)} ${statusText.padEnd(10)} ${result.description}`);
      if (result.value && result.status === 'OK') {
        console.log(`   Value: ${result.value}`);
      }
    });
  
  // Print optional variables
  console.log('\n📋 Optional Variables:');
  console.log('─'.repeat(80));
  results
    .filter(r => !r.required)
    .forEach(result => {
      const icon = result.status === 'OK' ? '✅' : '⚠️';
      const statusText = result.status === 'OK' ? 'SET' : result.status;
      console.log(`${icon} ${result.name.padEnd(35)} ${statusText.padEnd(10)} ${result.description}`);
      if (result.value && result.status === 'OK') {
        console.log(`   Value: ${result.value}`);
      }
    });
  
  // Print summary
  console.log('\n' + '═'.repeat(80));
  if (hasErrors) {
    console.log('❌ Configuration Error: Missing required environment variables!');
    console.log('\nPlease configure the missing variables in your .env.local file.');
    console.log('See .env.example for reference and README.md for detailed instructions.');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  Configuration Warning: Some optional variables are not set.');
    console.log('The application will work, but some features may be limited.');
  } else {
    console.log('✅ All environment variables are properly configured!');
  }
  console.log('═'.repeat(80));
}

// Run the check
checkEnvironmentVariables();
