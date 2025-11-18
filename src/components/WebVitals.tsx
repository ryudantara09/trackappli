'use client';

/**
 * Web Vitals Reporter Component
 * 
 * Monitors and reports Core Web Vitals metrics
 */

import { useEffect } from 'react';
import { reportWebVital, type PerformanceMetric } from '@/lib/performance';

/**
 * Web Vitals Component
 * 
 * Automatically reports Core Web Vitals when they become available.
 * Should be included in the root layout.
 */
export function WebVitals() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Dynamically import web-vitals library
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      // Report each metric as it becomes available
      onCLS((metric) => {
        reportWebVital({
          name: 'CLS',
          value: metric.value,
          rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
          delta: metric.delta,
          id: metric.id,
        });
      });

      onFID((metric) => {
        reportWebVital({
          name: 'FID',
          value: metric.value,
          rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
          delta: metric.delta,
          id: metric.id,
        });
      });

      onFCP((metric) => {
        reportWebVital({
          name: 'FCP',
          value: metric.value,
          rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
          delta: metric.delta,
          id: metric.id,
        });
      });

      onLCP((metric) => {
        reportWebVital({
          name: 'LCP',
          value: metric.value,
          rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
          delta: metric.delta,
          id: metric.id,
        });
      });

      onTTFB((metric) => {
        reportWebVital({
          name: 'TTFB',
          value: metric.value,
          rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
          delta: metric.delta,
          id: metric.id,
        });
      });
    }).catch((error) => {
      console.error('Failed to load web-vitals:', error);
    });
  }, []);

  // This component doesn't render anything
  return null;
}
