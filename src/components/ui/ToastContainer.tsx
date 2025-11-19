/**
 * Toast Container Component
 * Displays toast notifications from the useToast hook
 */

'use client';

import React from 'react';
import { Toast as ToastType } from '@/hooks/useToast';
import { Toast } from './Toast';

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: number) => void;
}

/**
 * Toast Container
 * 
 * Renders all active toast notifications in a fixed position.
 * Toasts are stacked vertically with proper spacing.
 * 
 * @param toasts - Array of active toast notifications
 * @param onDismiss - Callback to dismiss a toast by ID
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed top-5 right-5 z-[9999] space-y-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto"
          style={{
            animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            visible={true}
            onClose={() => onDismiss(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};
