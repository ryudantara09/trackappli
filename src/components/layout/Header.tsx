'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { PlusIcon, ArrowDownTrayIcon, BriefcaseIcon, MoonIcon, SunIcon } from '../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { BrandLogo } from '../ui/BrandLogo';

interface HeaderProps {
  onAddApplicationClick?: () => void;
  onExportClick?: () => void;
  variant?: 'dashboard' | 'landing';
}

export const Header: React.FC<HeaderProps> = ({
  onAddApplicationClick,
  onExportClick,
  variant = 'dashboard'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    if (pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Allow default navigation to home page with anchor
      // No preventDefault() here
    }
  };

  useEffect(() => {
    if (variant !== 'landing') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  if (variant === 'landing') {
    const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm shadow-sm border-b border-neutral-200 dark:border-neutral-800' : 'bg-transparent'
      }`;
    const textColor = isScrolled
      ? 'text-neutral-900 dark:text-white'
      : 'text-neutral-900 dark:text-white';

    return (
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center py-4`}
          >
            <Link href="/" className="flex items-center cursor-pointer">
              <BrandLogo className="h-7 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/#features"
                onClick={(e) => handleAnchorClick(e, '#features')}
                className={`text-base font-medium ${textColor} hover:text-primary-blue cursor-pointer`}
              >
                Features
              </Link>
              <Link
                href="/#testimonials"
                onClick={(e) => handleAnchorClick(e, '#testimonials')}
                className={`text-base font-medium ${textColor} hover:text-primary-blue cursor-pointer`}
              >
                Testimonials
              </Link>
              <Link
                href="/blog"
                className={`text-base font-medium ${textColor} hover:text-primary-blue cursor-pointer`}
              >
                Blog
              </Link>
              <Link
                href="/#faq"
                onClick={(e) => handleAnchorClick(e, '#faq')}
                className={`text-base font-medium ${textColor} hover:text-primary-blue cursor-pointer`}
              >
                FAQ
              </Link>
            </nav>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${isScrolled ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800' : 'hover:bg-white/20 dark:hover:bg-white/10'
                  }`}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <SunIcon className={`h-5 w-5 ${textColor}`} />
                ) : (
                  <MoonIcon className={`h-5 w-5 ${textColor}`} />
                )}
              </button>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="medium">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth?mode=signin">
                    <Button
                      size="medium"
                      variant="secondary"
                      className={
                        isScrolled
                          ? ''
                          : '!text-neutral-900 dark:!text-white !border-neutral-300 dark:!border-neutral-700 hover:!bg-white/20 dark:hover:!bg-white/10'
                      }
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signup">
                    <Button size="medium">Get Started Free</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-transparent mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-2.5 border-none rounded-full leading-5 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 shadow-sm transition-all duration-200"
              placeholder="Search your applications..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-white dark:bg-neutral-800 text-neutral-500 hover:text-primary-blue shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          <button className="p-2.5 rounded-full bg-white dark:bg-neutral-800 text-neutral-500 hover:text-primary-blue shadow-sm hover:shadow-md transition-all duration-200 relative">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-800" />
          </button>

          {onAddApplicationClick && (
            <Button onClick={onAddApplicationClick} size="medium" className="rounded-full shadow-lg shadow-primary-blue/20 px-6">
              <PlusIcon className="w-5 h-5 mr-2" />
              <span>New Application</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
