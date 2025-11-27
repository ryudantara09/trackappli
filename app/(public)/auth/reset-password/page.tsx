/**
 * Reset Password Page
 * Allows users to set a new password after clicking the reset link
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BriefcaseIcon, LockClosedIcon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { updatePassword, getSession } from '@/lib/auth-client';
import { useToastContext } from '@/contexts/ToastContext';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();
  const { showSuccess, showError } = useToastContext();

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          setIsValidSession(true);
        } else {
          showError('Invalid or expired reset link');
        }
      } catch (error) {
        console.error('Session check error:', error);
        showError('Invalid or expired reset link');
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      showSuccess('Password updated successfully! Redirecting...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Password update error:', error);
      showError(error?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg-light dark:bg-neutral-bg-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-neutral-gray">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg-light dark:bg-neutral-bg-dark px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <BriefcaseIcon className="h-12 w-12 text-primary-blue mx-auto" />
          <h2 className="text-2xl font-bold text-neutral-text-primary-light">
            Invalid Reset Link
          </h2>
          <p className="text-neutral-gray">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/auth/forgot-password">
            <Button size="medium" className="w-full">
              Request new reset link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg-light dark:bg-neutral-bg-dark px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex items-center justify-center mb-6">
            <BriefcaseIcon className="h-8 w-8 text-primary-blue" />
            <span className="ml-3 text-2xl font-bold text-neutral-text-primary-light">
              trakappli
            </span>
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-neutral-text-primary-light">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-gray">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-neutral-border-light dark:border-neutral-border-dark pl-10 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm py-3 bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border-neutral-border-light dark:border-neutral-border-dark pl-10 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm py-3 bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              size="medium"
              className="w-full !py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
