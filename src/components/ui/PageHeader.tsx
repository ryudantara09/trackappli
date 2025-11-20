'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  badge,
  children 
}) => {
  return (
    <div className="mb-8">
      {badge && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-blue bg-blue-100 dark:bg-blue-900/30 rounded-full">
            {badge}
          </span>
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            {title}
          </h1>
          {description && (
            <p className="text-neutral-gray dark:text-neutral-text-secondary-dark mt-1">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

