'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  onClose: () => void;
  onUndo?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, visible, onClose, onUndo }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
       handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Wait for fade-out animation
  };

  const baseStyles = 'w-full max-w-sm p-4 rounded-lg shadow-lg flex items-center transition-all duration-300';
  const typeStyles = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100',
    error: 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  };
  
  const visibilityStyles = show
    ? 'opacity-100 translate-x-0'
    : 'opacity-0 translate-x-full';

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${visibilityStyles}`}>
      <div className="flex-shrink-0">
        {type === 'success' ? (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        ) : type === 'error' ? (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
        ) : (
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
        )}
      </div>
      <div className="ml-3 text-sm font-medium flex-1">{message}</div>
      {onUndo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUndo();
          }}
          className="ml-3 px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          Undo
        </button>
      )}
      <button onClick={handleClose} className="ml-3 -mx-1.5 -my-1.5 bg-transparent p-1.5 rounded-lg inline-flex h-8 w-8 text-current hover:bg-black/10">
        <span className="sr-only">Dismiss</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
      </button>
    </div>
  );
};
