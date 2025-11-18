'use client';

import React, { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';

interface AsyncContentProps {
  isLoading: boolean;
  error?: Error | string | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
}

export const AsyncContent: React.FC<AsyncContentProps> = ({
  isLoading,
  error,
  isEmpty = false,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  emptyMessage,
  children,
  className = '',
}) => {
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    const errorMessage = typeof error === 'string' ? error : error.message;
    return (
      <div className={className}>
        <ErrorMessage
          variant="card"
          message={errorMessage}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (isEmpty) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }
    return (
      <div className={className}>
        <EmptyState
          type="no-applications"
          title="No Data"
          description={emptyMessage || 'No data available'}
        />
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};
