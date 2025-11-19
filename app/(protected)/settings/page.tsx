'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import type { ToastState } from '@/types/frontend.types';
import { exportToCSV } from '../../../src/utils/exportUtils';
import { useTheme } from '@/contexts/ThemeContext';
import { useApplications } from '@/hooks/useApplications';

const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { applications } = useApplications();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
  };

  const handleExportData = () => {
    if (applications.length === 0) {
      showToast('No data to export', 'error');
      return;
    }
    exportToCSV(applications);
    showToast('Data exported successfully!', 'success');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (prompt('Type "DELETE" to confirm') === 'DELETE') {
        // TODO: Delete account
        showToast('Account deleted successfully', 'success');
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">Settings</h1>
          <p className="text-neutral-gray dark:text-neutral-text-secondary-dark mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Theme Settings */}
        <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">Dark Mode</h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                darkMode ? 'bg-primary-blue' : 'bg-neutral-border-light'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-neutral-border-light dark:border-neutral-border-dark gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">Email Notifications</h3>
                <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">Receive email updates about your applications</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-primary-blue' : 'bg-neutral-border-light'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-neutral-border-light dark:border-neutral-border-dark">
              <div>
                <h3 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">Application Reminders</h3>
                <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">Get reminded to follow up on applications</p>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-blue"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">Weekly Summary</h3>
                <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">Receive a weekly summary of your job search</p>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-border-light"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 mb-6">
          <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">Account</h2>
          
          <div className="space-y-4">
            <div className="py-4 border-b border-neutral-border-light dark:border-neutral-border-dark">
              <h3 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">Change Password</h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark mb-4">Update your password to keep your account secure</p>
              <Button variant="secondary" size="medium">Change Password</Button>
            </div>

            <div className="py-4">
              <h3 className="font-semibold text-error mb-2">Delete Account</h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button onClick={handleDeleteAccount} variant="danger" size="medium">
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6">
          <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">Data & Privacy</h2>
          
          <div className="space-y-4">
            <div className="py-4 border-b border-neutral-border-light dark:border-neutral-border-dark">
              <h3 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">Export Your Data</h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark mb-4">
                Download all your applications and data in CSV format
              </p>
              <Button onClick={handleExportData} variant="secondary" size="medium">
                Export to CSV
              </Button>
            </div>

            <div className="py-4">
              <h3 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">Privacy Policy</h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark mb-4">
                Review how we collect, use, and protect your personal information
              </p>
              <a 
                href="/privacy" 
                className="text-primary-blue hover:underline text-sm"
              >
                View Privacy Policy →
              </a>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
};

export default SettingsPage;
