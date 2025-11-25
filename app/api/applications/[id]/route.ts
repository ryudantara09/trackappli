import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/core/auth/middleware';
import { createRouteHandlerClient } from '@/core/auth/supabase';
import { ApplicationsService } from '@/services/applications.service';
import { createErrorResponse, ValidationError } from '@/utils/errors';
import { updateApplicationSchema, validateRequestBody } from '@/utils/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * GET /api/applications/[id]
 * Get a single application by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize service with authenticated Supabase client
    const applicationsService = new ApplicationsService(supabase);

    // Parse application ID
    const { id } = await params;
    const applicationId = parseInt(id, 10);
    
    if (isNaN(applicationId)) {
      throw new ValidationError('Invalid application ID');
    }

    // Get application (ownership verified by service via RLS)
    const application = await applicationsService.getApplicationById(applicationId, userId);

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * PUT /api/applications/[id]
 * Update an application
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize service with authenticated Supabase client
    const applicationsService = new ApplicationsService(supabase);

    // Parse application ID
    const { id } = await params;
    const applicationId = parseInt(id, 10);
    
    if (isNaN(applicationId)) {
      throw new ValidationError('Invalid application ID');
    }

    // Validate request body
    const body = await validateRequestBody(request, updateApplicationSchema);

    // Update application (ownership verified by service via RLS)
    const application = await applicationsService.updateApplication(
      applicationId,
      userId,
      body
    );

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/applications/[id]
 * Delete an application
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize service with authenticated Supabase client
    const applicationsService = new ApplicationsService(supabase);

    // Parse application ID
    const { id } = await params;
    const applicationId = parseInt(id, 10);
    
    if (isNaN(applicationId)) {
      throw new ValidationError('Invalid application ID');
    }

    // Delete application (ownership verified by service via RLS)
    await applicationsService.deleteApplication(applicationId, userId);

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
