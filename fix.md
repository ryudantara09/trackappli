# Fix Summary

## Problem
Python script at `api/pdf-extract/index.py` wasn't being called. Error: "is not valid JSON" (HTML response instead).

## Root Cause
No Next.js API route existed to call the Python script locally. The Python file only worked as a Vercel serverless function.

## Solution
1. **Created** `app/api/pdf-extract/route.ts` - Next.js endpoint that executes Python script using Node's `child_process`
2. **Modified** `api/pdf-extract/index.py` - Added standalone mode to read from stdin/stdout, keeping Vercel handler intact

## Result
- ✅ Works locally with `npm run dev` (no Vercel CLI needed)
- ✅ Works on any cloud platform or server
- ✅ Still compatible with Vercel deployment
