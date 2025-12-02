/**
 * PDF Text Extraction Module
 * 
 * Provides functionality to extract text from PDF files directly within
 * the Node runtime using the pdf-parse library (no external Python dependency).
 */

/**
 * Configuration for PDF extraction (kept for backwards compatibility)
 */
interface PDFExtractionConfig {
  /** Minimum length (characters) required from the extracted text */
  minLength?: number;
}

const DEFAULT_MIN_LENGTH = 80;

type PdfParseFn = (
  data: Buffer | Uint8Array,
  options?: Record<string, unknown>
) => Promise<{ text?: string | undefined }>;

let cachedPdfParse: PdfParseFn | null = null;

async function getPdfParse(): Promise<PdfParseFn> {
  if (cachedPdfParse) {
    return cachedPdfParse;
  }

  const pdfParseModule = await import('pdf-parse');
  const moduleWithDefault = pdfParseModule as unknown as { default?: PdfParseFn };
  const pdfParse = moduleWithDefault.default ?? (pdfParseModule as unknown as PdfParseFn);
  cachedPdfParse = pdfParse;
  return pdfParse;
}

function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

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
  const minLength = config.minLength ?? DEFAULT_MIN_LENGTH;
  const normalizedBuffer = Buffer.isBuffer(pdfBuffer)
    ? pdfBuffer
    : Buffer.from(pdfBuffer);

  try {
    const pdfParse = await getPdfParse();
    const { text } = await pdfParse(normalizedBuffer);

    if (!text) {
      throw new Error('pdf-parse returned no text');
    }

    const cleaned = normalizeExtractedText(text);

    if (cleaned.length < minLength) {
      throw new Error('Extracted text is too short to be useful');
    }

    return cleaned;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }

    throw new Error('PDF extraction failed with unknown error');
  }
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
