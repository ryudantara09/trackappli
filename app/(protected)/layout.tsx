/**
 * Protected Route Group Layout
 * Layout for authenticated pages (dashboard, applications, profile, settings, analytics)
 * Requires authentication - will be enforced by middleware
 */

import { ReactNode } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
