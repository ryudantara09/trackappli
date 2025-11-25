/**
 * Forgot Password Page
 * Allows users to request a password reset email
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BriefcaseIcon, EnvelopeIcon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { resetPassword } from '@/lib/auth-client';
import { useToastContext } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
      showSuccess('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      showError(error?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

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
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-gray">
            {emailSent
              ? 'Check your email for a password reset link'
              : 'Enter your email address and we\'ll send you a link to reset your password'}
          </p>
        </div>

        {!emailSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-neutral-border-light pl-10 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm py-3"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                size="medium"
                className="w-full !py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/auth"
                className="font-medium text-primary-blue hover:text-primary-dark text-sm"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setEmailSent(false)}
                size="medium"
                variant="secondary"
                className="w-full"
              >
                Try another email
              </Button>

              <div className="text-center">
                <Link
                  href="/auth"
                  className="font-medium text-primary-blue hover:text-primary-dark text-sm"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
