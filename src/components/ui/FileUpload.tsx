'use client';

import React, { useRef, useState } from 'react';
import { useFileUpload, FileUploadType } from '@/hooks/useFileUpload';
import { Button } from './Button';
import { DocumentIcon, TrashIcon, ArrowDownTrayIcon } from './Icon';

interface FileUploadProps {
  type: FileUploadType;
  currentFile?: string | null;
  onFileUploaded: (path: string, url?: string) => void;
  onFileDeleted?: () => void;
  label?: string;
  className?: string;
}

/**
 * FileUpload Component
 * 
 * Handles file upload with validation, progress tracking, and preview
 * Supports CV and cover letter uploads
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  currentFile,
  onFileUploaded,
  onFileDeleted,
  label,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading, progress, error } = useFileUpload();
  const [localFile, setLocalFile] = useState<string | null>(currentFile || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, type);
      setLocalFile(result.path);
      onFileUploaded(result.path, result.url);
    } catch (err) {
      console.error('Upload failed:', err);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!localFile) return;

    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: localFile }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setLocalFile(null);
      onFileDeleted?.();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleDownload = () => {
    if (!localFile) return;
    
    // Get public URL and download
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/documents/${localFile}`;
    
    window.open(publicUrl, '_blank');
  };

  const displayLabel = label || (type === 'cv' ? 'CV/Resume' : 'Cover Letter');
  const fileName = localFile ? localFile.split('/').pop() : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {displayLabel}
      </label>

      {localFile ? (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-neutral-border-light rounded-md">
          <DocumentIcon className="w-5 h-5 text-primary-blue flex-shrink-0" />
          <span className="text-sm text-gray-700 flex-1 truncate" title={fileName || ''}>
            {fileName}
          </span>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1 text-primary-blue hover:text-primary-dark transition-colors"
            title="Download file"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
            title="Delete file"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : `Upload ${displayLabel}`}
          </Button>
        </div>
      )}

      {uploading && progress && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            {progress.percentage}% uploaded
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        PDF files only, max 5MB
      </p>
    </div>
  );
};
