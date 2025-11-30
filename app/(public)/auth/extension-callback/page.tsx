/**
 * Extension Auth Callback Page
 * Handles authentication callback for the browser extension
 * If user is logged in, sends tokens to extension immediately
 * If not logged in, redirects to auth page with source=extension
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BriefcaseIcon } from '@/components/ui/Icon';
import { useAuth } from '@/contexts/AuthContext';

export default function ExtensionCallbackPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [status, setStatus] = useState<'checking' | 'sending' | 'success' | 'redirect'>('checking');

  useEffect(() => {
    const handleExtensionAuth = async () => {
      // Wait for auth to load
      if (isLoading) return;

      // If not authenticated, redirect to login
      if (!isAuthenticated || !user) {
        setStatus('redirect');
        router.push('/auth?mode=signin&source=extension');
        return;
      }

      // User is authenticated, send tokens to extension
      setStatus('sending');
      
      try {
        const { getSupabase } = await import('@/lib/auth-client');
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // Send auth data to extension via postMessage
          window.postMessage({
            type: 'TRAKAPP_AUTH_CALLBACK',
            payload: {
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
              expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + 3600000,
              user: {
                id: user.id,
                email: user.email,
              },
            },
          }, '*');

          setStatus('success');
        } else {
          // No session, redirect to login
          setStatus('redirect');
          router.push('/auth?mode=signin&source=extension');
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setStatus('redirect');
        router.push('/auth?mode=signin&source=extension');
      }
    };

    handleExtensionAuth();
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg-light dark:bg-neutral-bg-dark">
      <div className="text-center max-w-md p-8">
        <BriefcaseIcon className="h-16 w-16 mx-auto text-primary-blue mb-6" />
        
        {status === 'checking' && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
              Checking authentication...
            </h1>
          </>
        )}

        {status === 'sending' && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
              Connecting to extension...
            </h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">
              Connected!
            </h1>
            <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">
              You can now close this tab and use the extension.
            </p>
          </>
        )}

        {status === 'redirect' && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
              Redirecting to login...
            </h1>
          </>
        )}
      </div>
    </div>
  );
}
