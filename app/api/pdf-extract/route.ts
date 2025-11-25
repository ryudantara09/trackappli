import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/pdf-extract
 * Extract text from PDF by calling the Python microservice
 */
export async function POST(request: NextRequest) {
  try {
    // Check content type to handle both JSON and multipart
    const contentType = request.headers.get('content-type') || '';
    let pdfBase64: string;

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

      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      pdfBase64 = buffer.toString('base64');
    } else {
      // Handle JSON with base64
      const body = await request.json();
      pdfBase64 = body.pdf;

      if (!pdfBase64 || typeof pdfBase64 !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request: pdf field must be a base64 encoded string',
          },
          { status: 400 }
        );
      }
    }

    // Call Python microservice
    // On Vercel: call /api/python-extract directly
    // On localhost: call Flask server at http://localhost:5001/extract
    let defaultUrl = 'http://localhost:5001/extract';
    if (process.env.NODE_ENV === 'production') {
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.trakapp.li';
      defaultUrl = `${baseUrl}/api/python-extract`;
    }
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || defaultUrl;
    const result = await callPythonService(pythonServiceUrl, { pdf: pdfBase64 });

    return NextResponse.json(result);
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

/**
 * Call the Python microservice and return the result
 */
async function callPythonService(serviceUrl: string, data: any): Promise<any> {
  try {
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Python service returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('fetch failed')) {
      throw new Error(
        'Python microservice is not running. Start it with: cd python-api/python-extract && python server.py'
      );
    }
    throw error;
  }
}
