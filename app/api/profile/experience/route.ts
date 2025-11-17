import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../../src/core/auth/supabase';
import { ProfileService } from '../../../../src/services/profile.service';
import { ExperienceRepository } from '../../../../src/repositories/experience.repository';
import { createErrorResponse } from '../../../../src/utils/errors';
import { validateRequestBody, createWorkExperienceSchema } from '../../../../src/utils/validation';

/**
 * GET /api/profile/experience
 * List all work experience entries for the authenticated user
 */
export async function GET() {
  try {
    // Authenticate user
    const { userId } = await requireAuth();

    // Get Supabase client
    const supabase = await createRouteHandlerClient();

    // Initialize repository
    const experienceRepo = new ExperienceRepository(supabase);

    // Get all work experience
    const experiences = await experienceRepo.findByUserId(userId);

    return NextResponse.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * POST /api/profile/experience
 * Create a new work experience entry
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await requireAuth();

    // Get Supabase client
    const supabase = await createRouteHandlerClient();

    // Validate request body
    const body = await validateRequestBody(request, createWorkExperienceSchema);

    // Initialize service for validation
    const profileService = new ProfileService(supabase);
    
    // Validate work experience data
    const experienceData = {
      user_id: userId,
      ...body,
    };
    profileService.validateWorkExperience(experienceData);

    // Initialize repository
    const experienceRepo = new ExperienceRepository(supabase);

    // Create work experience
    const experience = await experienceRepo.create(experienceData);

    return NextResponse.json({
      success: true,
      data: experience,
    }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
