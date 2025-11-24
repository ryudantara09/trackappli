# Past Issues & Solutions

## Issue #1: PDF Extraction Failing on Vercel Deployment

**Date:** November 24, 2025  
**Status:** ✅ RESOLVED

### Problem Description

CV upload feature worked perfectly on localhost but failed on Vercel deployment with error:
```json
{
  "error": "Failed to extract text from PDF: PDF extraction failed: Unexpected token '<', \"<!doctype \"... is not valid JSON",
  "code": "VALIDATION_ERROR"
}
```

### Request Flow
```
Browser → POST /api/profile/cv 
  → extractTextFromPDFWithValidation()
  → fetch('/api/pdf-extract')          ❌ FAILED HERE
  → fetch(PYTHON_SERVICE_URL)
  → /api/python-extract (Python function)
```

### Root Cause

**Server-side relative URL resolution fails on Vercel.**

When one API route calls another using a relative URL (e.g., `/api/pdf-extract`), Vercel's serverless environment cannot resolve it correctly. This causes:
- Connection failures
- Wrong routing
- HTML error pages returned instead of JSON

### Key Diagnostic Findings

| Test Method | Result | What It Means |
|------------|--------|---------------|
| Direct curl to Python function | ✅ Works | Python handler is correct |
| Bruno/Postman to `/api/pdf-extract` | ✅ Works | Endpoint is correct |
| Browser to `/api/profile/cv` (localhost) | ✅ Works | Code logic is correct |
| Browser to `/api/profile/cv` (Vercel) | ❌ Fails | URL resolution issue |

**Pattern:** External requests work, internal server-to-server calls fail = **URL resolution problem**

### Solution

Changed `getBaseUrl()` function in `src/core/pdf/extractor.ts` to return absolute production URL:

**Before (WRONG):**
```typescript
function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;  // ❌ Unreliable
  }
  return '';  // ❌ Relative URLs fail on Vercel
}
```

**After (CORRECT):**
```typescript
function getBaseUrl(): string {
  if (process.env.VERCEL) {
    return 'https://www.trakapp.li';  // ✅ Absolute production URL
  }
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT || 3000}`;
  }
  return '';
}
```

### What NOT To Do

❌ **Don't assume Python handler format is wrong**
- `BaseHTTPRequestHandler` class works fine on Vercel
- Both `def handler(event, context)` and `class handler(BaseHTTPRequestHandler)` can work
- If direct curl works, the handler is correct

❌ **Don't focus on the wrong layer**
- If `/api/python-extract` works externally, the Python function is fine
- If `/api/pdf-extract` works in Bruno, the proxy is fine
- If only internal calls fail → focus on **how they're being called**, not what they're calling

❌ **Don't use relative URLs for server-to-server calls on Vercel**
- Relative URLs (`/api/...`) don't resolve correctly
- `VERCEL_URL` environment variable can be unreliable
- Always use hardcoded absolute production URLs

❌ **Don't change code without diagnosing first**
- Test each layer independently
- Identify exactly where it fails
- Only fix what's broken

### What TO Do

✅ **Test endpoints individually:**
```bash
# Test Python function directly
curl -X POST https://www.trakapp.li/api/python-extract \
  -H "Content-Type: application/json" \
  -d '{"pdf":"base64..."}'

# Test proxy in Bruno/Postman
POST https://www.trakapp.li/api/pdf-extract

# Test full flow in browser
Upload CV through UI
```

✅ **Identify the pattern:**
- Works externally + fails internally = URL resolution
- Always fails = handler/endpoint problem
- Works on localhost only = environment difference

✅ **Use absolute URLs on Vercel:**
```typescript
// For production deployments
const url = process.env.VERCEL 
  ? 'https://www.trakapp.li/api/endpoint'
  : '/api/endpoint';
```

✅ **Check Vercel logs:**
```bash
# View logs for specific deployment
vercel logs [deployment-url]
```

### Quick Diagnostic Checklist

When API calls fail on Vercel:

1. **Does direct curl to the endpoint work?**
   - ✅ Yes → Endpoint is deployed correctly
   - ❌ No → Check handler format, deployment config

2. **Does it work in Bruno/Postman?**
   - ✅ Yes → External access works
   - ❌ No → Check CORS, authentication, endpoint path

3. **Does it work on localhost?**
   - ✅ Yes → Code logic is correct
   - ❌ No → Fix the code first

4. **Pattern: External ✅ but Internal ❌?**
   - → **URL resolution problem**
   - → Use absolute URLs for server-side calls
   - → Check `getBaseUrl()` or similar functions

5. **Pattern: Everything ❌?**
   - → Check handler format
   - → Check vercel.json configuration
   - → Check dependencies (requirements.txt)

### Related Files Changed

- `src/core/pdf/extractor.ts` - Fixed getBaseUrl() to use absolute URL
- `app/api/pdf-extract/route.ts` - Added multipart form support (separate fix)

### Prevention

- Always use absolute URLs for server-to-server calls on Vercel
- Test each API layer independently
- Use Bruno/Postman to verify external access works
- Check if issue is environment-specific (localhost vs production)

### Similar Issues to Watch For

- Any server-side `fetch()` calls using relative URLs
- API routes calling other API routes within the same app
- Middleware or edge functions making internal API calls

### Key Takeaway

**On Vercel serverless: Server-to-server calls MUST use absolute URLs. Relative URLs don't work.**
