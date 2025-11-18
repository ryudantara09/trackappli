# Job Application Tracker

Modern, full-stack application for tracking job applications with AI-powered data extraction and a beautiful, responsive UI.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5 with App Router (React 19)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API + Custom Hooks
- **Type Safety**: TypeScript with strict mode
- **UI Components**: Custom component library (atomic design)

### Backend
- **Runtime**: Node.js 18+ on Vercel serverless functions
- **Database**: PostgreSQL via Supabase with Row Level Security (RLS)
- **Authentication**: Supabase Auth with OAuth providers (Google, LinkedIn)
- **AI Service**: Google Gemini 1.5 Flash API
- **File Processing**: Python serverless function for PDF extraction
- **Deployment**: Vercel

## Project Structure

The application follows a modern Next.js architecture with clear separation of concerns. For a detailed breakdown of the project structure, see [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md).

**Quick Overview:**

```
trackappli/
├── app/                    # Next.js App Router (pages & API routes)
│   ├── (public)/           # Public routes (landing, auth, etc.)
│   ├── (protected)/        # Protected routes (dashboard, applications, etc.)
│   └── api/                # API endpoints
├── src/
│   ├── components/         # React components (ui, features, layout)
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts (auth, theme)
│   ├── lib/                # Shared libraries (API client, data mappers)
│   ├── core/               # Backend core logic (auth, database, AI)
│   ├── services/           # Business logic services
│   ├── repositories/       # Data access layer
│   ├── types/              # TypeScript types
│   └── config/             # Configuration
├── docs/                   # Documentation
├── supabase/               # Database migrations
└── middleware.ts           # Route protection
```

**Key Directories:**

- **`app/`**: Next.js pages and API routes using App Router
- **`src/components/`**: Reusable UI components organized by atomic design
- **`src/hooks/`**: Custom React hooks for data management
- **`src/lib/`**: Core libraries (API client, data transformation)
- **`docs/`**: Comprehensive project documentation

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
   - See [Environment Variables](#environment-variables) section below for quick reference
   - See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for detailed setup guide

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

## Environment Variables

### Required Variables

These variables must be configured for the application to work:

#### Supabase Configuration

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | [Supabase Dashboard](https://app.supabase.com) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key (safe for frontend) | [Supabase Dashboard](https://app.supabase.com) → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only, bypasses RLS) | [Supabase Dashboard](https://app.supabase.com) → Project Settings → API |

**Security Note**: The `SUPABASE_SERVICE_ROLE_KEY` has full database access and bypasses Row Level Security. Never expose it to the frontend or commit it to version control.

#### AI Configuration

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GOOGLE_GEMINI_API` | Google Gemini API key for AI extraction | [Google AI Studio](https://aistudio.google.com/app/apikey) |

### Optional Variables

These variables are optional and have default values:

#### Database

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Direct PostgreSQL connection string (only needed for migrations) | Not set |

#### OAuth Providers

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GOOGLE_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_SECRET` | Google OAuth Client Secret | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |

#### Application Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment (`development`, `production`, `test`) | `development` |
| `LOG_LEVEL` | Logging verbosity (`error`, `warn`, `info`, `debug`) | `info` |
| `NEXT_PUBLIC_APP_URL` | Public URL of your application | `http://localhost:3000` |

### Configuration Examples

#### Development Environment

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GOOGLE_GEMINI_API=AIzaSyA...
NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Production Environment

```bash
# .env.production (or Vercel environment variables)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GOOGLE_GEMINI_API=AIzaSyA...
NODE_ENV=production
LOG_LEVEL=info
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Verifying Configuration

To verify your environment variables are correctly configured:

```bash
# Check if all required variables are set
npm run type-check

# Start the development server
npm run dev
```

If any required variables are missing, you'll see clear error messages indicating which variables need to be configured.

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

## Testing

### Automated Integration Tests

Run comprehensive integration tests covering all API endpoints and user flows:

```bash
# Check if environment is ready for testing
npm run test:pre-check

# Run integration tests (requires dev server to be running)
npm run test:integration
```

### Manual Testing

Follow the comprehensive manual testing checklist in [docs/INTEGRATION_TESTING.md](docs/INTEGRATION_TESTING.md).

### Test Coverage

The integration test suite covers:

- **Authentication**: Signup, login, logout, session persistence
- **Application CRUD**: Create, read, update, delete operations
- **Search & Filter**: Text search and status filtering
- **Profile Management**: Experience, education, skills
- **File Upload**: CV and cover letter uploads with validation
- **AI Extraction**: Job posting and CV data extraction
- **Export**: CSV and JSON export functionality
- **API Endpoints**: All backend API routes

### Running Tests

1. Start the development server:
```bash
npm run dev
```

2. In a separate terminal, run the pre-test check:
```bash
npm run test:pre-check
```

3. If all checks pass, run the integration tests:
```bash
npm run test:integration
```

### Test Reports

Use the test report template in [docs/TEST_REPORT_TEMPLATE.md](docs/TEST_REPORT_TEMPLATE.md) to document test results.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Architecture

### Frontend Architecture

The application uses a modern React architecture with Next.js App Router:

- **Route Groups**: Separate public and protected routes with middleware
- **Server Components**: Default to server components for better performance
- **Client Components**: Used only where interactivity is needed
- **Data Fetching**: Custom hooks with automatic caching and error handling
- **State Management**: React Context for global state (auth, theme)

### Data Flow

```
User Action → Component → Hook → API Client → Data Mapper → Backend API
                ↓                                    ↓
            Local State ← Data Mapper ← API Response
```

**Key Features:**

1. **Automatic Data Transformation**: The data mapper handles field name differences between backend (snake_case) and frontend (camelCase)
2. **Response Caching**: GET requests are cached for 5 minutes to reduce server load
3. **Optimistic Updates**: UI updates immediately, with rollback on errors
4. **Type Safety**: Full TypeScript coverage with strict mode

### API Client

The centralized API client (`src/lib/api-client.ts`) provides:

- Type-safe methods for all API endpoints
- Automatic authentication token handling
- Response caching with smart invalidation
- Comprehensive error handling
- Data transformation (backend ↔ frontend)

**Example Usage:**

```typescript
import { apiClient } from '@/lib/api-client';

// Fetch applications (automatically cached)
const apps = await apiClient.getApplications();

// Create application (auto-transforms data)
const newApp = await apiClient.createApplication({
  position: 'Senior Developer',
  company: 'Tech Corp',
  location: 'Remote',
  status: ApplicationStatus.APPLIED,
});

// Update application
await apiClient.updateApplication('123', {
  status: ApplicationStatus.INTERVIEW,
});
```

See [docs/API_CLIENT_USAGE.md](docs/API_CLIENT_USAGE.md) for complete documentation.

### Data Mapper

The data mapper (`src/lib/data-mappers.ts`) handles bidirectional transformation:

**Backend (Database):**
```typescript
{
  id: 123,
  position_title: "Senior Developer",
  company_name: "Tech Corp",
  status: "APPLIED"
}
```

**Frontend (UI):**
```typescript
{
  id: "123",
  position: "Senior Developer",
  company: "Tech Corp",
  status: ApplicationStatus.APPLIED
}
```

See [docs/DATA_MAPPER_USAGE.md](docs/DATA_MAPPER_USAGE.md) for complete documentation.

## Documentation

### Getting Started
- [Environment Setup](docs/ENVIRONMENT_SETUP.md) - Configure environment variables
- [Database Setup](SETUP_DATABASE.md) - Set up Supabase database
- [Environment Verification](docs/ENVIRONMENT_VERIFICATION.md) - Verify configuration

### Architecture & Structure
- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed project organization
- [API Client Usage](docs/API_CLIENT_USAGE.md) - Using the API client
- [Data Mapper Usage](docs/DATA_MAPPER_USAGE.md) - Understanding data transformation
- [Custom Hooks](src/hooks/README.md) - React hooks documentation
- [UI Components](src/components/ui/README.md) - Component library

### Testing
- [Integration Testing](docs/INTEGRATION_TESTING.md) - Running integration tests
- [Quick Test Guide](docs/QUICK_TEST_GUIDE.md) - Fast testing reference
- [Testing Summary](docs/TESTING_SUMMARY.md) - Test coverage overview

### Performance
- [Performance Optimization](docs/PERFORMANCE_OPTIMIZATION.md) - Full optimization guide
- [Performance Quick Reference](docs/PERFORMANCE_QUICK_REFERENCE.md) - Quick tips
- [Performance Summary](docs/PERFORMANCE_SUMMARY.md) - Optimization overview

### Design
- [Design Validation](docs/DESIGN_VALIDATION_README.md) - Design preservation guide
- [Visual Comparison Guide](docs/VISUAL_COMPARISON_GUIDE.md) - Compare with original design
- [Responsive Design Test](docs/RESPONSIVE_DESIGN_TEST.md) - Test responsive layouts
- [Dark Mode Test](docs/DARK_MODE_TEST.md) - Test dark mode styling

### Specifications
- [Frontend Integration Design](.kiro/specs/frontend-integration/design.md) - Integration architecture
- [Frontend Integration Requirements](.kiro/specs/frontend-integration/requirements.md) - Requirements document
- [Frontend Integration Tasks](.kiro/specs/frontend-integration/tasks.md) - Implementation tasks

### Maintenance
- [Cleanup Checklist](docs/CLEANUP_CHECKLIST.md) - Post-integration cleanup tasks

## Migration from Vite Frontend

This application was originally developed as two separate projects:
- **Frontend**: React + Vite application (in `front/` directory)
- **Backend**: Next.js API application (in `trackappli/` directory)

The frontend has been fully integrated into the Next.js application following these steps:

1. **Component Migration**: All React components migrated to `src/components/`
2. **Page Migration**: All pages converted to Next.js App Router structure
3. **Styling Integration**: Tailwind CSS configuration and global styles preserved
4. **API Integration**: Centralized API client with data transformation layer
5. **Authentication**: Integrated with Supabase auth (replaced mock auth)
6. **State Management**: React Context API for global state
7. **Performance**: Added caching, code splitting, and optimization

### Removed Files

The following files/directories from the original Vite frontend are no longer needed:

- `front/` directory (entire React/Vite application)
- `vite.config.ts` (replaced by Next.js configuration)
- Separate `package.json` for frontend (merged into main package.json)

**Note**: If you still have the `front/` directory, it can be safely removed as all functionality has been migrated to the integrated Next.js application.

## License

Private - All Rights Reserved

## Performance Optimization

The application is optimized for performance with the following features:

### ⚡ Optimizations Implemented

- **Bundle Optimization**: Code splitting, vendor chunk separation, tree shaking
- **API Caching**: Intelligent 5-minute cache for GET requests with automatic invalidation
- **Code Splitting**: Dynamic imports for modals and heavy components
- **Image Optimization**: Next.js Image component with AVIF/WebP support
- **Web Vitals Monitoring**: Real-time performance tracking in development

### 📊 Performance Commands

```bash
# Check bundle sizes
npm run check:bundle

# Build with bundle analyzer
npm run build:analyze

# Monitor Web Vitals (check browser console)
npm run dev
```

### 🎯 Performance Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **First Load JS**: < 200 KB
- **Route Size**: < 100 KB

### 📚 Performance Documentation

- **Full Guide**: `docs/PERFORMANCE_OPTIMIZATION.md`
- **Quick Reference**: `docs/PERFORMANCE_QUICK_REFERENCE.md`
- **Summary**: `docs/PERFORMANCE_SUMMARY.md`

### 💡 Usage Examples

```typescript
// API Caching (automatic)
import { apiClient } from '@/lib/api-client';
const apps = await apiClient.getApplications(); // Cached for 5 minutes

// Dynamic Imports
import { DynamicAddApplicationModal } from '@/components/DynamicModal';
{showModal && <DynamicAddApplicationModal onClose={...} />}

// Performance Monitoring
import { measureApiCall } from '@/lib/performance';
const data = await measureApiCall('/api/applications', async () => {
  return await apiClient.getApplications();
});
```

