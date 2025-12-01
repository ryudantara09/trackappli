'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BriefcaseIcon,
  DashboardIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  NotebookPenIcon,
} from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { Button } from '../ui/Button';
import { BrandLogo } from '../ui/BrandLogo';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active }) => (
  <Link
    href={href}
    className={`w-full flex items-center px-5 py-3.5 rounded-full transition-all duration-200 mb-1 ${active
        ? 'bg-primary-blue/10 text-primary-blue font-bold'
        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 font-medium'
      }`}
  >
    {icon}
    <span className="ml-3 text-sm">{label}</span>
  </Link>
);

export const Sidebar: React.FC = () => {
  const { logout, user, isAdmin } = useAuth();
  const { profile } = useProfile();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Extract user display name from email or use placeholder
  const userEmail = user?.email || 'user@example.com';

  const fullName = [profile?.profile?.first_name, profile?.profile?.last_name]
    .filter(Boolean)
    .join(' ');

  const emailName = userEmail.split('@')[0] || 'User';
  const formattedEmailName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

  const displayName = fullName || formattedEmailName;
  const avatarUrl = profile?.profile?.avatar_url || `https://avatar.vercel.sh/${userEmail}`;

  return (
    <aside className="w-72 bg-white dark:bg-neutral-900 flex-shrink-0 flex flex-col z-20 h-screen sticky top-0 py-6 pl-6">
      <div className="flex flex-col h-full bg-white dark:bg-neutral-900 pr-6">
        <div className="h-16 flex items-center px-4 mb-6">
          <Link href="/" className="flex items-center cursor-pointer">
            <BrandLogo className="h-8 w-auto" priority={false} />
          </Link>
        </div>

        <div className="px-4 mb-2">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Overview</p>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          <NavItem
            icon={<DashboardIcon className="w-5 h-5" />}
            label="Dashboard"
            href="/dashboard"
            active={pathname === '/dashboard'}
          />
          <NavItem
            icon={<BriefcaseIcon className="w-5 h-5" />}
            label="Applications"
            href="/applications"
            active={pathname === '/applications'}
          />
          <NavItem
            icon={<ChartBarIcon className="w-5 h-5" />}
            label="Analytics"
            href="/analytics"
            active={pathname === '/analytics'}
          />

          <div className="mt-8 mb-2 px-2">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Account</p>
          </div>

          <NavItem
            icon={<UserCircleIcon className="w-5 h-5" />}
            label="Profile"
            href="/profile"
            active={pathname === '/profile'}
          />
          <NavItem
            icon={<Cog6ToothIcon className="w-5 h-5" />}
            label="Settings"
            href="/settings"
            active={pathname === '/settings'}
          />
          {isAdmin && (
            <NavItem
              icon={<NotebookPenIcon className="w-5 h-5" />}
              label="Blog"
              href="/dashboard/blog"
              active={pathname === '/dashboard/blog'}
            />
          )}
        </nav>

        <div className="mt-auto px-4 pt-6">
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-3xl p-4 flex items-center gap-3 mb-4">
            <img
              className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-neutral-700 shadow-sm"
              src={avatarUrl}
              alt="User avatar"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-neutral-500 truncate">Free Plan</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="small"
            className="w-full rounded-full border-none bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-600 font-medium"
          >
            Log Out
          </Button>
        </div>
      </div>
    </aside>
  );
};
