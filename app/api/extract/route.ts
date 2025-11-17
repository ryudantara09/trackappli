import { NextRequest, NextResponse } from 'next/server';
import { extractJobPosting } from '../../../src/core/ai/extractors/job-posting';
import { createErrorResponse, ValidationError, ExternalServiceError, logError } from '../../../src/utils/errors';
import { validateRequestBody, jobExtractionSchema } from '../../../src/utils/validation';

/**
 * POST /api/extract
 * Extract job posting details from raw text using AI
 * 
 * This endpoint does not require authentication as it's a utility endpoint
 * that can be used before creating an application.
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const { rawText } = await validateRequestBody(request, jobExtractionSchema);

    // Validate rawText is not empty
    if (!rawText || rawText.trim().length === 0) {
      throw new ValidationError('Raw text cannot be empty');
    }

    // Call job posting extractor
    const extractionResult = await extractJobPosting(rawText);

    // Handle extraction failures
    if (!extractionResult.success) {
      logError('Job extraction failed', extractionResult.error, {
        textLength: rawText.length,
        hasRawResponse: !!extractionResult.rawResponse,
      });

      throw new ExternalServiceError(
        'AI Extraction',
        extractionResult.error || 'Failed to extract job details'
      );
    }

    // Return extracted job details
    return NextResponse.json({
      success: true,
      data: extractionResult.data,
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}
