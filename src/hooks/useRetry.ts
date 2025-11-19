'use client';

import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
}

interface UseRetryReturn<T> {
  execute: () => Promise<T | null>;
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
  reset: () => void;
}

export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: UseRetryOptions = {}
): UseRetryReturn<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  const execute = useCallback(async (): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    let lastError: Error | null = null;
    let attempts = 0;

    while (attempts <= maxRetries) {
      try {
        const result = await asyncFunction();
        setIsLoading(false);
        setRetryCount(attempts);
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');
        attempts++;
        setRetryCount(attempts);

        if (attempts <= maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
        }
      }
    }

    // All retries failed
    setError(lastError);
    setIsLoading(false);
    
    if (onError && lastError) {
      onError(lastError);
    }

    return null;
  }, [asyncFunction, maxRetries, retryDelay, onError]);

  return {
    execute,
    isLoading,
    error,
    retryCount,
    reset,
  };
}
