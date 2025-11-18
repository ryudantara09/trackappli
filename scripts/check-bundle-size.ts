/**
 * Bundle Size Checker
 * 
 * Analyzes the production build and reports bundle sizes
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface BundleSizeReport {
  route: string;
  size: string;
  firstLoadJS: string;
}

/**
 * Parse Next.js build output to extract bundle sizes
 */
function parseBuildOutput(output: string): BundleSizeReport[] {
  const reports: BundleSizeReport[] = [];
  const lines = output.split('\n');
  
  let inRouteSection = false;
  
  for (const line of lines) {
    // Detect route section
    if (line.includes('Route (app)') || line.includes('Size')) {
      inRouteSection = true;
      continue;
    }
    
    // Parse route lines
    if (inRouteSection && line.trim()) {
      // Match lines like: ○ /about    1.2 kB    85 kB
      const match = line.match(/[○●λ]\s+(\S+)\s+(\d+\.?\d*\s*[kKmM]?B)\s+(\d+\.?\d*\s*[kKmM]?B)/);
      if (match) {
        reports.push({
          route: match[1],
          size: match[2],
          firstLoadJS: match[3],
        });
      }
    }
    
    // End of route section
    if (inRouteSection && line.includes('First Load JS shared by all')) {
      break;
    }
  }
  
  return reports;
}

/**
 * Convert size string to bytes
 */
function sizeToBytes(sizeStr: string): number {
  const match = sizeStr.match(/(\d+\.?\d*)\s*([kKmM]?B)/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  
  switch (unit) {
    case 'KB':
      return value * 1024;
    case 'MB':
      return value * 1024 * 1024;
    case 'B':
    default:
      return value;
  }
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Analyze bundle sizes and provide recommendations
 */
function analyzeBundles(reports: BundleSizeReport[]): void {
  console.log('\n📊 Bundle Size Analysis\n');
  console.log('='.repeat(80));
  
  // Thresholds (in bytes)
  const THRESHOLDS = {
    firstLoadJS: 200 * 1024, // 200 KB
    routeSize: 100 * 1024,   // 100 KB
  };
  
  let totalSize = 0;
  let largeRoutes: BundleSizeReport[] = [];
  
  // Analyze each route
  reports.forEach(report => {
    const firstLoadBytes = sizeToBytes(report.firstLoadJS);
    const routeBytes = sizeToBytes(report.size);
    
    totalSize += routeBytes;
    
    // Check if route exceeds thresholds
    if (firstLoadBytes > THRESHOLDS.firstLoadJS || routeBytes > THRESHOLDS.routeSize) {
      largeRoutes.push(report);
    }
  });
  
  // Summary
  console.log(`\n📦 Total Routes: ${reports.length}`);
  console.log(`📏 Total Bundle Size: ${formatBytes(totalSize)}`);
  console.log(`⚠️  Large Routes: ${largeRoutes.length}`);
  
  // List all routes
  console.log('\n📄 Route Breakdown:\n');
  console.log('Route'.padEnd(40) + 'Size'.padEnd(15) + 'First Load JS');
  console.log('-'.repeat(80));
  
  reports.forEach(report => {
    const firstLoadBytes = sizeToBytes(report.firstLoadJS);
    const routeBytes = sizeToBytes(report.size);
    
    let indicator = '✅';
    if (firstLoadBytes > THRESHOLDS.firstLoadJS) indicator = '🔴';
    else if (routeBytes > THRESHOLDS.routeSize) indicator = '🟡';
    
    console.log(
      `${indicator} ${report.route.padEnd(37)}${report.size.padEnd(15)}${report.firstLoadJS}`
    );
  });
  
  // Recommendations
  if (largeRoutes.length > 0) {
    console.log('\n⚠️  Performance Recommendations:\n');
    
    largeRoutes.forEach(report => {
      const firstLoadBytes = sizeToBytes(report.firstLoadJS);
      const routeBytes = sizeToBytes(report.size);
      
      console.log(`Route: ${report.route}`);
      
      if (firstLoadBytes > THRESHOLDS.firstLoadJS) {
        console.log(`  - First Load JS (${report.firstLoadJS}) exceeds 200 KB threshold`);
        console.log(`  - Consider code splitting or lazy loading components`);
      }
      
      if (routeBytes > THRESHOLDS.routeSize) {
        console.log(`  - Route size (${report.size}) exceeds 100 KB threshold`);
        console.log(`  - Consider dynamic imports for large components`);
      }
      
      console.log('');
    });
  } else {
    console.log('\n✅ All routes meet performance targets!\n');
  }
  
  // Performance targets
  console.log('🎯 Performance Targets:\n');
  console.log(`  First Load JS: < 200 KB (${formatBytes(THRESHOLDS.firstLoadJS)})`);
  console.log(`  Route Size: < 100 KB (${formatBytes(THRESHOLDS.routeSize)})`);
  console.log('');
  
  console.log('='.repeat(80));
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Checking bundle sizes...\n');
  
  try {
    // Check if build exists
    const buildPath = join(process.cwd(), '.next');
    if (!existsSync(buildPath)) {
      console.log('⚠️  No build found. Running production build...\n');
      
      // Run build (skip type check for now due to Next.js 15 migration issues)
      execSync('npm run build -- --no-lint', {
        stdio: 'inherit',
        env: { ...process.env, SKIP_TYPE_CHECK: 'true' },
      });
    }
    
    // Read build manifest or re-run build to capture output
    console.log('\n📊 Analyzing bundle sizes...\n');
    
    const buildOutput = execSync('npm run build -- --no-lint', {
      encoding: 'utf-8',
      env: { ...process.env, SKIP_TYPE_CHECK: 'true' },
    });
    
    // Parse and analyze
    const reports = parseBuildOutput(buildOutput);
    
    if (reports.length === 0) {
      console.log('⚠️  Could not parse build output. Please run `npm run build` manually.');
      process.exit(1);
    }
    
    analyzeBundles(reports);
    
  } catch (error) {
    console.error('❌ Error checking bundle sizes:', error);
    process.exit(1);
  }
}

main();
