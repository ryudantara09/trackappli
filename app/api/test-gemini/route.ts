import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not set' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list models
    const models = await genAI.listModels();
    
    return NextResponse.json({
      success: true,
      models: models.map(m => ({
        name: m.name,
        displayName: m.displayName,
        supportedGenerationMethods: m.supportedGenerationMethods,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      details: error,
    }, { status: 500 });
  }
}
