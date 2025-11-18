import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
  fullScreen = false,
  transparent = false,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0';

  const bgClasses = transparent
    ? 'bg-white/50'
    : 'bg-white';

  return (
    <div className={`${containerClasses} ${bgClasses} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-neutral-gray text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};
