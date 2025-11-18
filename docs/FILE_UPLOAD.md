# File Upload Functionality

This document describes the file upload implementation for CVs and cover letters in the application.

## Overview

The file upload system allows users to:
- Upload PDF files (CVs and cover letters) to Supabase Storage
- Track upload progress in real-time
- Preview and download uploaded files
- Delete uploaded files
- Associate files with job applications

## Architecture

### Components

#### 1. API Route (`/api/upload`)

**Location:** `trackappli/app/api/upload/route.ts`

**Endpoints:**

- **POST /api/upload** - Upload a file
  - Accepts multipart/form-data with `file` and `type` fields
  - Validates file type (PDF only) and size (max 5MB)
  - Stores file in Supabase Storage under `{userId}/{type}/{timestamp}_{filename}`
  - Returns file path and public URL

- **DELETE /api/upload** - Delete a file
  - Accepts JSON body with `path` field
  - Verifies user owns the file
  - Removes file from Supabase Storage

**Security:**
- Requires authentication (uses `requireAuth` middleware)
- Validates file ownership before deletion
- Enforces file size and type restrictions

#### 2. FileUpload Component

**Location:** `trackappli/src/components/ui/FileUpload.tsx`

**Features:**
- File selection with validation
- Real-time upload progress tracking
- File preview with download and delete actions
- Error handling and user feedback

**Props:**
```typescript
interface FileUploadProps {
  type: 'cv' | 'cover_letter';
  currentFile?: string | null;
  onFileUploaded: (path: string, url?: string) => void;
  onFileDeleted?: () => void;
  label?: string;
  className?: string;
}
```

**Usage:**
```tsx
<FileUpload
  type="cv"
  currentFile={application.cvPath}
  onFileUploaded={(path) => {
    // Handle file upload
    updateApplication({ cvPath: path });
  }}
  onFileDeleted={() => {
    // Handle file deletion
    updateApplication({ cvPath: undefined });
  }}
/>
```

#### 3. useFileUpload Hook

**Location:** `trackappli/src/hooks/useFileUpload.ts`

**Features:**
- Client-side file validation
- XMLHttpRequest-based upload with progress tracking
- Error handling

**API:**
```typescript
const {
  uploading,      // boolean - upload in progress
  progress,       // { loaded, total, percentage } | null
  error,          // string | null
  uploadFile,     // (file: File, type: FileUploadType) => Promise<UploadResult>
  reset,          // () => void
} = useFileUpload();
```

## Storage Structure

Files are stored in Supabase Storage with the following structure:

```
documents/
  └── {userId}/
      ├── cv/
      │   └── {timestamp}_{filename}.pdf
      └── cover_letter/
          └── {timestamp}_{filename}.pdf
```

## Database Schema

File paths are stored in the `applications` table:

```sql
ALTER TABLE applications
  ADD COLUMN cv_path TEXT,
  ADD COLUMN cover_letter_path TEXT;
```

## Supabase Storage Setup

### Bucket Configuration

A public storage bucket named `documents` is created with the following RLS policies:

1. **Upload Policy** - Users can only upload to their own folder
2. **View Policy** - Users can view their own files
3. **Update Policy** - Users can update their own files
4. **Delete Policy** - Users can delete their own files
5. **Public Access** - Public can view files (for download URLs)

### Migration

Run the migration to set up storage:

```bash
supabase migration up 003_create_storage_bucket
```

Or manually execute: `trackappli/supabase/migrations/003_create_storage_bucket.sql`

## Integration with Application Forms

### AddApplicationModal

The file upload component is integrated into the application creation form:

```tsx
<FileUpload
  type="cv"
  currentFile={formState.cvPath}
  onFileUploaded={(path) => {
    setFormState(prev => ({ ...prev, cvPath: path }));
  }}
  onFileDeleted={() => {
    setFormState(prev => ({ ...prev, cvPath: undefined }));
  }}
/>
```

### EditApplicationModal

Similar integration for editing existing applications with file management.

## Data Mapping

The data mapper handles file path transformations:

**Frontend → Backend:**
- `cvPath` → `cv_path`
- `coverLetterPath` → `cover_letter_path`

**Backend → Frontend:**
- `cv_path` → `cvPath`
- `cover_letter_path` → `coverLetterPath`

## Validation Rules

### Client-Side
- File type: PDF only (`.pdf`)
- File size: Maximum 5MB
- File name: Sanitized (alphanumeric, dots, hyphens only)

### Server-Side
- Authentication required
- File type validation
- File size validation
- Ownership verification (for deletion)

## Error Handling

### Common Errors

1. **File too large** - "File size must be less than 5MB"
2. **Invalid file type** - "Only PDF files are supported"
3. **Upload failed** - Network or server errors
4. **Unauthorized deletion** - Attempting to delete another user's file

### Error Display

Errors are displayed:
- In the FileUpload component (inline error message)
- Via toast notifications (for critical errors)

## File Download

Files can be downloaded via public URLs:

```typescript
const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${filePath}`;
window.open(publicUrl, '_blank');
```

## Testing

### Manual Testing Checklist

- [ ] Upload a valid PDF file
- [ ] Verify progress tracking works
- [ ] Upload a file larger than 5MB (should fail)
- [ ] Upload a non-PDF file (should fail)
- [ ] Download an uploaded file
- [ ] Delete an uploaded file
- [ ] Verify file persists after page reload
- [ ] Test with multiple files (CV and cover letter)

### API Testing

Use Bruno or similar tool to test the API endpoints:

**Upload:**
```http
POST /api/upload
Content-Type: multipart/form-data

file: [PDF file]
type: cv
```

**Delete:**
```http
DELETE /api/upload
Content-Type: application/json

{
  "path": "user-id/cv/timestamp_filename.pdf"
}
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Future Enhancements

Potential improvements:

1. **Multiple file formats** - Support DOCX, TXT, etc.
2. **Image uploads** - Support screenshots, logos
3. **File compression** - Reduce storage costs
4. **Virus scanning** - Add malware detection
5. **CDN integration** - Faster file delivery
6. **Thumbnail generation** - Preview for documents
7. **Drag-and-drop** - Improved UX
8. **Batch upload** - Multiple files at once

## Troubleshooting

### Upload fails with "Failed to upload file"

1. Check Supabase Storage bucket exists
2. Verify RLS policies are configured
3. Check file size and type
4. Verify authentication token is valid

### Files not visible after upload

1. Check bucket is set to public
2. Verify public access policy exists
3. Check file path is correct

### Cannot delete files

1. Verify user owns the file
2. Check delete policy in Supabase
3. Verify file path format is correct

## References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Next.js File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#formdata)
- [XMLHttpRequest Progress](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload)
