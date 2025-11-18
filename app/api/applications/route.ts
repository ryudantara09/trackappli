import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../src/core/auth/supabase';
import { ApplicationsService } from '../../../src/services/applications.service';
import { createErrorResponse } from '../../../src/utils/errors';
import { validateQueryParams, getApplicationsQuerySchema, createApplicationSchema, validateRequestBody } from '../../../src/utils/validation';
import { EXTENSION_HEADER } from '../../../src/config/constants';

/**
 * GET /api/applications
 * List user's applications with optional search and filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize service with authenticated Supabase client
    const applicationsService = new ApplicationsService(supabase);

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const { q, status, limit, offset } = validateQueryParams(
      searchParams,
      getApplicationsQuerySchema
    );

    // Get applications with search and filtering
    const applications = await applicationsService.getApplications(userId, {
      query: q,
      status,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * POST /api/applications
 * Create a new application with optional AI extraction
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user - this returns both user and a properly authenticated supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize service with authenticated Supabase client
    const applicationsService = new ApplicationsService(supabase);

    // Validate request body
    const body = await validateRequestBody(request, createApplicationSchema);

    // Check if request is from Chrome extension
    const isFromExtension = request.headers.get(EXTENSION_HEADER) !== null;

    // Create application
    const result = await applicationsService.createApplication({
      userId,
      ...body,
      isFromExtension,
    });

    return NextResponse.json({
      success: true,
      data: result.application,
      extractedData: result.extractedData,
    }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
