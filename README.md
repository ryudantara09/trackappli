# Job Application Tracker - Backend

Modern, scalable backend API for tracking job applications with AI-powered data extraction.

## Tech Stack

- **Framework**: Next.js 15.5 with App Router
- **Runtime**: Node.js 18+ on Vercel serverless functions
- **Database**: PostgreSQL via Supabase with Row Level Security (RLS)
- **Authentication**: Supabase Auth with OAuth providers (Google, LinkedIn)
- **AI Service**: Google Gemini 1.5 Flash API
- **File Processing**: Python serverless function for PDF extraction
- **Deployment**: Vercel
- **Language**: TypeScript

## Project Structure

```
trackappli/
├── app/
│   └── api/                           # Next.js API routes
│       ├── applications/              # Application CRUD
│       ├── profile/                   # Profile management
│       ├── extract/                   # AI extraction
│       └── export/                    # CSV export
├── src/
│   ├── core/
│   │   ├── auth/                      # Authentication
│   │   ├── database/                  # Database client
│   │   ├── ai/                        # AI extraction
│   │   └── pdf/                       # PDF processing
│   ├── services/                      # Business logic
│   ├── repositories/                  # Data access
│   ├── types/                         # TypeScript types
│   ├── utils/                         # Utilities
│   └── config/                        # Configuration
├── supabase/
│   └── migrations/                    # Database migrations
└── api/
    └── pdf-extract/                   # Python serverless function
```

## Setup

### Prerequisites

- Node.js 18+
- Supabase account
- Google Gemini API key
- Vercel account (for deployment)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment template:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
   - Get Supabase credentials from https://app.supabase.com
   - Get Gemini API key from https://aistudio.google.com/app/apikey

4. Set up database (see [SETUP_DATABASE.md](SETUP_DATABASE.md) for detailed instructions):
```bash
npx supabase link --project-ref [YOUR-PROJECT-REF]
npx supabase db push
npm run supabase:gen-types
```

5. Start development server:
```bash
npm run dev
```

## API Endpoints

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Create application
- `GET /api/applications/[id]` - Get application
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application

### Profile
- `GET /api/profile` - Get complete profile
- `POST /api/profile/cv` - Upload and extract CV
- CRUD endpoints for experience, education, skills

### Extraction
- `POST /api/extract` - Extract job posting details

### Export
- `GET /api/export` - Export applications as CSV

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run type-check   # Check TypeScript types
npm run lint         # Run ESLint
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

- [Database Setup Guide](SETUP_DATABASE.md) - Step-by-step database configuration
- [Design Document](.kiro/specs/backend-redesign/design.md)
- [Requirements](.kiro/specs/backend-redesign/requirements.md)
- [Tasks](.kiro/specs/backend-redesign/tasks.md)

## License

Private - All Rights Reserved
