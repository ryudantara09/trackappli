import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../../src/core/auth/supabase';
import { ProfileService } from '../../../../src/services/profile.service';
import { EducationRepository } from '../../../../src/repositories/education.repository';
import { createErrorResponse } from '../../../../src/utils/errors';
import { validateRequestBody, createEducationSchema } from '../../../../src/utils/validation';

/**
 * GET /api/profile/education
 * List all education entries for the authenticated user
 */
export async function GET() {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize repository
    const educationRepo = new EducationRepository(supabase);

    // Get all education
    const education = await educationRepo.findByUserId(userId);

    return NextResponse.json({
      success: true,
      data: education,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * POST /api/profile/education
 * Create a new education entry
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Validate request body
    const body = await validateRequestBody(request, createEducationSchema);

    // Initialize service for validation
    const profileService = new ProfileService(supabase);
    
    // Validate education data
    const educationData = {
      user_id: userId,
      ...body,
    };
    profileService.validateEducation(educationData);

    // Initialize repository
    const educationRepo = new EducationRepository(supabase);

    // Create education
    const education = await educationRepo.create(educationData);

    return NextResponse.json({
      success: true,
      data: education,
    }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
