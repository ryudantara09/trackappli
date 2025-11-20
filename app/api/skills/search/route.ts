import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '../../../../src/core/auth/supabase';
import { SkillsRepository } from '../../../../src/repositories/skills.repository';
import { createErrorResponse } from '../../../../src/utils/errors';

/**
 * GET /api/skills/search
 * Search for skills in the master database
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ success: true, data: [] });
    }

    // We don't strictly require auth for searching skills (public read access),
    // but we need a supabase client.
    // Using createRouteHandlerClient will use the user's session if available,
    // or anonymous if configured (but we set RLS to public read).
    const supabase = await createRouteHandlerClient();
    const skillsRepo = new SkillsRepository(supabase);

    const skills = await skillsRepo.search(query);

    return NextResponse.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
