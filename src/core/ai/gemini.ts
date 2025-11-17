/**
 * Gemini AI Client
 * 
 * Provides a configured Gemini API client with retry logic for transient failures.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
let genAI: GoogleGenerativeAI | null = null;

/**
 * Get or initialize the Gemini AI client
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_GEMINI_API;
    
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API environment variable is not set');
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
  }
  
  return genAI;
}

/**
 * Get a Gemini model instance
 * @param modelName - The model to use (default: gemini-2.0-flash-lite)
 */
export function getGeminiModel(modelName: string = 'gemini-2.0-flash-lite') {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
}

/**
 * Retry configuration
 */
interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  initialDelayMs: 1000,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an error is retryable (transient failure)
 */
function isRetryableError(error: any): boolean {
  // Retry on network errors, rate limits, and server errors
  if (error.status) {
    return error.status === 429 || error.status >= 500;
  }
  
  // Retry on network/timeout errors
  const errorMessage = error.message?.toLowerCase() || '';
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('econnreset') ||
    errorMessage.includes('enotfound')
  );
}

/**
 * Execute a Gemini API call with retry logic
 * 
 * @param fn - The async function to execute
 * @param config - Retry configuration
 * @returns The result of the function
 * @throws The last error if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: any;
  let delay = retryConfig.initialDelayMs;
  
  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if this is the last attempt or error is not retryable
      if (attempt === retryConfig.maxRetries || !isRetryableError(error)) {
        break;
      }
      
      // Log retry attempt
      console.warn(
        `Gemini API call failed (attempt ${attempt + 1}/${retryConfig.maxRetries + 1}). ` +
        `Retrying in ${delay}ms...`,
        error
      );
      
      // Wait before retrying
      await sleep(delay);
      
      // Exponential backoff
      delay = Math.min(delay * retryConfig.backoffMultiplier, retryConfig.maxDelayMs);
    }
  }
  
  // All retries failed
  throw lastError;
}

/**
 * Generate content with Gemini with automatic retry
 * 
 * @param prompt - The prompt to send to Gemini
 * @param modelName - The model to use
 * @returns The generated text response
 */
export async function generateContent(
  prompt: string,
  modelName: string = 'gemini-2.0-flash-lite'
): Promise<string> {
  return withRetry(async () => {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  });
}
