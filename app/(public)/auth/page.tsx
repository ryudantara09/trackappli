/**
 * Authentication Page
 * Handles user login and signup with real Supabase authentication
 * Migrated from front/pages/AuthPage.tsx with real auth integration
 */

'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BriefcaseIcon,
  GoogleIcon,
  LinkedinIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';

const SocialButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full inline-flex items-center justify-center px-4 py-2 border border-neutral-border-light rounded-md shadow-sm bg-neutral-surface-light text-sm font-medium text-neutral-gray hover:bg-neutral-bg-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
  >
    {icon}
    <span className="ml-2 sm:ml-3 truncate">{label}</span>
  </button>
);

const InputField: React.FC<{
  id: string;
  name: string;
  type: string;
  label: string;
  autoComplete: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, name, type, label, autoComplete, icon, value, onChange }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-neutral-text-primary-light sr-only"
    >
      {label}
    </label>
    <div className="relative mt-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        placeholder={label}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-neutral-border-light pl-10 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm py-3"
      />
    </div>
  </div>
);

const AuthPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToastContext();
  
  // Get mode from URL parameter (signup or signin)
  const mode = searchParams.get('mode') || 'signup';
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup, loginWithGoogle, loginWithLinkedIn } = useAuth();
  
  // Get the redirect parameter from URL (set by middleware)
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  
  // Update isSignUp when mode changes
  React.useEffect(() => {
    setIsSignUp(mode === 'signup');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      showError('Please fill in all required fields');
      return;
    }

    if (isSignUp && !fullName) {
      showError('Please enter your full name');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password);
        showSuccess('Account created successfully! Redirecting...');
      } else {
        await login(email, password);
        showSuccess('Logged in successfully! Redirecting...');
      }
      
      // Redirect to intended destination or dashboard after successful authentication
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific Supabase error messages
      const errorMessage = error?.message || 'Authentication failed';
      
      if (errorMessage.includes('Invalid login credentials')) {
        showError('Invalid email or password');
      } else if (errorMessage.includes('User already registered')) {
        showError('An account with this email already exists');
      } else if (errorMessage.includes('Email not confirmed')) {
        showError('Please confirm your email address');
      } else {
        showError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark overflow-x-hidden">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <BriefcaseIcon className="h-8 w-8 text-primary-blue flex-shrink-0" />
              <span className="ml-3 text-xl sm:text-2xl font-bold text-neutral-text-primary-light">
                trakappli
              </span>
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-text-primary-light">
              {isSignUp ? 'Get started for free' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm text-neutral-gray">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                href={isSignUp ? '/auth?mode=signin' : '/auth?mode=signup'}
                className="font-medium text-primary-blue hover:text-primary-dark"
              >
                {isSignUp ? 'Sign in' : 'Sign up for free'}
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SocialButton
                icon={<GoogleIcon className="w-5 h-5" />}
                label="Google"
                onClick={loginWithGoogle}
              />
              <SocialButton
                icon={<LinkedinIcon className="w-5 h-5 text-[#0077b5]" />}
                label="LinkedIn"
                onClick={loginWithLinkedIn}
              />
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-neutral-border-light dark:border-neutral-border-dark" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-gray dark:text-neutral-text-secondary-dark">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <InputField
                    id="full-name"
                    name="full-name"
                    type="text"
                    label="Full Name"
                    autoComplete="name"
                    icon={<UserIcon className="h-5 w-5 text-gray-400" />}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                )}

                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  autoComplete="email"
                  icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <InputField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete="current-password"
                  icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-blue focus:ring-primary-dark"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-neutral-gray"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        href="/auth/forgot-password"
                        className="font-medium text-primary-blue hover:text-primary-dark"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    size="medium"
                    className="w-full !py-3"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? 'Please wait...'
                      : isSignUp
                      ? 'Create free account'
                      : 'Sign in'}
                  </Button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-neutral-gray dark:text-neutral-text-secondary-dark text-center">
                    By signing up, you agree to the{' '}
                    <Link
                      href="/terms"
                      className="underline hover:text-neutral-text-primary-light dark:hover:text-neutral-text-primary-dark"
                    >
                      Terms of Service
                    </Link>
                    .
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image & Testimonial */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-gradient-to-br from-primary-blue to-primary-dark items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'white\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e")',
          }}
        ></div>
        <div className="relative text-center text-white max-w-md">
          <BriefcaseIcon className="h-12 w-12 mx-auto text-white/50" />
          <blockquote className="mt-8 text-2xl font-semibold leading-relaxed">
            "trakappli transformed my chaotic job search into an organized,
            stress-free process. The AI assistant is a game-changer!"
          </blockquote>
          <div className="mt-8 flex items-center justify-center">
            <img
              src="https://avatar.vercel.sh/jane"
              alt="Jane Doe"
              className="w-12 h-12 rounded-full border-2 border-white/50"
            />
            <div className="ml-4 text-left">
              <p className="font-bold">Jane D.</p>
              <p className="text-primary-light/80">Software Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap in Suspense to handle useSearchParams
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-neutral-bg-light dark:bg-neutral-bg-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-neutral-gray">Loading...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
