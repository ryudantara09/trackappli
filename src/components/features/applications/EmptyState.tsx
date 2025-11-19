'use client';

import React from 'react';
import { BriefcaseIcon, MagnifyingGlassIcon, PlusCircleIcon } from '@/components/ui/Icon';

interface EmptyStateProps {
  type: 'no-applications' | 'no-results' | 'column-empty';
  searchQuery?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, searchQuery, onAction }) => {
  if (type === 'no-applications') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-primary-light/80 dark:bg-primary-blue/20 rounded-full flex items-center justify-center mb-4">
          <BriefcaseIcon className="w-10 h-10 text-primary-blue" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">
          No Applications Yet
        </h3>
        <p className="text-neutral-gray dark:text-neutral-text-secondary-dark mb-6 max-w-sm">
          Start tracking your job applications by adding your first one. Keep everything organized in one place!
        </p>
        {onAction && (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-primary-blue text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add Your First Application
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-neutral-border-light dark:bg-neutral-border-dark rounded-full flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="w-10 h-10 text-neutral-gray dark:text-neutral-text-secondary-dark" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">
          No Results Found
        </h3>
        <p className="text-neutral-gray dark:text-neutral-text-secondary-dark mb-2 max-w-sm">
          No applications match <span className="font-semibold">"{searchQuery}"</span>
        </p>
        <p className="text-sm text-neutral-gray">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  // column-empty
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-neutral-gray dark:text-neutral-text-secondary-dark">
      <div className="w-12 h-12 border-2 border-dashed border-neutral-border-light dark:border-neutral-border-dark rounded-lg flex items-center justify-center mb-3">
        <BriefcaseIcon className="w-6 h-6" />
      </div>
      <p className="text-sm">No applications</p>
    </div>
  );
};
