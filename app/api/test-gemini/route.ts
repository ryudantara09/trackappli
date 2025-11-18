import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not set' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to get a model to verify API key works
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Simple test prompt
    const result = await model.generateContent('Say "API is working" if you can read this.');
    const response = result.response;
    const text = response.text();
    
    return NextResponse.json({
      success: true,
      message: 'Gemini API is configured correctly',
      testResponse: text,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      details: error,
    }, { status: 500 });
  }
}
