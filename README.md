# Job Application Tracker

A full-stack Next.js application for tracking job applications with AI-powered job posting extraction, profile management, and analytics.

## Tech Stack

- **Framework**: Next.js 15.5 with App Router (React 19)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth (Email/Password + OAuth)
- **AI**: Google Gemini 1.5 Flash for job posting extraction
- **Deployment**: Vercel

## Features

- **Application Tracking**: Create, view, edit, and delete job applications
- **AI Extraction**: Extract job details from posting text using Google Gemini
- **Kanban Board**: Drag-and-drop interface for managing application status
- **List View**: Table view with sorting and filtering
- **Search & Filter**: Search by position, company, location, or skills
- **Profile Management**: Manage work experience, education, and skills
- **CV Upload**: Upload and parse CV with AI extraction
- **File Attachments**: Attach CV and cover letters to applications
- **Export**: Export applications to CSV
- **Dark Mode**: Full dark mode support
- **Analytics**: Dashboard with application statistics
- **Authentication**: Email/password and OAuth (Google, LinkedIn)

## Project Structure

```
trackappli/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # Landing page
│   │   ├── auth/                 # Login/signup
│   │   ├── about/                # About page
│   │   ├── blog/                 # Blog
│   │   ├── help/                 # Help center
│   │   ├── privacy/              # Privacy policy
│   │   └── terms/                # Terms of service
│   ├── (protected)/              # Protected routes (require auth)
│   │   ├── dashboard/            # Main dashboard
│   │   ├── applications/         # Applications list & details
│   │   ├── profile/              # User profile
│   │   ├── settings/             # User settings
│   │   └── analytics/            # Analytics
│   ├── api/                      # API routes
│   │   ├── applications/         # Application CRUD
│   │   ├── profile/              # Profile management
│   │   ├── extract/              # AI job extraction
│   │   ├── export/               # CSV export
│   │   ├── upload/               # File uploads
│   │   └── health/               # Health check
│   └── auth/callback/            # OAuth callback
├── src/
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   ├── features/             # Feature components
│   │   │   └── applications/     # Application-specific components
│   │   ├── layout/               # Layout components (Header, Footer, Sidebar)
│   │   └── profile/              # Profile components
│   ├── hooks/                    # Custom React hooks
│   ├── contexts/                 # React contexts (Auth, Theme, Toast)
│   ├── lib/                      # Client libraries
│   │   ├── api-client.ts         # API client
│   │   ├── data-mappers.ts       # Data transformation
│   │   └── performance.ts        # Performance monitoring
│   ├── core/                     # Server-side core
│   │   ├── ai/                   # AI extraction logic
│   │   ├── auth/                 # Auth middleware
│   │   ├── database/             # Database client
│   │   └── pdf/                  # PDF processing
│   ├── services/                 # Business logic
│   ├── repositories/             # Data access layer
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utilities
│   └── config/                   # Configuration
├── middleware.ts                 # Route protection
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Google Gemini API key

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (optional)
- `GOOGLE_GEMINI_API` - Google Gemini API key

3. **Set up database**
```bash
npx supabase link --project-ref [YOUR-PROJECT-REF]
npx supabase db push
npm run supabase:gen-types
```

4. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for all available variables. Required variables:

| Variable | Description | Get From |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | [Supabase Dashboard](https://app.supabase.com) → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | [Supabase Dashboard](https://app.supabase.com) → Settings → API |
| `GOOGLE_GEMINI_API` | Gemini API key | [Google AI Studio](https://aistudio.google.com/app/apikey) |

Optional variables:

| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for admin operations) |
| `GOOGLE_ID` / `GOOGLE_SECRET` | Google OAuth credentials |
| `DATABASE_URL` | Direct PostgreSQL connection (for migrations) |
| `NEXT_PUBLIC_APP_URL` | App URL (default: `http://localhost:3000`) |

## API Endpoints

### Applications
- `GET /api/applications` - List applications (with search/filter)
- `POST /api/applications` - Create application
- `GET /api/applications/[id]` - Get application details
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application

### Profile
- `GET /api/profile` - Get complete profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/cv` - Upload CV
- `POST /api/profile/cv/save` - Save extracted CV data
- `GET/POST/PUT/DELETE /api/profile/experience` - Work experience CRUD
- `GET/POST/PUT/DELETE /api/profile/education` - Education CRUD
- `GET/POST/PUT/DELETE /api/profile/skills` - Skills CRUD

### AI & Utilities
- `POST /api/extract` - Extract job posting with AI
- `POST /api/pdf-extract` - Extract text from PDF
- `GET /api/export` - Export applications to CSV
- `POST /api/upload` - Upload files
- `GET /api/skills/search` - Search skills
- `GET /api/health` - Health check

## Development

```bash
npm run dev                    # Start dev server
npm run dev:turbo              # Start with Turbopack
npm run build                  # Build for production
npm run build:analyze          # Build with bundle analyzer
npm run start                  # Start production server
npm run type-check             # Check TypeScript types
npm run lint                   # Run ESLint
npm run test                   # Run tests
npm run test:integration       # Run integration tests
npm run test:pre-check         # Pre-test environment check
npm run verify-env             # Verify environment variables
npm run check:bundle           # Check bundle sizes
```

## Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Pre-test environment check
npm run test:pre-check
```

## Deployment

The app is optimized for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically detect Next.js and configure build settings.

## Architecture

### Key Patterns

- **Route Groups**: `(public)` and `(protected)` for access control
- **Middleware**: Route protection via `middleware.ts`
- **Server Components**: Default for better performance
- **Client Components**: Only where interactivity is needed
- **API Client**: Centralized API calls with caching
- **Data Mappers**: Transform between backend (snake_case) and frontend (camelCase)
- **Custom Hooks**: Encapsulate data fetching and state management
- **Context API**: Global state (Auth, Theme, Toast)

### Data Flow

```
Component → Hook → API Client → Data Mapper → API Route → Service → Repository → Database
```

### Component Organization

- **UI Components** (`src/components/ui/`): Reusable base components (Button, Input, etc.)
- **Feature Components** (`src/components/features/`): Feature-specific components
- **Layout Components** (`src/components/layout/`): Header, Footer, Sidebar
- **Profile Components** (`src/components/profile/`): Profile-related components

## Key Technologies

- **Next.js 15.5**: App Router, Server Components, API Routes
- **React 19**: Latest React features
- **TypeScript**: Full type safety with strict mode
- **Tailwind CSS**: Utility-first styling with custom design system
- **Supabase**: PostgreSQL database, authentication, file storage
- **Google Gemini**: AI-powered job posting extraction
- **Vercel**: Deployment and hosting

## Custom Hooks

The app uses custom React hooks for data management:

- `useApplications` - Application CRUD operations
- `useProfile` - Profile management
- `useJobExtraction` - AI job posting extraction
- `useCVExtraction` - CV parsing with AI
- `useFileUpload` - File upload handling
- `useExport` - Export functionality
- `useToast` - Toast notifications
- `useRetry` - Retry failed requests

## Contexts

- **AuthContext**: User authentication state
- **ThemeContext**: Dark/light mode
- **ToastContext**: Global notifications

## Performance

The app includes several performance optimizations:

- **Code Splitting**: Dynamic imports for modals and heavy components
- **Bundle Optimization**: Vendor chunk separation, tree shaking
- **API Caching**: 5-minute cache for GET requests
- **Image Optimization**: Next.js Image with AVIF/WebP
- **Web Vitals**: Performance monitoring in development

```bash
npm run check:bundle      # Check bundle sizes
npm run build:analyze     # Analyze bundle composition
```

## Roadmap

See `tasks_list.md` for planned features:

- [ ] ATS scoring system (CV vs job description matching)
- [ ] AI-powered cover letter generation
- [ ] Browser extension for job board integration
- [ ] Playwright scraping for job postings
- [ ] B2B dashboard for schools/bootcamps
- [ ] B2B dashboard for IT consulting companies
- [ ] Multi-model AI support (OpenRouter)
- [ ] Usage tracking and pricing plans
- [ ] Vector database for CV/cover letter storage

## License

Private - All Rights Reserved

