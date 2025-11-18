import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../src/core/auth/middleware';
import { ProfileService } from '../../../src/services/profile.service';
import { ProfileRepository } from '../../../src/repositories/profile.repository';
import { createErrorResponse } from '../../../src/utils/errors';
import { validateRequestBody, updateProfileSchema } from '../../../src/utils/validation';

/**
 * GET /api/profile
 * Get complete user profile including work experience, education, and technical skills
 */
export async function GET() {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize service
    const profileService = new ProfileService(supabase);

    // Get complete profile
    const profile = await profileService.getCompleteProfile(userId);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * PUT /api/profile
 * Update user's personal profile information
 */
export async function PUT(request: NextRequest) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Validate request body
    const body = await validateRequestBody(request, updateProfileSchema);

    // Initialize repository
    const profileRepo = new ProfileRepository(supabase);

    // Upsert profile (create if doesn't exist, update if it does)
    const profile = await profileRepo.upsert({
      id: userId,
      first_name: body.first_name ?? null,
      last_name: body.last_name ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      location: body.location ?? null,
      summary: body.summary ?? null,
      website: body.website ?? null,
      linkedin_url: body.linkedin_url ?? null,
      github_url: body.github_url ?? null,
    });

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * POST /api/profile
 * Create user's personal profile information
 * (Uses upsert - will update if profile already exists)
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Validate request body
    const body = await validateRequestBody(request, updateProfileSchema);

    // Initialize repository
    const profileRepo = new ProfileRepository(supabase);

    // Upsert profile (create if doesn't exist, update if it does)
    const profile = await profileRepo.upsert({
      id: userId,
      first_name: body.first_name ?? null,
      last_name: body.last_name ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      location: body.location ?? null,
      summary: body.summary ?? null,
      website: body.website ?? null,
      linkedin_url: body.linkedin_url ?? null,
      github_url: body.github_url ?? null,
    });

    return NextResponse.json({
      success: true,
      data: profile,
    }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/profile
 * Delete user's personal profile information
 */
export async function DELETE() {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize repository
    const profileRepo = new ProfileRepository(supabase);

    // Delete profile
    await profileRepo.delete(userId);

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
