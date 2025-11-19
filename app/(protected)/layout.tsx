/**
 * Protected Route Group Layout
 * Layout for authenticated pages (dashboard, applications, profile, settings, analytics)
 * Requires authentication - will be enforced by middleware
 */

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
