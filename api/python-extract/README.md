# PDF Text Extraction Serverless Function

This Python serverless function extracts text from PDF files using pdfplumber (preferred) or PyPDF2 (fallback).

## Endpoint

`POST /api/pdf-extract`

## Request Format

```json
{
  "pdf": "base64_encoded_pdf_content"
}
```

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "text": "Extracted text from the PDF...",
  "library": "pdfplumber"
}
```

### Error Response (400/500)

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Error Handling

The function handles the following error cases:

- **Invalid JSON**: Returns 400 with error message
- **Missing 'pdf' field**: Returns 400 with error message
- **Invalid base64 encoding**: Returns 400 with error message
- **Corrupted PDF**: Returns 500 with descriptive error
- **Image-based PDF**: Returns 500 indicating no text could be extracted
- **Empty PDF**: Returns 500 indicating PDF has no pages

## Dependencies

- `pdfplumber==0.11.0` (preferred for better text extraction)
- `PyPDF2==3.0.1` (fallback library)

Dependencies are automatically installed by Vercel during deployment.

## Local Testing

To test locally, you can use curl:

```bash
# Convert a PDF to base64
base64 -i sample.pdf -o sample.b64

# Send request (replace with actual base64 content)
curl -X POST http://localhost:3000/api/pdf-extract \
  -H "Content-Type: application/json" \
  -d '{"pdf":"BASE64_CONTENT_HERE"}'
```

## Deployment

The function is automatically deployed to Vercel as a Python serverless function. Configuration is in `vercel.json`:

```json
{
  "functions": {
    "api/pdf-extract/index.py": {
      "runtime": "python3.11",
      "maxDuration": 30,
      "memory": 512
    }
  }
}
```

## Usage from TypeScript

Use the wrapper function in `src/core/pdf/extractor.ts`:

```typescript
import { extractTextFromPDFWithValidation } from '@/core/pdf';

// Extract text from a PDF buffer
const pdfBuffer = await readFile('path/to/file.pdf');
const text = await extractTextFromPDFWithValidation(pdfBuffer);
console.log(text);
```
