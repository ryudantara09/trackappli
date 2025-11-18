/**
 * Performance Monitoring Utilities
 * 
 * Provides utilities for monitoring Core Web Vitals and performance metrics
 */

/**
 * Core Web Vitals thresholds (in milliseconds)
 */
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP) - measures loading performance
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // First Input Delay (FID) - measures interactivity
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  // Cumulative Layout Shift (CLS) - measures visual stability
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
};

/**
 * Performance metric type
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * Get rating for a metric value
 */
function getRating(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];
  
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vital metric
 * 
 * @param metric - Performance metric to report
 */
export function reportWebVital(metric: PerformanceMetric): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // In production, you could send to analytics service
  // Example: sendToAnalytics(metric);
}

/**
 * Measure component render time
 * 
 * @param componentName - Name of the component
 * @param callback - Function to measure
 * @returns Result of the callback
 */
export async function measureRenderTime<T>(
  componentName: string,
  callback: () => T | Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Render Time] ${componentName}: ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.error(`[Render Time] ${componentName} (error): ${duration.toFixed(2)}ms`);
    }

    throw error;
  }
}

/**
 * Measure API call performance
 * 
 * @param endpoint - API endpoint
 * @param callback - API call function
 * @returns Result of the API call
 */
export async function measureApiCall<T>(
  endpoint: string,
  callback: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      const rating = getRating('TTFB', duration);
      console.log(`[API Call] ${endpoint}: ${duration.toFixed(2)}ms (${rating})`);
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.error(`[API Call] ${endpoint} (error): ${duration.toFixed(2)}ms`);
    }

    throw error;
  }
}

/**
 * Get current performance metrics
 * 
 * @returns Object with current performance metrics
 */
export function getPerformanceMetrics(): {
  navigation?: PerformanceNavigationTiming;
  paint?: PerformancePaintTiming[];
  resources?: PerformanceResourceTiming[];
} {
  if (typeof window === 'undefined') {
    return {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint') as PerformancePaintTiming[];
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  return {
    navigation,
    paint,
    resources,
  };
}

/**
 * Calculate and log performance summary
 */
export function logPerformanceSummary(): void {
  if (typeof window === 'undefined') return;

  const metrics = getPerformanceMetrics();

  if (metrics.navigation) {
    const nav = metrics.navigation;
    console.group('Performance Summary');
    console.log('DNS Lookup:', `${(nav.domainLookupEnd - nav.domainLookupStart).toFixed(2)}ms`);
    console.log('TCP Connection:', `${(nav.connectEnd - nav.connectStart).toFixed(2)}ms`);
    console.log('Request Time:', `${(nav.responseStart - nav.requestStart).toFixed(2)}ms`);
    console.log('Response Time:', `${(nav.responseEnd - nav.responseStart).toFixed(2)}ms`);
    console.log('DOM Processing:', `${(nav.domComplete - nav.domInteractive).toFixed(2)}ms`);
    console.log('Load Complete:', `${(nav.loadEventEnd - nav.loadEventStart).toFixed(2)}ms`);
    console.groupEnd();
  }

  if (metrics.paint && metrics.paint.length > 0) {
    console.group('Paint Metrics');
    metrics.paint.forEach(entry => {
      const rating = getRating('FCP', entry.startTime);
      console.log(`${entry.name}:`, `${entry.startTime.toFixed(2)}ms (${rating})`);
    });
    console.groupEnd();
  }
}

/**
 * Monitor bundle size in development
 */
export function monitorBundleSize(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  const metrics = getPerformanceMetrics();
  
  if (metrics.resources) {
    const jsResources = metrics.resources.filter(r => r.name.endsWith('.js'));
    const totalSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    
    console.group('Bundle Size');
    console.log('Total JS:', `${(totalSize / 1024).toFixed(2)} KB`);
    console.log('Number of JS files:', jsResources.length);
    
    // Log largest bundles
    const largest = jsResources
      .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
      .slice(0, 5);
    
    console.log('Largest bundles:');
    largest.forEach(r => {
      const name = r.name.split('/').pop() || r.name;
      console.log(`  ${name}: ${((r.transferSize || 0) / 1024).toFixed(2)} KB`);
    });
    console.groupEnd();
  }
}
