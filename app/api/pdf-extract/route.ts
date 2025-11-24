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
    // On Vercel: call /api/python-extract directly
    // On localhost: call Flask server at http://localhost:5001/extract
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001/extract';
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
      const errorData = await response.json();
      throw new Error(errorData.error || `Python service returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('fetch failed')) {
      throw new Error(
        'Python microservice is not running. Start it with: cd api/pdf-extract && python server.py'
      );
    }
    throw error;
  }
}
