/**
 * Custom Hooks Index
 * 
 * Central export point for all custom hooks.
 */

export { useApplications } from './useApplications';
export type { ApplicationFilters, UseApplicationsReturn } from './useApplications';

export { useFileUpload } from './useFileUpload';
export type { 
  FileUploadType, 
  UploadProgress, 
  UploadResult, 
  UseFileUploadReturn 
} from './useFileUpload';

export { useToast } from './useToast';
export type { 
  Toast, 
  ToastType, 
  ToastOptions, 
  UseToastReturn 
} from './useToast';

// Re-export useAuth from contexts for convenience
export { useAuth } from '../contexts/AuthContext';
