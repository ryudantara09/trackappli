import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../../../src/core/auth/supabase';
import { ProfileService } from '../../../../../src/services/profile.service';
import { SkillsRepository } from '../../../../../src/repositories/skills.repository';
import { createErrorResponse, NotFoundError } from '../../../../../src/utils/errors';
import { validateRequestBody, updateTechnicalSkillSchema } from '../../../../../src/utils/validation';

/**
 * GET /api/profile/skills/[id]
 * Get a single technical skill by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Initialize repository
    const skillsRepo = new SkillsRepository(supabase);

    // Await params
    const { id } = await params;

    // Get skill (RLS ensures user can only access their own)
    const skill = await skillsRepo.findById(id);

    if (!skill) {
      throw new NotFoundError('Technical skill');
    }

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * PUT /api/profile/skills/[id]
 * Update a technical skill entry
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Validate request body
    const body = await validateRequestBody(request, updateTechnicalSkillSchema);

    // Initialize repository
    const skillsRepo = new SkillsRepository(supabase);

    // Await params
    const { id } = await params;

    // Update skill (RLS ensures user can only update their own)
    const skill = await skillsRepo.update(id, body);

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/profile/skills/[id]
 * Delete a technical skill entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { supabase } = await requireAuth();

    // Initialize repository
    const skillsRepo = new SkillsRepository(supabase);

    // Await params
    const { id } = await params;

    // Delete skill (RLS ensures user can only delete their own)
    await skillsRepo.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Technical skill deleted successfully',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
