/**
 * Design Preservation Validation Script
 * 
 * This script validates that the integrated application preserves the original
 * frontend design system including colors, typography, spacing, animations, and
 * responsive behavior.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  category: string;
  passed: boolean;
  message: string;
  details?: string[];
}

const results: ValidationResult[] = [];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function addResult(category: string, passed: boolean, message: string, details?: string[]) {
  results.push({ category, passed, message, details });
}

// 1. Validate Color System
function validateColors() {
  log('\n📊 Validating Color System...', 'cyan');
  
  const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
  
  const requiredColors = [
    'primary-blue',
    'primary-dark',
    'primary-light',
    'status-applied',
    'status-interview',
    'status-offer',
    'status-rejected',
    'status-withdrawn',
    'neutral-bg-light',
    'neutral-bg-dark',
    'neutral-border-light',
    'neutral-border-dark',
    'neutral-gray',
  ];
  
  const missingColors: string[] = [];
  const foundColors: string[] = [];
  
  requiredColors.forEach(color => {
    if (tailwindConfig.includes(`'${color}'`)) {
      foundColors.push(color);
    } else {
      missingColors.push(color);
    }
  });
  
  if (missingColors.length === 0) {
    addResult('Colors', true, 'All required colors are defined in Tailwind config', foundColors);
    log('  ✓ All required colors present', 'green');
  } else {
    addResult('Colors', false, 'Missing required colors', missingColors);
    log(`  ✗ Missing colors: ${missingColors.join(', ')}`, 'red');
  }
}

// 2. Validate Typography
function validateTypography() {
  log('\n📝 Validating Typography...', 'cyan');
  
  const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
  
  const requiredFontSizes = [
    'display',
    'h1',
    'h2',
    'h3',
    'h4',
    'body-lg',
    'body',
    'body-sm',
    'caption',
  ];
  
  const requiredFontFamilies = ['sans', 'mono'];
  
  const missingFontSizes: string[] = [];
  const foundFontSizes: string[] = [];
  
  requiredFontSizes.forEach(size => {
    if (tailwindConfig.includes(`'${size}'`)) {
      foundFontSizes.push(size);
    } else {
      missingFontSizes.push(size);
    }
  });
  
  const missingFontFamilies: string[] = [];
  requiredFontFamilies.forEach(family => {
    if (!tailwindConfig.includes(`${family}:`)) {
      missingFontFamilies.push(family);
    }
  });
  
  if (missingFontSizes.length === 0 && missingFontFamilies.length === 0) {
    addResult('Typography', true, 'All typography settings are configured', foundFontSizes);
    log('  ✓ All font sizes and families present', 'green');
  } else {
    const missing = [...missingFontSizes, ...missingFontFamilies];
    addResult('Typography', false, 'Missing typography settings', missing);
    log(`  ✗ Missing: ${missing.join(', ')}`, 'red');
  }
}

// 3. Validate Spacing System
function validateSpacing() {
  log('\n📏 Validating Spacing System...', 'cyan');
  
  const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
  
  const requiredSpacing = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  
  const missingSpacing: string[] = [];
  const foundSpacing: string[] = [];
  
  requiredSpacing.forEach(space => {
    if (tailwindConfig.includes(`'${space}'`)) {
      foundSpacing.push(space);
    } else {
      missingSpacing.push(space);
    }
  });
  
  if (missingSpacing.length === 0) {
    addResult('Spacing', true, 'All spacing values are defined', foundSpacing);
    log('  ✓ All spacing values present', 'green');
  } else {
    addResult('Spacing', false, 'Missing spacing values', missingSpacing);
    log(`  ✗ Missing spacing: ${missingSpacing.join(', ')}`, 'red');
  }
}

// 4. Validate Border Radius
function validateBorderRadius() {
  log('\n🔲 Validating Border Radius...', 'cyan');
  
  const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
  
  const requiredBorderRadius = ['sm', 'md', 'lg', 'xl', 'pill'];
  
  const missingBorderRadius: string[] = [];
  const foundBorderRadius: string[] = [];
  
  requiredBorderRadius.forEach(radius => {
    if (tailwindConfig.includes(`'${radius}'`)) {
      foundBorderRadius.push(radius);
    } else {
      missingBorderRadius.push(radius);
    }
  });
  
  if (missingBorderRadius.length === 0) {
    addResult('Border Radius', true, 'All border radius values are defined', foundBorderRadius);
    log('  ✓ All border radius values present', 'green');
  } else {
    addResult('Border Radius', false, 'Missing border radius values', missingBorderRadius);
    log(`  ✗ Missing border radius: ${missingBorderRadius.join(', ')}`, 'red');
  }
}

// 5. Validate Animations
function validateAnimations() {
  log('\n🎬 Validating Animations...', 'cyan');
  
  const globalsCssPath = path.join(process.cwd(), 'app', 'globals.css');
  const globalsCss = fs.readFileSync(globalsCssPath, 'utf-8');
  
  const requiredAnimations = [
    'fade-in-scale',
    'slide-in-right',
    'fade-in',
    'shimmer',
  ];
  
  const missingAnimations: string[] = [];
  const foundAnimations: string[] = [];
  
  requiredAnimations.forEach(animation => {
    if (globalsCss.includes(`@keyframes ${animation}`) || globalsCss.includes(`.animate-${animation}`)) {
      foundAnimations.push(animation);
    } else {
      missingAnimations.push(animation);
    }
  });
  
  if (missingAnimations.length === 0) {
    addResult('Animations', true, 'All required animations are defined', foundAnimations);
    log('  ✓ All animations present', 'green');
  } else {
    addResult('Animations', false, 'Missing animations', missingAnimations);
    log(`  ✗ Missing animations: ${missingAnimations.join(', ')}`, 'red');
  }
}

// 6. Validate Dark Mode Configuration
function validateDarkMode() {
  log('\n🌙 Validating Dark Mode Configuration...', 'cyan');
  
  const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
  
  const hasDarkMode = tailwindConfig.includes("darkMode: 'class'");
  
  if (hasDarkMode) {
    addResult('Dark Mode', true, 'Dark mode is configured with class strategy');
    log('  ✓ Dark mode configured', 'green');
  } else {
    addResult('Dark Mode', false, 'Dark mode not properly configured');
    log('  ✗ Dark mode not configured', 'red');
  }
}

// 7. Validate Component Files Exist
function validateComponentFiles() {
  log('\n📦 Validating Component Files...', 'cyan');
  
  const requiredComponents = [
    'src/components/ui/Button.tsx',
    'src/components/ui/Icon.tsx',
    'src/components/ui/StatusBadge.tsx',
    'src/components/ui/Toast.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/layout/Sidebar.tsx',
  ];
  
  const missingComponents: string[] = [];
  const foundComponents: string[] = [];
  
  requiredComponents.forEach(component => {
    const componentPath = path.join(process.cwd(), component);
    if (fs.existsSync(componentPath)) {
      foundComponents.push(component);
    } else {
      missingComponents.push(component);
    }
  });
  
  if (missingComponents.length === 0) {
    addResult('Components', true, 'All required components exist', foundComponents);
    log('  ✓ All components present', 'green');
  } else {
    addResult('Components', false, 'Missing components', missingComponents);
    log(`  ✗ Missing components: ${missingComponents.join(', ')}`, 'red');
  }
}

// 8. Validate Page Files Exist
function validatePageFiles() {
  log('\n📄 Validating Page Files...', 'cyan');
  
  const requiredPages = [
    'app/(public)/page.tsx',
    'app/(public)/auth/page.tsx',
    'app/(protected)/dashboard/page.tsx',
    'app/(protected)/applications/page.tsx',
    'app/(protected)/profile/page.tsx',
  ];
  
  const missingPages: string[] = [];
  const foundPages: string[] = [];
  
  requiredPages.forEach(page => {
    const pagePath = path.join(process.cwd(), page);
    if (fs.existsSync(pagePath)) {
      foundPages.push(page);
    } else {
      missingPages.push(page);
    }
  });
  
  if (missingPages.length === 0) {
    addResult('Pages', true, 'All required pages exist', foundPages);
    log('  ✓ All pages present', 'green');
  } else {
    addResult('Pages', false, 'Missing pages', missingPages);
    log(`  ✗ Missing pages: ${missingPages.join(', ')}`, 'red');
  }
}

// 9. Validate Responsive Breakpoints
function validateResponsiveBreakpoints() {
  log('\n📱 Validating Responsive Design...', 'cyan');
  
  const componentFiles = [
    'src/components/layout/Header.tsx',
    'src/components/layout/Sidebar.tsx',
    'app/(protected)/dashboard/page.tsx',
  ];
  
  const responsiveClasses = ['sm:', 'md:', 'lg:', 'xl:'];
  const filesWithResponsive: string[] = [];
  const filesWithoutResponsive: string[] = [];
  
  componentFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const hasResponsive = responsiveClasses.some(cls => content.includes(cls));
      
      if (hasResponsive) {
        filesWithResponsive.push(file);
      } else {
        filesWithoutResponsive.push(file);
      }
    }
  });
  
  if (filesWithResponsive.length > 0) {
    addResult('Responsive Design', true, 'Responsive classes found in components', filesWithResponsive);
    log('  ✓ Responsive design implemented', 'green');
  } else {
    addResult('Responsive Design', false, 'No responsive classes found', filesWithoutResponsive);
    log('  ⚠ Warning: No responsive classes detected', 'yellow');
  }
}

// 10. Validate Global Styles
function validateGlobalStyles() {
  log('\n🎨 Validating Global Styles...', 'cyan');
  
  const globalsCssPath = path.join(process.cwd(), 'app', 'globals.css');
  
  if (!fs.existsSync(globalsCssPath)) {
    addResult('Global Styles', false, 'globals.css not found');
    log('  ✗ globals.css not found', 'red');
    return;
  }
  
  const globalsCss = fs.readFileSync(globalsCssPath, 'utf-8');
  
  const requiredImports = [
    '@tailwind base',
    '@tailwind components',
    '@tailwind utilities',
  ];
  
  const missingImports: string[] = [];
  
  requiredImports.forEach(imp => {
    if (!globalsCss.includes(imp)) {
      missingImports.push(imp);
    }
  });
  
  if (missingImports.length === 0) {
    addResult('Global Styles', true, 'All Tailwind imports present');
    log('  ✓ Global styles configured correctly', 'green');
  } else {
    addResult('Global Styles', false, 'Missing Tailwind imports', missingImports);
    log(`  ✗ Missing imports: ${missingImports.join(', ')}`, 'red');
  }
}

// Generate Report
function generateReport() {
  log('\n' + '='.repeat(60), 'blue');
  log('DESIGN PRESERVATION VALIDATION REPORT', 'blue');
  log('='.repeat(60), 'blue');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  log(`\nTotal Checks: ${total}`, 'cyan');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  
  log('\n' + '-'.repeat(60), 'blue');
  log('DETAILED RESULTS', 'blue');
  log('-'.repeat(60), 'blue');
  
  results.forEach(result => {
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? 'green' : 'red';
    
    log(`\n${icon} ${result.category}: ${result.message}`, color);
    
    if (result.details && result.details.length > 0) {
      result.details.forEach(detail => {
        log(`  - ${detail}`, 'reset');
      });
    }
  });
  
  log('\n' + '='.repeat(60), 'blue');
  
  if (failed === 0) {
    log('✓ ALL DESIGN VALIDATION CHECKS PASSED!', 'green');
    log('The integrated application preserves the original design system.', 'green');
  } else {
    log('✗ SOME VALIDATION CHECKS FAILED', 'red');
    log('Please review the failed checks and ensure design preservation.', 'yellow');
  }
  
  log('='.repeat(60) + '\n', 'blue');
  
  return failed === 0;
}

// Main execution
async function main() {
  log('\n🎨 Starting Design Preservation Validation...', 'blue');
  log('This script validates the design system implementation.\n', 'cyan');
  
  try {
    validateColors();
    validateTypography();
    validateSpacing();
    validateBorderRadius();
    validateAnimations();
    validateDarkMode();
    validateComponentFiles();
    validatePageFiles();
    validateResponsiveBreakpoints();
    validateGlobalStyles();
    
    const success = generateReport();
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    log('\n✗ Validation failed with error:', 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
