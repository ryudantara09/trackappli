import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../../src/core/auth/supabase';
import { ProfileService } from '../../../../src/services/profile.service';
import { SkillsRepository } from '../../../../src/repositories/skills.repository';
import { createErrorResponse } from '../../../../src/utils/errors';
import { validateRequestBody, createTechnicalSkillSchema } from '../../../../src/utils/validation';

/**
 * GET /api/profile/skills
 * List all technical skills for the authenticated user
 */
export async function GET() {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize repository
    const skillsRepo = new SkillsRepository(supabase);

    // Get all skills
    const skills = await skillsRepo.findByUserId(userId);

    return NextResponse.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * POST /api/profile/skills
 * Create a new technical skill entry
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Validate request body
    const body = await validateRequestBody(request, createTechnicalSkillSchema);

    // Initialize service for validation
    const profileService = new ProfileService(supabase);
    
    // Validate skill data
    const skillData = {
      user_id: userId,
      proficiency: 'BEGINNER' as const, // Default proficiency
      ...body,
    };
    profileService.validateTechnicalSkill(skillData);

    // Initialize repository
    const skillsRepo = new SkillsRepository(supabase);

    // Create skill
    const skill = await skillsRepo.create(skillData);

    return NextResponse.json({
      success: true,
      data: skill,
    }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
