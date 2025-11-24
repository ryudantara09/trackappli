import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/pdf-extract
 * Extract text from PDF by calling the Python microservice
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdf } = body;

    if (!pdf || typeof pdf !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: pdf field must be a base64 encoded string',
        },
        { status: 400 }
      );
    }

    // Call Python microservice
    // Automatically detect environment:
    // 1. Use explicit env var if set
    // 2. In development, use local Python server
    // 3. In production, use the current origin to call the Vercel function
    let pythonServiceUrl = process.env.PYTHON_SERVICE_URL;
    
    if (!pythonServiceUrl) {
      if (process.env.NODE_ENV === 'development') {
        pythonServiceUrl = 'http://localhost:5001/extract';
      } else {
        // Production / Preview
        // Use the origin of the request to construct the URL
        // This ensures we are calling the function on the same deployment
        pythonServiceUrl = `${request.nextUrl.origin}/api/py-pdf-extract`;
      }
    }

    console.log(`Attempting to call Python service at: ${pythonServiceUrl}`);
    const result = await callPythonService(pythonServiceUrl, body);

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
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Python service returned status ${response.status}`);
      } else {
        const text = await response.text();
        // Truncate text to avoid huge error messages
        const preview = text.slice(0, 200);
        throw new Error(
          `Python service at ${serviceUrl} failed with status ${response.status}. Response: ${preview}...`
        );
      }
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('fetch failed')) {
      throw new Error(
        'Python microservice is not running. Start it with: cd api/py-pdf-extract && python server.py'
      );
    }
    throw error;
  }
}
