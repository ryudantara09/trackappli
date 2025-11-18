import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from './Icon';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'banner' | 'card';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
  onDismiss,
  variant = 'inline',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-red-800 mb-1">{title}</h3>
            <p className="text-sm text-red-700">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Try again
              </button>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 text-red-600 hover:text-red-800"
              aria-label="Dismiss"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white border border-red-200 rounded-lg p-6 text-center ${className}`}>
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-text-primary-light mb-2">
          {title}
        </h3>
        <p className="text-neutral-gray mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // inline variant
  return (
    <div className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
      <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 font-medium underline hover:no-underline"
        >
          Retry
        </button>
      )}
    </div>
  );
};
