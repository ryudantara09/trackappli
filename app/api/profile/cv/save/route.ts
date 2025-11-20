import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../src/core/auth/middleware';
import { ProfileService } from '../../../../../src/services/profile.service';
import { createErrorResponse } from '../../../../../src/utils/errors';
import { CVExtraction } from '../../../../../src/types/ai.types';

export async function POST(request: NextRequest) {
  try {
    const { userId, supabase } = await requireAuth();
    const body = await request.json();
    const cvData = body as CVExtraction;

    const profileService = new ProfileService(supabase);
    const result = await profileService.saveExtractedCVData(userId, cvData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
