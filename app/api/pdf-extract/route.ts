
import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '../../../src/core/pdf/extractor';

/**
 * POST /api/pdf-extract
 * Extract text from PDF using shared extractor (pdf2json)
 */
export async function POST(request: NextRequest) {
  try {
    // Check content type to handle both JSON and multipart
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          {
            success: false,
            error: 'No file provided in multipart form data',
          },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // Handle JSON with base64
      const body = await request.json();
      const pdfBase64 = body.pdf;

      if (!pdfBase64 || typeof pdfBase64 !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request: pdf field must be a base64 encoded string',
          },
          { status: 400 }
        );
      }

      buffer = Buffer.from(pdfBase64, 'base64');
    }

    // Extract text using shared extractor
    const text = await extractTextFromPDF(buffer);

    return NextResponse.json({
      success: true,
      text: text,
      library: 'pdfjs-dist',
      pages: 0, // pdfjs-dist v3 legacy build page count might need adjustment if needed
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
