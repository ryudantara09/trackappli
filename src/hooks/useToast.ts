/**
 * useToast Hook
 * 
 * Custom hook for managing toast notifications.
 * Provides methods to show success, error, and info messages.
 */

import { useState, useCallback } from 'react';

/**
 * Toast notification type
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * Toast notification interface
 */
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * Toast options
 */
export interface ToastOptions {
  duration?: number; // Duration in milliseconds (default: 5000)
}

/**
 * Hook return type
 */
export interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, options?: ToastOptions) => void;
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  dismissToast: (id: number) => void;
  clearAll: () => void;
}

/**
 * Custom hook for toast notifications
 * 
 * @returns Toast state and methods
 * 
 * @example
 * ```tsx
 * const { showSuccess, showError } = useToast();
 * 
 * const handleSave = async () => {
 *   try {
 *     await saveData();
 *     showSuccess('Data saved successfully!');
 *   } catch (error) {
 *     showError('Failed to save data');
 *   }
 * };
 * ```
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Show a toast notification
   * 
   * @param message - Toast message
   * @param type - Toast type (success, error, info)
   * @param options - Optional configuration
   */
  const showToast = useCallback((
    message: string, 
    type: ToastType, 
    options?: ToastOptions
  ) => {
    const id = Date.now();
    const duration = options?.duration ?? 5000;

    // Add toast to state
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-dismiss after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  /**
   * Show a success toast
   * 
   * @param message - Success message
   * @param options - Optional configuration
   */
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'success', options);
  }, [showToast]);

  /**
   * Show an error toast
   * 
   * @param message - Error message
   * @param options - Optional configuration
   */
  const showError = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'error', options);
  }, [showToast]);

  /**
   * Show an info toast
   * 
   * @param message - Info message
   * @param options - Optional configuration
   */
  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'info', options);
  }, [showToast]);

  /**
   * Manually dismiss a toast
   * 
   * @param id - Toast ID
   */
  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    dismissToast,
    clearAll,
  };
}
