import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../src/core/auth/middleware';
import { extractTextFromPDFWithValidation } from '../../../../src/core/pdf/extractor';
import { extractCV } from '../../../../src/core/ai/extractors/cv';
import { createErrorResponse, ValidationError } from '../../../../src/utils/errors';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../../../../src/config/constants';

/**
 * POST /api/profile/cv
 * Upload and extract CV data from PDF file
 * Returns extracted data for frontend to save
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    await requireAuth();

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('cv') as File | null;

    // Validate file presence
    if (!file) {
      throw new ValidationError('No CV file provided. Please upload a PDF file.');
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new ValidationError(
        `Invalid file type: ${file.type}. Only PDF files are allowed.`
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError(
        `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    let extractedText: string;
    try {
      extractedText = await extractTextFromPDFWithValidation(buffer);
    } catch (error) {
      throw new ValidationError(
        `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    // Extract structured CV data using AI
    const extractionResult = await extractCV(extractedText);

    // Check if extraction was successful
    if (!extractionResult.success) {
      throw new ValidationError(
        extractionResult.error || 'Failed to extract CV data. Please ensure the PDF contains readable text.'
      );
    }

    // Return extracted data for frontend to save
    return NextResponse.json({
      success: true,
      data: extractionResult.data,
      message: 'CV data extracted successfully. Review and save the information.',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
