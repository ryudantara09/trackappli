'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BriefcaseIcon, 
  DashboardIcon, 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ChartBarIcon 
} from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active }) => (
  <Link
    href={href}
    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-primary-blue text-white font-semibold'
        : 'text-neutral-gray hover:bg-primary-light hover:text-primary-dark'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </Link>
);

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Extract user display name from email or use placeholder
  const userEmail = user?.email || 'user@example.com';
  const userName = userEmail.split('@')[0] || 'User';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <aside className="w-64 bg-neutral-surface-light dark:bg-neutral-surface-dark border-r border-neutral-border-light dark:border-neutral-border-dark flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-neutral-border-light dark:border-neutral-border-dark">
        <Link href="/" className="flex items-center cursor-pointer">
          <BriefcaseIcon className="h-8 w-8 text-primary-blue" />
          <span className="ml-3 text-2xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            trakaply
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem
          icon={<DashboardIcon className="w-6 h-6" />}
          label="Dashboard"
          href="/dashboard"
          active={pathname === '/dashboard'}
        />
        <NavItem
          icon={<BriefcaseIcon className="w-6 h-6" />}
          label="Applications"
          href="/applications"
          active={pathname === '/applications'}
        />
        <NavItem
          icon={<ChartBarIcon className="w-6 h-6" />}
          label="Analytics"
          href="/analytics"
          active={pathname === '/analytics'}
        />
        <NavItem
          icon={<UserCircleIcon className="w-6 h-6" />}
          label="Profile"
          href="/profile"
          active={pathname === '/profile'}
        />
        <NavItem
          icon={<Cog6ToothIcon className="w-6 h-6" />}
          label="Settings"
          href="/settings"
          active={pathname === '/settings'}
        />
      </nav>
      <div className="p-4 border-t border-neutral-border-light dark:border-neutral-border-dark">
        <div className="flex items-center gap-3 mb-4">
          <img
            className="h-10 w-10 rounded-full"
            src={`https://avatar.vercel.sh/${userEmail}`}
            alt="User avatar"
          />
          <div>
            <p className="font-semibold text-sm text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
              {displayName}
            </p>
            <Link
              href="/profile"
              className="text-xs text-neutral-gray dark:text-neutral-text-secondary-dark hover:underline text-left"
            >
              View Profile
            </Link>
          </div>
        </div>
        <Button onClick={handleLogout} variant="secondary" size="small" className="w-full">
          Log Out
        </Button>
      </div>
    </aside>
  );
};
