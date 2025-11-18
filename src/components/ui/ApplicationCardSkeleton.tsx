import React from 'react';
import { Skeleton } from './Skeleton';

export const ApplicationCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-border-light p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton variant="circular" className="w-10 h-10" />
      </div>

      {/* Location and Date */}
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <Skeleton className="h-6 w-20 rounded-pill" />
      </div>

      {/* Skills */}
      <div className="flex gap-2 flex-wrap">
        <Skeleton className="h-6 w-16 rounded-pill" />
        <Skeleton className="h-6 w-20 rounded-pill" />
        <Skeleton className="h-6 w-18 rounded-pill" />
      </div>
    </div>
  );
};
