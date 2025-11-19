'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
    const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 dark:bg-neutral-bg-dark/80 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`;
    const textColor = isScrolled
      ? 'text-neutral-text-primary-light dark:text-neutral-text-primary-dark'
      : 'text-neutral-text-primary-light dark:text-neutral-text-primary-dark';

    return (
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center py-4 ${
              isScrolled ? 'border-b border-neutral-border-light/50 dark:border-neutral-border-dark/60' : ''
            }`}
          >
            <Link href="/" className="flex items-center cursor-pointer">
              <BrandLogo className="h-7 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="#features" 
                onClick={(e) => handleAnchorClick(e, '#features')} 
                className={`text-base font-medium ${textColor} hover:text-primary-blue cursor-pointer`}
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => handleAnchorClick(e, '#testimonials')} 
                className={`text-base font-medium ${textColor} hover:text-primary-blue cursor-pointer`}
              >
                Testimonials
              </a>
              <Link 
                href="/blog" 
                className={`text-base font-medium ${textColor} hover:text-primary-blue cursor-pointer`}
              >
                Blog
              </Link>
              <a 
                href="#faq" 
                onClick={(e) => handleAnchorClick(e, '#faq')} 
                className={`text-base font-medium ${textColor} hover:text-primary-blue cursor-pointer`}
              >
                FAQ
              </a>
            </nav>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled ? 'hover:bg-neutral-bg-light dark:hover:bg-neutral-border-dark' : 'hover:bg-white/20 dark:hover:bg-white/10'
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
                  <Link href="/auth">
                    <Button 
                      size="medium" 
                      variant="secondary" 
                      className={
                        isScrolled
                          ? ''
                          : '!text-neutral-text-primary-light dark:!text-neutral-text-primary-dark !border-neutral-gray dark:!border-neutral-border-dark hover:!bg-white/20 dark:hover:!bg-white/10'
                      }
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
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
    <header className="bg-neutral-bg-light dark:bg-neutral-bg-dark pt-8 pb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark truncate">Applications</h1>
          <p className="text-neutral-gray dark:text-neutral-text-secondary-dark mt-1 text-sm sm:text-base">
            Track and manage your job applications here.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-neutral-border-light dark:hover:bg-neutral-border-dark transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-neutral-text-primary-dark" />
            ) : (
              <MoonIcon className="h-5 w-5 text-neutral-text-primary-light" />
            )}
          </button>
          {onExportClick && (
            <Button onClick={onExportClick} size="medium" variant="secondary" className="hidden sm:flex">
              <ArrowDownTrayIcon className="w-5 h-5 mr-2 -ml-1" />
              Export
            </Button>
          )}
          {onExportClick && (
            <Button onClick={onExportClick} size="medium" variant="secondary" className="sm:hidden p-2">
              <ArrowDownTrayIcon className="w-5 h-5" />
            </Button>
          )}
          <Button onClick={onAddApplicationClick} size="medium" className="whitespace-nowrap">
            <PlusIcon className="w-5 h-5 sm:mr-2 -ml-1" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
