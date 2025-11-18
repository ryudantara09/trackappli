'use client';

/**
 * Toast Context
 * 
 * Provides global toast notification management across the application.
 * Wraps the useToast hook in a context for easy access from any component.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useToast, UseToastReturn } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

/**
 * Toast Context Type
 */
type ToastContextType = UseToastReturn;

/**
 * Toast Context
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider Props
 */
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast Provider Component
 * 
 * Provides toast notification functionality to all child components.
 * Automatically renders the ToastContainer to display notifications.
 * 
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer 
        toasts={toastMethods.toasts} 
        onDismiss={toastMethods.dismissToast} 
      />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast notifications
 * 
 * Must be used within a ToastProvider.
 * 
 * @returns Toast methods and state
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { showSuccess, showError } = useToastContext();
 *   
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       showSuccess('Data saved successfully!');
 *     } catch (error) {
 *       showError('Failed to save data');
 *     }
 *   };
 *   
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  
  return context;
}
