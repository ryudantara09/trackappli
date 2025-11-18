import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../src/core/auth/middleware';
import { createRouteHandlerClient } from '../../../src/core/auth/supabase';
import { ExportService } from '../../../src/services/export.service';
import { createErrorResponse } from '../../../src/utils/errors';
import { createCSVHeaders } from '../../../src/utils/csv';

/**
 * GET /api/export
 * Export user's applications to CSV format
 * 
 * Query Parameters:
 * - status: Filter by application status (optional)
 * - includeNotes: Include notes column (default: true)
 * - includeDescription: Include description column (default: true)
 * 
 * @example
 * GET /api/export
 * GET /api/export?status=APPLIED
 * GET /api/export?includeNotes=false&includeDescription=false
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user and get authenticated Supabase client
    const { userId, supabase } = await requireAuth();

    // Initialize export service
    const exportService = new ExportService(supabase);

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const includeNotes = searchParams.get('includeNotes') !== 'false';
    const includeDescription = searchParams.get('includeDescription') !== 'false';

    // Generate CSV
    const csvStream = await exportService.generateApplicationsCSVStream(userId, {
      status,
      includeNotes,
      includeDescription,
    });

    // Get filename with timestamp
    const filename = exportService.getExportFilename('applications', 'csv');

    // Create response with CSV headers
    const headers = createCSVHeaders(filename);

    // Return streaming response
    return new NextResponse(csvStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
