import React from 'react';
import { BriefcaseIcon, MagnifyingGlassIcon, PlusCircleIcon } from './Icon';

interface EmptyStateProps {
  type: 'no-applications' | 'no-results' | 'column-empty';
  searchQuery?: string;
  onAction?: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  searchQuery, 
  onAction,
  title,
  description,
  actionLabel,
}) => {
  if (type === 'no-applications') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mb-4">
          <BriefcaseIcon className="w-10 h-10 text-primary-blue" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-text-primary-light mb-2">
          {title || 'No Applications Yet'}
        </h3>
        <p className="text-neutral-gray mb-6 max-w-sm">
          {description || 'Start tracking your job applications by adding your first one. Keep everything organized in one place!'}
        </p>
        {onAction && (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-primary-blue text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            {actionLabel || 'Add Your First Application'}
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-neutral-border-light rounded-full flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="w-10 h-10 text-neutral-gray" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-text-primary-light mb-2">
          {title || 'No Results Found'}
        </h3>
        <p className="text-neutral-gray mb-2 max-w-sm">
          {description || (searchQuery ? `No applications match "${searchQuery}"` : 'No applications match your filters')}
        </p>
        <p className="text-sm text-neutral-gray">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  // column-empty
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-neutral-gray">
      <div className="w-12 h-12 border-2 border-dashed border-neutral-border-light rounded-lg flex items-center justify-center mb-3">
        <BriefcaseIcon className="w-6 h-6" />
      </div>
      <p className="text-sm">{title || 'No applications'}</p>
    </div>
  );
};
