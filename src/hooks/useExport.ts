import { useState, useCallback } from 'react';

export interface ExportOptions {
  format?: 'csv' | 'json';
  status?: string;
  includeNotes?: boolean;
  includeDescription?: boolean;
}

export interface UseExportReturn {
  isExporting: boolean;
  progress: number;
  exportApplications: (options?: ExportOptions) => Promise<void>;
}

/**
 * Custom hook for exporting applications
 * Handles the API call and file download
 */
export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportApplications = useCallback(async (options: ExportOptions = {}) => {
    try {
      setIsExporting(true);
      setProgress(10); // Start progress

      // Build query params
      const params = new URLSearchParams();
      if (options.status) {
        params.append('status', options.status);
      }
      if (options.includeNotes !== undefined) {
        params.append('includeNotes', String(options.includeNotes));
      }
      if (options.includeDescription !== undefined) {
        params.append('includeDescription', String(options.includeDescription));
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Make API request
      const response = await fetch(`/api/export?${params.toString()}`);

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Export failed');
      }

      setProgress(100);

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determine filename and extension
      const format = options.format || 'csv';
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `applications_export_${timestamp}.${format}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, []);

  return {
    isExporting,
    progress,
    exportApplications,
  };
}