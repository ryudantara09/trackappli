import { NextResponse } from 'next/server';
import { requireAuth } from '../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../src/core/auth/supabase';
import { ProfileService } from '../../../src/services/profile.service';
import { createErrorResponse } from '../../../src/utils/errors';

/**
 * GET /api/profile
 * Get complete user profile including work experience, education, and technical skills
 */
export async function GET() {
  try {
    // Authenticate user
    const { userId } = await requireAuth();

    // Get Supabase client
    const supabase = await createRouteHandlerClient();

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
