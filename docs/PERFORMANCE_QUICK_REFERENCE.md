# Performance Optimization Quick Reference

## 🚀 Quick Start

### Check Performance
```bash
# View Web Vitals in browser console
npm run dev
# Open http://localhost:3000 and check console

# Check bundle sizes
npm run check:bundle

# Build for production
npm run build
```

## 📦 Using Optimizations

### 1. API Caching

```typescript
import { apiClient } from '@/lib/api-client';

// Automatic caching (5 minutes)
const apps = await apiClient.getApplications();

// Clear cache manually
apiClient.clearCache(); // Clear all
apiClient.clearCache('GET:/applications'); // Clear specific
```

### 2. Dynamic Imports (Code Splitting)

```typescript
import { DynamicAddApplicationModal } from '@/components/DynamicModal';

// Modal loaded only when rendered
{showModal && (
  <DynamicAddApplicationModal 
    onClose={() => setShowModal(false)}
  />
)}
```

### 3. Performance Monitoring

```typescript
import { measureApiCall, measureRenderTime } from '@/lib/performance';

// Measure API calls
const data = await measureApiCall('/api/applications', async () => {
  return await apiClient.getApplications();
});

// Measure component render
await measureRenderTime('MyComponent', async () => {
  // Component logic
});
```

### 4. Next.js Image Component

```tsx
import Image from 'next/image';

// ✅ Optimized
<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  priority // For above-the-fold images
/>

// ❌ Not optimized
<img src="/logo.png" alt="Logo" />
```

## 🎯 Performance Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | 2.5s - 4.0s | > 4.0s |
| FID | < 100ms | 100ms - 300ms | > 300ms |
| CLS | < 0.1 | 0.1 - 0.25 | > 0.25 |
| FCP | < 1.8s | 1.8s - 3.0s | > 3.0s |
| TTFB | < 800ms | 800ms - 1800ms | > 1800ms |

## 📊 Bundle Size Targets

- **First Load JS:** < 200 KB
- **Route Size:** < 100 KB
- **Vendor Chunk:** < 150 KB

## 🛠️ Common Tasks

### Clear API Cache
```typescript
// In any component
import { apiClient } from '@/lib/api-client';

// Clear all cache
apiClient.clearCache();

// Clear specific endpoint
apiClient.clearCache('GET:/applications');
```

### Create Dynamic Component
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false // For client-only components
  }
);
```

### Monitor Performance
```typescript
// Automatically logged in development
// Check browser console for:
// [Web Vital] LCP: { value: 1234, rating: 'good' }
// [API Call] /api/applications: 234ms (good)
```

## 📝 Configuration Files

### Next.js Config
- **File:** `next.config.ts`
- **Features:** Image optimization, code splitting, compression

### API Client
- **File:** `src/lib/api-client.ts`
- **Features:** Caching, error handling, data transformation

### Performance Utils
- **File:** `src/lib/performance.ts`
- **Features:** Web Vitals, measurement utilities

### Dynamic Modals
- **File:** `src/components/DynamicModal.tsx`
- **Features:** Lazy-loaded modals

## 🔍 Troubleshooting

### Slow Page Load
1. Check Web Vitals in console
2. Run `npm run check:bundle`
3. Look for large bundles
4. Add dynamic imports for heavy components

### API Calls Too Slow
1. Check cache configuration
2. Verify database indexes
3. Use `measureApiCall()` to identify slow endpoints
4. Consider pagination

### Large Bundle Size
1. Run `npm run build:analyze`
2. Identify large dependencies
3. Use dynamic imports
4. Remove unused dependencies

## 📚 Documentation

- **Full Guide:** `docs/PERFORMANCE_OPTIMIZATION.md`
- **Summary:** `docs/PERFORMANCE_SUMMARY.md`
- **This File:** `docs/PERFORMANCE_QUICK_REFERENCE.md`

## ✅ Checklist

- [ ] Web Vitals monitoring enabled
- [ ] API caching configured
- [ ] Dynamic imports for modals
- [ ] Next.js Image component used
- [ ] Bundle size checked
- [ ] Performance targets met
