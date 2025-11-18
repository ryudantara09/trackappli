import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../../../src/core/auth/supabase';
import { ProfileService } from '../../../../../src/services/profile.service';
import { EducationRepository } from '../../../../../src/repositories/education.repository';
import { createErrorResponse, NotFoundError } from '../../../../../src/utils/errors';
import { validateRequestBody, updateEducationSchema } from '../../../../../src/utils/validation';

/**
 * GET /api/profile/education/[id]
 * Get a single education entry by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Initialize repository
    const educationRepo = new EducationRepository(supabase);

    // Get education (RLS ensures user can only access their own)
    const education = await educationRepo.findById(params.id);

    if (!education) {
      throw new NotFoundError('Education');
    }

    return NextResponse.json({
      success: true,
      data: education,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * PUT /api/profile/education/[id]
 * Update an education entry
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Validate request body
    const body = await validateRequestBody(request, updateEducationSchema);

    // Initialize repository
    const educationRepo = new EducationRepository(supabase);

    // Update education (RLS ensures user can only update their own)
    const education = await educationRepo.update(params.id, body);

    return NextResponse.json({
      success: true,
      data: education,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/profile/education/[id]
 * Delete an education entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Initialize repository
    const educationRepo = new EducationRepository(supabase);

    // Delete education (RLS ensures user can only delete their own)
    await educationRepo.delete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Education deleted successfully',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
