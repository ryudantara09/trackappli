# Performance Optimization Guide

This document outlines the performance optimizations implemented in the application and how to monitor and maintain them.

## Overview

The application has been optimized for performance with focus on:
- Bundle size reduction
- API response caching
- Code splitting for large components
- Core Web Vitals monitoring
- Image optimization (when images are added)

## Implemented Optimizations

### 1. Next.js Configuration (`next.config.ts`)

#### Image Optimization
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

**Benefits:**
- Automatic image format conversion to modern formats (AVIF, WebP)
- Responsive image serving based on device size
- Built-in caching for optimized images

**Usage:**
```tsx
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg" 
  alt="Description"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

#### Compiler Optimizations
```typescript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'],
  } : false,
}
```

**Benefits:**
- Removes console.log statements in production
- Keeps error and warn logs for debugging
- Reduces bundle size

#### Bundle Splitting
```typescript
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /node_modules/,
          priority: 20,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 10,
        },
      },
    };
  }
  return config;
}
```

**Benefits:**
- Separates vendor code from application code
- Creates common chunks for shared code
- Improves caching and reduces duplicate code

### 2. API Response Caching (`src/lib/api-client.ts`)

#### Cache Implementation
```typescript
private cache = new Map<string, CacheEntry<any>>();
private defaultCacheTTL = 5 * 60 * 1000; // 5 minutes
```

**Features:**
- Automatic caching of GET requests
- 5-minute default TTL (configurable)
- Automatic cache invalidation on mutations (POST, PUT, DELETE)
- Manual cache clearing via `apiClient.clearCache()`

**Benefits:**
- Reduces redundant API calls
- Improves perceived performance
- Reduces server load

**Usage:**
```typescript
// Automatic caching
const apps = await apiClient.getApplications(); // Cached for 5 minutes

// Clear cache manually
apiClient.clearCache(); // Clear all
apiClient.clearCache('GET:/applications'); // Clear specific
```

### 3. Code Splitting (`src/components/DynamicModal.tsx`)

#### Dynamic Modal Loading
```typescript
export const DynamicAddApplicationModal = dynamic(
  () => import('@/components/features/applications/AddApplicationModal'),
  { loading: () => <ModalLoading />, ssr: false }
);
```

**Benefits:**
- Modals loaded only when needed
- Reduces initial bundle size
- Improves Time to Interactive (TTI)

**Usage:**
```tsx
import { DynamicAddApplicationModal } from '@/components/DynamicModal';

// Modal code is loaded only when rendered
{showModal && <DynamicAddApplicationModal onClose={...} />}
```

### 4. Web Vitals Monitoring

#### Core Web Vitals Tracked
- **LCP (Largest Contentful Paint)**: Loading performance
  - Good: < 2.5s
  - Needs Improvement: 2.5s - 4.0s
  - Poor: > 4.0s

- **FID (First Input Delay)**: Interactivity
  - Good: < 100ms
  - Needs Improvement: 100ms - 300ms
  - Poor: > 300ms

- **CLS (Cumulative Layout Shift)**: Visual stability
  - Good: < 0.1
  - Needs Improvement: 0.1 - 0.25
  - Poor: > 0.25

- **FCP (First Contentful Paint)**: Initial render
  - Good: < 1.8s
  - Needs Improvement: 1.8s - 3.0s
  - Poor: > 3.0s

- **TTFB (Time to First Byte)**: Server response
  - Good: < 800ms
  - Needs Improvement: 800ms - 1800ms
  - Poor: > 1800ms

#### Monitoring in Development
Web Vitals are automatically logged to the console in development mode:
```
[Web Vital] LCP: { value: 1234, rating: 'good', delta: 100 }
[Web Vital] FID: { value: 45, rating: 'good', delta: 5 }
```

#### Performance Utilities
```typescript
import { measureApiCall, measureRenderTime } from '@/lib/performance';

// Measure API call performance
const data = await measureApiCall('/api/applications', async () => {
  return await apiClient.getApplications();
});

// Measure component render time
await measureRenderTime('MyComponent', async () => {
  // Component logic
});
```

## Build Analysis

### Running Production Build
```bash
npm run build
```

This will output:
- Bundle sizes for each route
- First Load JS size
- Shared chunks

### Analyzing Bundle Size
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

## Performance Targets

### Bundle Size Targets
- **First Load JS**: < 200 KB (gzipped)
- **Route-specific JS**: < 100 KB (gzipped)
- **Vendor chunk**: < 150 KB (gzipped)

### Core Web Vitals Targets
All metrics should be in the "good" range:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- FCP: < 1.8s
- TTFB: < 800ms

### API Performance Targets
- **List endpoints**: < 500ms
- **Single item endpoints**: < 200ms
- **Create/Update endpoints**: < 300ms
- **Delete endpoints**: < 200ms

## Best Practices

### 1. Image Optimization
Always use Next.js Image component:
```tsx
import Image from 'next/image';

// ✅ Good
<Image src="/logo.png" alt="Logo" width={200} height={50} />

// ❌ Bad
<img src="/logo.png" alt="Logo" />
```

### 2. Code Splitting
Use dynamic imports for large components:
```tsx
import dynamic from 'next/dynamic';

// ✅ Good - Loaded on demand
const HeavyComponent = dynamic(() => import('./HeavyComponent'));

// ❌ Bad - Loaded immediately
import HeavyComponent from './HeavyComponent';
```

### 3. API Caching
Leverage the built-in cache:
```tsx
// ✅ Good - Cached automatically
const apps = await apiClient.getApplications();

// Clear cache when needed
apiClient.clearCache();
```

### 4. Font Optimization
Use Next.js font optimization:
```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents layout shift
});
```

### 5. Lazy Loading
Lazy load components below the fold:
```tsx
'use client';
import { lazy, Suspense } from 'react';

const Footer = lazy(() => import('./Footer'));

<Suspense fallback={<div>Loading...</div>}>
  <Footer />
</Suspense>
```

## Monitoring in Production

### Setting Up Analytics
To send Web Vitals to analytics in production:

```typescript
// src/lib/performance.ts
export function reportWebVital(metric: PerformanceMetric): void {
  if (process.env.NODE_ENV === 'production') {
    // Send to your analytics service
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(metric),
    });
  }
}
```

### Recommended Tools
- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics 4**: Web Vitals integration
- **Sentry**: Performance monitoring
- **New Relic**: Full-stack monitoring

## Troubleshooting

### Large Bundle Size
1. Run bundle analyzer: `ANALYZE=true npm run build`
2. Identify large dependencies
3. Consider alternatives or dynamic imports
4. Remove unused dependencies

### Slow API Calls
1. Check cache configuration
2. Verify database indexes
3. Optimize database queries
4. Consider pagination for large datasets

### Poor LCP Score
1. Optimize images (use Next.js Image)
2. Reduce render-blocking resources
3. Use Server Components for initial render
4. Implement proper loading states

### High CLS Score
1. Set explicit dimensions for images
2. Reserve space for dynamic content
3. Use `font-display: swap` for fonts
4. Avoid inserting content above existing content

## Maintenance

### Regular Checks
- Run `npm run build` before each deployment
- Monitor bundle size trends
- Check Web Vitals in production
- Review and update cache TTLs
- Audit dependencies quarterly

### Performance Budget
Set up performance budgets in `next.config.ts`:
```typescript
experimental: {
  performanceBudget: {
    maxInitialLoadSize: 200 * 1024, // 200 KB
    maxRouteLoadSize: 100 * 1024,   // 100 KB
  },
}
```

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [Bundle Analysis](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
