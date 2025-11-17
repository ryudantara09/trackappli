/**
 * AI Extraction Module
 * 
 * Exports all AI extraction functionality for easy importing.
 */

// Gemini client
export {
  getGeminiClient,
  getGeminiModel,
  withRetry,
  generateContent,
} from './gemini';

// Job posting extraction
export {
  extractJobPosting,
  extractJobPostingWithFallback,
} from './extractors/job-posting';

// CV extraction
export {
  extractCV,
  extractCVWithFallback,
} from './extractors/cv';

// Prompts (for testing or customization)
export {
  createJobPostingPrompt,
} from './prompts/job-posting';

export {
  createCVPrompt,
} from './prompts/cv';
