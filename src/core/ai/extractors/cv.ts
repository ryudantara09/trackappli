/**
 * CV/Resume Extractor
 * 
 * Extracts structured professional profile data from CV/resume text using Gemini AI.
 */

import { generateContent } from '../gemini';
import { createCVPrompt } from '../prompts/cv';
import {
  CVExtraction,
  CVPersonalInfo,
  CVWorkExperience,
  CVEducation,
  CVTechnicalSkill,
  ExtractionResult
} from '../../../types/ai.types';

/**
 * Validate and clean personal info
 */
function cleanPersonalInfo(raw: any): CVPersonalInfo | undefined {
  if (!raw) return undefined;

  const cleaned: CVPersonalInfo = {};

  if (raw.name && typeof raw.name === 'string') {
    cleaned.name = raw.name.trim();
  }
  if (raw.email && typeof raw.email === 'string') {
    cleaned.email = raw.email.trim();
  }
  if (raw.phone && typeof raw.phone === 'string') {
    cleaned.phone = raw.phone.trim();
  }
  if (raw.location && typeof raw.location === 'string') {
    cleaned.location = raw.location.trim();
  }

  // Return undefined if no fields were extracted
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

/**
 * Validate and clean work experience entry
 */
function cleanWorkExperience(raw: any): CVWorkExperience | null {
  if (!raw || !raw.company || !raw.position || !raw.start_date) {
    return null;
  }

  return {
    company: raw.company.trim(),
    position: raw.position.trim(),
    location: raw.location ? raw.location.trim() : undefined,
    start_date: raw.start_date.trim(),
    end_date: raw.end_date ? raw.end_date.trim() : undefined,
    current: Boolean(raw.current),
    description: raw.description ? raw.description.trim() : undefined,
    technologies: Array.isArray(raw.technologies)
      ? raw.technologies.filter((t: any) => typeof t === 'string' && t.trim()).map((t: string) => t.trim())
      : [],
  };
}

/**
 * Validate and clean education entry
 */
function cleanEducation(raw: any): CVEducation | null {
  if (!raw || !raw.institution || !raw.degree || !raw.start_date) {
    return null;
  }

  return {
    institution: raw.institution.trim(),
    degree: raw.degree.trim(),
    field_of_study: raw.field_of_study ? raw.field_of_study.trim() : undefined,
    start_date: raw.start_date.trim(),
    end_date: raw.end_date ? raw.end_date.trim() : undefined,
    current: Boolean(raw.current),
  };
}

/**
 * Validate and clean technical skill entry
 */
function cleanTechnicalSkill(raw: any): CVTechnicalSkill | null {
  if (!raw || !raw.category || !raw.name) {
    return null;
  }

  return {
    category: raw.category.trim(),
    name: raw.name.trim(),
    proficiency: raw.proficiency ? raw.proficiency.trim() : undefined,
  };
}

/**
 * Clean and validate extracted CV data
 */
function cleanCVExtraction(raw: any): CVExtraction {
  const cleaned: CVExtraction = {};

  // Clean personal info
  if (raw.personal_info) {
    cleaned.personal_info = cleanPersonalInfo(raw.personal_info);
  }

  // Clean work experience
  if (Array.isArray(raw.work_experience)) {
    const experiences = raw.work_experience
      .map((exp: any) => cleanWorkExperience(exp))
      .filter((exp: CVWorkExperience | null): exp is CVWorkExperience => exp !== null);

    if (experiences.length > 0) {
      cleaned.work_experience = experiences;
    }
  }

  // Clean education
  if (Array.isArray(raw.education)) {
    const education = raw.education
      .map((edu: any) => cleanEducation(edu))
      .filter((edu: CVEducation | null): edu is CVEducation => edu !== null);

    if (education.length > 0) {
      cleaned.education = education;
    }
  }

  // Clean technical skills
  if (Array.isArray(raw.technical_skills)) {
    const skills = raw.technical_skills
      .map((skill: any) => cleanTechnicalSkill(skill))
      .filter((skill: CVTechnicalSkill | null): skill is CVTechnicalSkill => skill !== null);

    if (skills.length > 0) {
      cleaned.technical_skills = skills;
    }
  }

  return cleaned;
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
 * Extract CV/resume information from text
 * 
 * @param cvText - The raw CV/resume text (extracted from PDF or provided directly)
 * @returns Extraction result with structured profile data
 */
export async function extractCV(cvText: string): Promise<ExtractionResult<CVExtraction>> {
  try {
    // Validate input
    if (!cvText || cvText.trim().length === 0) {
      return {
        success: false,
        error: 'CV text is empty',
      };
    }

    // Check minimum length (CVs should have substantial content)
    if (cvText.trim().length < 100) {
      return {
        success: false,
        error: 'CV text is too short to extract meaningful information',
      };
    }

    // Generate prompt
    const prompt = createCVPrompt({ cvText });

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
    const cleanedData = cleanCVExtraction(parsedData);

    // Check if we got any useful data
    const hasData =
      cleanedData.personal_info ||
      (cleanedData.work_experience && cleanedData.work_experience.length > 0) ||
      (cleanedData.education && cleanedData.education.length > 0) ||
      (cleanedData.technical_skills && cleanedData.technical_skills.length > 0);

    if (!hasData) {
      return {
        success: false,
        error: 'No profile information could be extracted from the CV',
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
    console.error('CV extraction error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown extraction error',
    };
  }
}

import { generateOpenRouterContent } from '../openrouter';

/**
 * Extract CV/resume information from text using OpenRouter (free model)
 * 
 * @param cvText - Extracted text from CV
 * @returns Extraction result with structured profile data
 */
export async function extractCVFromText(cvText: string): Promise<ExtractionResult<CVExtraction>> {
  try {
    if (!cvText || cvText.trim().length === 0) {
      return {
        success: false,
        error: 'No text provided for extraction',
      };
    }

    // Construct the prompt for the AI
    const prompt = `You are an expert CV/Resume parser. Extract structured information from this CV text.

CV TEXT:
${cvText}

Extract the following in strict JSON format:
{
  "personal_info": {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "location": "string"
  },
  "work_experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "start_date": "YYYY-MM-DD or YYYY-MM",
      "end_date": "YYYY-MM-DD or YYYY-MM",
      "current": boolean,
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field_of_study": "string",
      "start_date": "YYYY-MM-DD or YYYY-MM",
      "end_date": "YYYY-MM-DD or YYYY-MM",
      "current": boolean
    }
  ],
  "technical_skills": [
    {
      "category": "string",
      "name": "string",
      "proficiency": "string"
    }
  ]
}

Return ONLY the JSON object, no markdown formatting.`;

    // Prepare messages for OpenRouter
    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ] as any;

    // Call OpenRouter API with a free text model
    const responseText = await generateOpenRouterContent(messages, 'meta-llama/llama-3.3-70b-instruct:free');

    // Parse JSON response
    let parsedData: any;
    try {
      parsedData = parseGeminiResponse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenRouter response:', responseText);
      return {
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse: responseText,
      };
    }

    // Clean and validate extracted data
    const cleanedData = cleanCVExtraction(parsedData);

    return {
      success: true,
      data: cleanedData,
      rawResponse: responseText,
    };

  } catch (error) {
    console.error('CV text extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown extraction error',
    };
  }
}

/**
 * Extract CV with fallback to partial data
 * 
 * This version returns partial data even if extraction is incomplete,
 * which can be useful for user-facing applications where some data is better than none.
 * 
 * @param cvText - The raw CV/resume text
 * @returns Extraction result, always with data (even if empty)
 */
export async function extractCVWithFallback(cvText: string): Promise<ExtractionResult<CVExtraction>> {
  const result = await extractCV(cvText);

  // If extraction failed but we have partial data, mark as success
  if (!result.success && result.data) {
    const hasAnyData =
      result.data.personal_info ||
      (result.data.work_experience && result.data.work_experience.length > 0) ||
      (result.data.education && result.data.education.length > 0) ||
      (result.data.technical_skills && result.data.technical_skills.length > 0);

    if (hasAnyData) {
      return {
        ...result,
        success: true,
        error: undefined,
      };
    }
  }

  // If no data at all, return empty structure
  if (!result.data) {
    return {
      success: true,
      data: {},
    };
  }

  return result;
}
