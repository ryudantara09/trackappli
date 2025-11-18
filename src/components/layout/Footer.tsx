'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BriefcaseIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '../ui/Icon';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const pathname = usePathname();
  
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's an anchor link on the homepage
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // External links
  if (href.startsWith('http')) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-text-secondary-dark hover:text-white transition-colors cursor-pointer"
        >
          {children}
        </a>
      </li>
    );
  }

  // Anchor links
  if (href.startsWith('#')) {
    return (
      <li>
        <a
          href={href}
          onClick={handleAnchorClick}
          className="text-neutral-text-secondary-dark hover:text-white transition-colors cursor-pointer"
        >
          {children}
        </a>
      </li>
    );
  }

  // Internal links
  return (
    <li>
      <Link
        href={href}
        className="text-neutral-text-secondary-dark hover:text-white transition-colors cursor-pointer"
      >
        {children}
      </Link>
    </li>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-bg-dark text-neutral-text-dark">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white">Features</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="#features">Application Tracking</FooterLink>
              <FooterLink href="#features">AI Data Extraction</FooterLink>
              <FooterLink href="#features">Profile Management</FooterLink>
              <FooterLink href="#features">Chrome Extension</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="#features">Job Search Tips</FooterLink>
              <FooterLink href="#features">Resume Templates</FooterLink>
              <FooterLink href="#features">Interview Guides</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="#features">Blog</FooterLink>
              <FooterLink href="#features">Careers</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-neutral-border-dark pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center">
            <BriefcaseIcon className="h-6 w-6 text-primary-blue" />
            <span className="ml-2 text-lg font-bold text-white">trakaply</span>
            <span className="ml-4 text-sm text-neutral-text-secondary-dark">
              &copy; {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-neutral-text-secondary-dark hover:text-white">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-neutral-text-secondary-dark hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-neutral-text-secondary-dark hover:text-white">
              <span className="sr-only">GitHub</span>
              <GithubIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
