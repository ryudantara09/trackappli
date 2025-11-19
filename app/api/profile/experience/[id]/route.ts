import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../../../src/core/auth/supabase';
import { ProfileService } from '../../../../../src/services/profile.service';
import { ExperienceRepository } from '../../../../../src/repositories/experience.repository';
import { createErrorResponse, NotFoundError } from '../../../../../src/utils/errors';
import { validateRequestBody, updateWorkExperienceSchema } from '../../../../../src/utils/validation';

/**
 * GET /api/profile/experience/[id]
 * Get a single work experience entry by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Initialize repository
    const experienceRepo = new ExperienceRepository(supabase);

    // Await params
    const { id } = await params;

    // Get work experience (RLS ensures user can only access their own)
    const experience = await experienceRepo.findById(id);

    if (!experience) {
      throw new NotFoundError('Work experience');
    }

    return NextResponse.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * PUT /api/profile/experience/[id]
 * Update a work experience entry
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Validate request body
    const body = await validateRequestBody(request, updateWorkExperienceSchema);

    // Initialize repository
    const experienceRepo = new ExperienceRepository(supabase);

    // Await params
    const { id } = await params;

    // Update work experience (RLS ensures user can only update their own)
    const experience = await experienceRepo.update(id, body);

    return NextResponse.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/profile/experience/[id]
 * Delete a work experience entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Initialize repository
    const experienceRepo = new ExperienceRepository(supabase);

    // Await params
    const { id } = await params;

    // Delete work experience (RLS ensures user can only delete their own)
    await experienceRepo.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Work experience deleted successfully',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
