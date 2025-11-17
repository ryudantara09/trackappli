/**
 * PDF Text Extraction Module
 * 
 * Provides functionality to extract text from PDF files by calling
 * the Python serverless function endpoint.
 */

/**
 * Response from the PDF extraction endpoint
 */
interface PDFExtractionResponse {
  success: boolean;
  text?: string;
  library?: string;
  error?: string;
}

/**
 * Configuration for PDF extraction
 */
interface PDFExtractionConfig {
  endpoint?: string;
  timeout?: number;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<PDFExtractionConfig> = {
  endpoint: process.env.PDF_EXTRACT_ENDPOINT || '/api/pdf-extract',
  timeout: 30000, // 30 seconds
};

/**
 * Extract text from a PDF buffer
 * 
 * @param pdfBuffer - The PDF file as a Buffer or Uint8Array
 * @param config - Optional configuration overrides
 * @returns Extracted text from the PDF
 * @throws Error if extraction fails
 */
export async function extractTextFromPDF(
  pdfBuffer: Buffer | Uint8Array,
  config: PDFExtractionConfig = {}
): Promise<string> {
  const { endpoint, timeout } = { ...DEFAULT_CONFIG, ...config };

  // Convert buffer to base64
  const base64PDF = bufferToBase64(pdfBuffer);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Determine the full URL
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${getBaseUrl()}${endpoint}`;

    // Call the Python serverless function
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdf: base64PDF }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const data: PDFExtractionResponse = await response.json();

    // Handle error responses
    if (!response.ok || !data.success) {
      throw new Error(
        data.error || `PDF extraction failed with status ${response.status}`
      );
    }

    // Validate extracted text
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF');
    }

    return data.text;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(
          `PDF extraction timed out after ${timeout}ms. The PDF may be too large or complex.`
        );
      }
      
      // Re-throw with context
      throw new Error(`PDF extraction failed: ${error.message}`);
    }

    throw new Error('PDF extraction failed with unknown error');
  }
}

/**
 * Convert buffer to base64 string
 * 
 * @param buffer - Buffer or Uint8Array to convert
 * @returns Base64 encoded string
 */
function bufferToBase64(buffer: Buffer | Uint8Array): string {
  if (Buffer.isBuffer(buffer)) {
    return buffer.toString('base64');
  }
  
  // Convert Uint8Array to Buffer first
  return Buffer.from(buffer).toString('base64');
}

/**
 * Get the base URL for API calls
 * 
 * @returns Base URL for the application
 */
function getBaseUrl(): string {
  // In production (Vercel), use the deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT || 3000}`;
  }

  // Fallback to relative URL (will use current domain)
  return '';
}

/**
 * Validate if a buffer appears to be a valid PDF
 * 
 * @param buffer - Buffer to validate
 * @returns True if buffer starts with PDF magic bytes
 */
export function isPDF(buffer: Buffer | Uint8Array): boolean {
  // PDF files start with "%PDF-" (0x25 0x50 0x44 0x46 0x2D)
  const pdfMagicBytes = [0x25, 0x50, 0x44, 0x46, 0x2D];
  
  if (buffer.length < pdfMagicBytes.length) {
    return false;
  }

  for (let i = 0; i < pdfMagicBytes.length; i++) {
    if (buffer[i] !== pdfMagicBytes[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Extract text from a PDF file with validation
 * 
 * @param pdfBuffer - The PDF file as a Buffer or Uint8Array
 * @param config - Optional configuration overrides
 * @returns Extracted text from the PDF
 * @throws Error if the buffer is not a valid PDF or extraction fails
 */
export async function extractTextFromPDFWithValidation(
  pdfBuffer: Buffer | Uint8Array,
  config: PDFExtractionConfig = {}
): Promise<string> {
  // Validate PDF format
  if (!isPDF(pdfBuffer)) {
    throw new Error('Invalid PDF file: File does not appear to be a PDF');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (pdfBuffer.length > maxSize) {
    throw new Error(
      `PDF file too large: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)}MB (max ${maxSize / 1024 / 1024}MB)`
    );
  }

  return extractTextFromPDF(pdfBuffer, config);
}
