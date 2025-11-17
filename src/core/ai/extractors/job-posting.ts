/**
 * Job Posting Extractor
 * 
 * Extracts structured job information from raw job posting text using Gemini AI.
 */

import { generateContent } from '../gemini';
import { createJobPostingPrompt } from '../prompts/job-posting';
import { JobExtraction, ExtractionResult } from '../../../types/ai.types';

/**
 * Clean and normalize location string
 */
function normalizeLocation(location: string | { city?: string; country?: string } | null | undefined): string | undefined {
  if (!location) return undefined;
  
  if (typeof location === 'string') {
    return location.trim();
  }
  
  // Handle object format
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.country) parts.push(location.country);
  return parts.length > 0 ? parts.join(', ') : undefined;
}

/**
 * Clean and validate extracted data
 */
function cleanJobExtraction(raw: any): JobExtraction {
  return {
    position_title: raw.position_title || undefined,
    company: raw.company || undefined,
    location: normalizeLocation(raw.location),
    job_type: raw.job_type || undefined,
    tech_stack: Array.isArray(raw.tech_stack) ? raw.tech_stack.filter(Boolean) : [],
    soft_skills: Array.isArray(raw.soft_skills) ? raw.soft_skills.filter(Boolean) : [],
    description: raw.description || undefined,
    salary_range: raw.salary_range || undefined,
  };
}

/**
 * Parse JSON response from Gemini, handling various formats
 */
function parseGeminiResponse(responseText: string): any {
  // Remove markdown code blocks if present
  let cleaned = responseText.trim();
  
  // Remove ```json and ``` markers
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');
  
  // Try to find JSON object in the response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract job posting information from raw text
 * 
 * @param rawText - The raw job posting text
 * @returns Extraction result with structured job data
 */
export async function extractJobPosting(rawText: string): Promise<ExtractionResult<JobExtraction>> {
  try {
    // Validate input
    if (!rawText || rawText.trim().length === 0) {
      return {
        success: false,
        error: 'Job posting text is empty',
      };
    }
    
    // Generate prompt
    const prompt = createJobPostingPrompt({ rawText });
    
    // Call Gemini API with retry logic
    const responseText = await generateContent(prompt);
    
    // Parse JSON response
    let parsedData: any;
    try {
      parsedData = parseGeminiResponse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText);
      return {
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse: responseText,
      };
    }
    
    // Clean and validate extracted data
    const cleanedData = cleanJobExtraction(parsedData);
    
    // Check if we got any useful data
    const hasData = 
      cleanedData.position_title ||
      cleanedData.company ||
      cleanedData.location ||
      (cleanedData.tech_stack && cleanedData.tech_stack.length > 0);
    
    if (!hasData) {
      return {
        success: false,
        error: 'No job information could be extracted from the text',
        data: cleanedData,
        rawResponse: responseText,
      };
    }
    
    return {
      success: true,
      data: cleanedData,
      rawResponse: responseText,
    };
    
  } catch (error) {
    console.error('Job posting extraction error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown extraction error',
    };
  }
}

/**
 * Extract job posting with fallback to partial data
 * 
 * This version returns partial data even if extraction is incomplete,
 * which can be useful for user-facing applications.
 * 
 * @param rawText - The raw job posting text
 * @returns Extraction result, always with data (even if empty)
 */
export async function extractJobPostingWithFallback(rawText: string): Promise<ExtractionResult<JobExtraction>> {
  const result = await extractJobPosting(rawText);
  
  // If extraction failed but we have partial data, mark as success
  if (!result.success && result.data) {
    return {
      ...result,
      success: true,
      error: undefined,
    };
  }
  
  // If no data at all, return empty structure
  if (!result.data) {
    return {
      success: true,
      data: {
        tech_stack: [],
        soft_skills: [],
      },
    };
  }
  
  return result;
}
