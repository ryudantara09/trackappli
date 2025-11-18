/**
 * Public Route Group Layout
 * Layout for public pages (landing, auth, about, privacy, terms)
 * No authentication required
 */

import { ReactNode } from 'react';

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
