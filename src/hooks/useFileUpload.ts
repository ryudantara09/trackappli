/**
 * useFileUpload Hook
 * 
 * Custom hook for handling file uploads with validation and progress tracking.
 * Supports CV and cover letter uploads.
 */

import { useState, useCallback } from 'react';

/**
 * File upload type
 */
export type FileUploadType = 'cv' | 'cover_letter';

/**
 * Upload progress state
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload result
 */
export interface UploadResult {
  path: string;
  url?: string;
}

/**
 * Hook return type
 */
export interface UseFileUploadReturn {
  uploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  uploadFile: (file: File, type: FileUploadType) => Promise<UploadResult>;
  reset: () => void;
}

/**
 * File validation configuration
 */
const FILE_VALIDATION = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['application/pdf'],
  allowedExtensions: ['.pdf'],
};

/**
 * Custom hook for file uploads
 * 
 * @returns Upload state and methods
 * 
 * @example
 * ```tsx
 * const { uploadFile, uploading, progress } = useFileUpload();
 * 
 * const handleUpload = async (file: File) => {
 *   try {
 *     const result = await uploadFile(file, 'cv');
 *     console.log('Uploaded to:', result.path);
 *   } catch (error) {
 *     console.error('Upload failed:', error);
 *   }
 * };
 * ```
 */
export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate file before upload
   * 
   * @param file - File to validate
   * @throws Error if validation fails
   */
  const validateFile = (file: File): void => {
    // Check file size
    if (file.size > FILE_VALIDATION.maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Check file type
    if (!FILE_VALIDATION.allowedTypes.includes(file.type)) {
      throw new Error('Only PDF files are supported');
    }

    // Check file extension
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!FILE_VALIDATION.allowedExtensions.includes(extension)) {
      throw new Error('Only PDF files are supported');
    }
  };

  /**
   * Upload a file to the server
   * 
   * @param file - File to upload
   * @param type - Upload type (cv or cover_letter)
   * @returns Upload result with file path
   * @throws Error on validation or upload failure
   */
  const uploadFile = useCallback(async (
    file: File, 
    type: FileUploadType
  ): Promise<UploadResult> => {
    try {
      // Reset state
      setUploading(true);
      setProgress(null);
      setError(null);

      // Validate file
      validateFile(file);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Create XMLHttpRequest for progress tracking
      return new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            setProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({
                path: response.path || response.data?.path,
                url: response.url || response.data?.url,
              });
            } catch (err) {
              reject(new Error('Invalid response from server'));
            }
          } else {
            try {
              const response = JSON.parse(xhr.responseText);
              reject(new Error(response.error || 'Upload failed'));
            } catch (err) {
              reject(new Error('Upload failed'));
            }
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });

        // Send request
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  /**
   * Reset upload state
   */
  const reset = useCallback(() => {
    setUploading(false);
    setProgress(null);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    reset,
  };
}
