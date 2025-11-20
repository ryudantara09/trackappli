import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../src/core/auth/middleware';
import { createErrorResponse, ValidationError } from '../../../src/utils/errors';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../../../src/config/constants';

/**
 * POST /api/upload
 * Upload files (CV, cover letters) to Supabase Storage
 * Returns file path and public URL
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { user, supabase } = await requireAuth();

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    // Validate file presence
    if (!file) {
      throw new ValidationError('No file provided. Please upload a file.');
    }

    // Validate upload type
    if (!type || !['cv', 'cover_letter', 'avatar'].includes(type)) {
      throw new ValidationError('Invalid upload type. Must be "cv", "cover_letter", or "avatar".');
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new ValidationError(
        `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError(
        `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique file name
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${user.id}/${type}/${timestamp}_${sanitizedFileName}`;

    // Determine bucket based on type
    const bucket = type === 'avatar' ? 'avatars' : 'documents';

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      path: fileName,
      url: urlData.publicUrl,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/upload
 * Delete a file from Supabase Storage
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const { user, supabase } = await requireAuth();

    // Parse request body
    const body = await request.json();
    const { path } = body;

    if (!path) {
      throw new ValidationError('File path is required');
    }

    // Verify the file belongs to the user
    if (!path.startsWith(`${user.id}/`)) {
      throw new ValidationError('Unauthorized: Cannot delete files that do not belong to you');
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([path]);

    if (deleteError) {
      console.error('Supabase storage delete error:', deleteError);
      throw new Error(`Failed to delete file: ${deleteError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
