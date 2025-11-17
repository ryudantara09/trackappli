# TrackAppli API - Bruno Collection

This Bruno collection contains all API endpoints for testing the TrackAppli application.

## Setup

1. Open Bruno
2. Click "Open Collection"
3. Navigate to this `bruno` folder and select it
4. Choose an environment (Local or Production)

## Environments

### Local
- Base URL: `http://localhost:3000`
- Use this for testing during development
- Make sure your dev server is running: `npm run dev`

### Production
- Base URL: `https://your-app.vercel.app`
- Update the URL in `environments/Production.bru` with your actual Vercel URL
- Use this for testing deployed application

## Collection Structure

### Health
- Health Check - Verify API is running

### Applications
- Get All Applications
- Create Application
- Get Application by ID
- Update Application
- Delete Application

### Profile
- Get Profile
- Update Profile

#### Skills
- Get All Skills
- Create Skill
- Update Skill
- Delete Skill

#### Experience
- Get All Experience
- Create Experience
- Update Experience
- Delete Experience

#### Education
- Get All Education
- Create Education
- Update Education
- Delete Education

### AI Extraction
- Extract CV Data - Parse resume text with AI
- Extract Job Posting - Parse job description with AI

### PDF
- Extract PDF Text - Extract text from PDF files (Python endpoint)

### Export
- Export as CSV - Export applications to CSV
- Export as JSON - Export applications to JSON

## Testing Workflow

1. Start with **Health Check** to verify the API is running
2. Create test data using **Create** endpoints
3. Verify with **Get All** endpoints
4. Test **Update** and **Delete** operations
5. Test AI extraction features
6. Test export functionality

## Notes

- Replace `:id` path parameters with actual IDs from your database
- For PDF extraction, select a PDF file in the multipart form body
- AI endpoints require `GOOGLE_GEMINI_API` environment variable to be set
- Some endpoints may require authentication (to be implemented)

## Tips

- Use Bruno's environment variables to switch between local and production
- Save responses to use IDs in subsequent requests
- Use the "Run Collection" feature to test all endpoints at once
- Check the "Tests" tab in each request for validation scripts (coming soon)
