/**
 * Next.js Middleware for Route Protection
 * 
 * This middleware handles:
 * 1. Protecting routes in the (protected) route group - requires authentication
 * 2. Redirecting authenticated users away from auth pages
 * 3. Preserving the intended destination after login
 * 
 * Route Groups:
 * - (protected)/* - Requires authentication, redirects to /auth if not logged in
 * - (public)/auth - Redirects to /dashboard if already logged in
 * - (public)/* - Accessible to everyone
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Site-wide Password Protection
  // Check if the user has the access cookie
  // We use a new cookie name to invalidate previous sessions
  const hasAccess = request.cookies.has('site_protection_token');
  const isPasswordPage = pathname === '/password';
  const isVerificationApi = pathname === '/api/verify-site-password';

  // If no access cookie and not on password page or verification API, redirect to password page
  if (!hasAccess && !isPasswordPage && !isVerificationApi) {
    const url = new URL('/password', request.url);
    // Add a redirect param so we can redirect back after password entry (optional, but good UX)
    // url.searchParams.set('redirect', pathname); 
    const response = NextResponse.redirect(url);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  }

  // If user has access and tries to go to password page, redirect to home
  if (hasAccess && isPasswordPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Set cookie on both request and response
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          // Remove cookie from both request and response
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = !!session;

  // Check if the route is protected (starts with /dashboard, /applications, /profile, /settings, /analytics)
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/applications') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/analytics');

  // Check if the route is the auth page
  const isAuthPage = pathname.startsWith('/auth');

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/auth', request.url);
    
    // Preserve the intended destination in the URL
    // This allows redirecting back after successful login
    redirectUrl.searchParams.set('redirect', pathname);
    
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth page to dashboard
  if (isAuthPage && isAuthenticated) {
    // Check if there's a redirect parameter
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    
    // If there's a redirect parameter and it's a valid protected route, use it
    if (redirectParam && redirectParam.startsWith('/')) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
    
    // Otherwise, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Return the response with updated cookies
  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
