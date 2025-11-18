'use client';

/**
 * Dynamic Modal Loader
 * 
 * Provides code-split modal components that are loaded on-demand
 * to reduce initial bundle size
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Loading component for modals
 */
function ModalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-bg-dark rounded-lg p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary-blue border-t-transparent rounded-full"></div>
      </div>
    </div>
  );
}

/**
 * Dynamically imported Add Application Modal
 * Loaded only when needed to reduce initial bundle size
 */
export const DynamicAddApplicationModal = dynamic(
  () => import('@/components/features/applications/AddApplicationModal').then(mod => mod.AddApplicationModal),
  {
    loading: () => <ModalLoading />,
    ssr: false, // Modals don't need SSR
  }
);

/**
 * Dynamically imported Edit Application Modal
 * Loaded only when needed to reduce initial bundle size
 */
export const DynamicEditApplicationModal = dynamic(
  () => import('@/components/features/applications/EditApplicationModal').then(mod => mod.EditApplicationModal),
  {
    loading: () => <ModalLoading />,
    ssr: false, // Modals don't need SSR
  }
);

/**
 * Generic dynamic modal loader
 * 
 * @param importFn - Function that returns a promise of the modal component
 * @returns Dynamically loaded modal component
 */
export function createDynamicModal<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>
) {
  return dynamic(
    async () => {
      const mod = await importFn();
      return 'default' in mod ? mod.default : mod;
    },
    {
      loading: () => <ModalLoading />,
      ssr: false,
    }
  );
}
