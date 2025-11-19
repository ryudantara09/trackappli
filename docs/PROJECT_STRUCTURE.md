# Project Structure Guide

This document provides a detailed overview of the project structure and organization.

## Directory Overview

```
trackappli/
├── app/                    # Next.js App Router (pages and API routes)
├── src/                    # Source code (components, hooks, services)
├── docs/                   # Documentation
├── supabase/               # Database migrations
├── api/                    # Python serverless functions
├── public/                 # Static assets
├── scripts/                # Build and utility scripts
└── .kiro/                  # Kiro AI specifications
```

## App Directory (`app/`)

Next.js App Router structure with route groups for public and protected routes.

### Route Groups

```
app/
├── (public)/              # Routes accessible without authentication
│   ├── page.tsx           # Landing page (/)
│   ├── auth/
│   │   └── page.tsx       # Login/signup page (/auth)
│   ├── about/
│   │   └── page.tsx       # About page (/about)
│   ├── help/
│   │   └── page.tsx       # Help center (/help)
│   ├── privacy/
│   │   └── page.tsx       # Privacy policy (/privacy)
│   └── terms/
│       └── page.tsx       # Terms of service (/terms)
│
├── (protected)/           # Routes requiring authentication
│   ├── dashboard/
│   │   └── page.tsx       # Dashboard (/dashboard)
│   ├── applications/
│   │   ├── page.tsx       # Applications list (/applications)
│   │   └── [id]/
│   │       └── page.tsx   # Application details (/applications/:id)
│   ├── profile/
│   │   └── page.tsx       # User profile (/profile)
│   ├── settings/
│   │   └── page.tsx       # User settings (/settings)
│   └── analytics/
│       └── page.tsx       # Analytics (/analytics)
│
├── api/                   # API routes
│   ├── applications/
│   │   ├── route.ts       # GET /api/applications, POST /api/applications
│   │   └── [id]/
│   │       └── route.ts   # GET/PUT/DELETE /api/applications/:id
│   ├── profile/
│   │   ├── route.ts       # GET /api/profile
│   │   ├── cv/
│   │   │   └── route.ts   # POST /api/profile/cv
│   │   ├── experience/
│   │   │   └── route.ts   # CRUD for work experience
│   │   ├── education/
│   │   │   └── route.ts   # CRUD for education
│   │   └── skills/
│   │       └── route.ts   # CRUD for skills
│   ├── extract/
│   │   └── route.ts       # POST /api/extract (AI job posting extraction)
│   ├── export/
│   │   └── route.ts       # GET /api/export (CSV/JSON export)
│   └── upload/
│       └── route.ts       # POST /api/upload (file upload)
│
├── layout.tsx             # Root layout (providers, global styles)
└── globals.css            # Global CSS styles
```

### Route Protection

- **Public routes** (`(public)/`): Accessible to everyone
- **Protected routes** (`(protected)/`): Require authentication, enforced by `middleware.ts`

## Source Directory (`src/`)

Application source code organized by concern.

### Components (`src/components/`)

React components following atomic design principles.

```
src/components/
├── ui/                           # Base UI components (atoms)
│   ├── Button.tsx                # Button component
│   ├── Input.tsx                 # Input field
│   ├── StatusBadge.tsx           # Status badge
│   ├── Icon.tsx                  # Icon component
│   ├── Toast.tsx                 # Toast notification
│   ├── AsyncContent.tsx          # Async content wrapper
│   ├── ErrorMessage.tsx          # Error display
│   ├── EmptyState.tsx            # Empty state
│   └── README.md                 # UI components documentation
│
├── features/                     # Feature-specific components
│   ├── applications/
│   │   ├── ApplicationCard.tsx   # Application card
│   │   ├── AddApplicationModal.tsx
│   │   ├── EditApplicationModal.tsx
│   │   ├── SearchFilterBar.tsx
│   │   ├── ListView.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── SummaryCard.tsx
│   ├── profile/
│   │   ├── ExperienceForm.tsx
│   │   ├── EducationForm.tsx
│   │   └── SkillsManager.tsx
│   └── analytics/
│       ├── StatusChart.tsx
│       └── TimelineChart.tsx
│
├── layout/                       # Layout components
│   ├── Header.tsx                # App header with navigation
│   ├── Footer.tsx                # App footer
│   └── Sidebar.tsx               # Sidebar navigation
│
└── DynamicModal.tsx              # Dynamic modal loader (code splitting)
```

### Hooks (`src/hooks/`)

Custom React hooks for data management and UI state.

```
src/hooks/
├── useApplications.ts     # Application data management
├── useAuth.ts             # Authentication state
├── useToast.ts            # Toast notifications
├── useExport.ts           # Export functionality
├── useRetry.ts            # Retry logic for failed requests
├── useFileUpload.ts       # File upload handling
├── useJobExtraction.ts    # AI job posting extraction
└── useCVExtraction.ts     # AI CV extraction
```

### Contexts (`src/contexts/`)

React contexts for global state management.

```
src/contexts/
├── AuthContext.tsx        # Authentication state (user, login, logout)
└── ThemeContext.tsx       # Theme state (light/dark mode)
```

### Library (`src/lib/`)

Shared libraries and utilities.

```
src/lib/
├── api-client.ts          # Centralized API client
├── data-mappers.ts        # Data transformation layer
├── auth-client.ts         # Supabase auth client
├── performance.ts         # Performance monitoring utilities
└── errors.ts              # Error classes and handling
```

### Core (`src/core/`)

Backend core logic (server-side only).

```
src/core/
├── auth/
│   ├── middleware.ts      # Authentication middleware
│   └── session.ts         # Session management
├── database/
│   ├── client.ts          # Supabase client
│   └── connection.ts      # Database connection
├── ai/
│   ├── gemini.ts          # Gemini AI client
│   └── extraction.ts      # AI extraction logic
└── pdf/
    └── parser.ts          # PDF parsing
```

### Services (`src/services/`)

Business logic services (server-side).

```
src/services/
├── application.service.ts # Application business logic
├── profile.service.ts     # Profile business logic
├── extraction.service.ts  # AI extraction service
└── export.service.ts      # Export service
```

### Repositories (`src/repositories/`)

Data access layer (server-side).

```
src/repositories/
├── application.repository.ts  # Application data access
├── profile.repository.ts      # Profile data access
├── experience.repository.ts   # Work experience data access
├── education.repository.ts    # Education data access
└── skills.repository.ts       # Skills data access
```

### Types (`src/types/`)

TypeScript type definitions.

```
src/types/
├── api.types.ts           # Backend API types (database schema)
├── frontend.types.ts      # Frontend UI types (component props)
└── supabase.types.ts      # Supabase generated types
```

### Configuration (`src/config/`)

Application configuration.

```
src/config/
├── constants.ts           # Application constants
├── env.ts                 # Environment variables
└── supabase.ts            # Supabase configuration
```

## Documentation (`docs/`)

Project documentation.

```
docs/
├── API_CLIENT_USAGE.md           # API client guide
├── DATA_MAPPER_USAGE.md          # Data mapper guide
├── CLEANUP_CHECKLIST.md          # Cleanup tasks
├── PROJECT_STRUCTURE.md          # This file
├── INTEGRATION_TESTING.md        # Testing guide
├── ENVIRONMENT_SETUP.md          # Environment setup
├── ENVIRONMENT_VERIFICATION.md   # Verify configuration
├── QUICK_TEST_GUIDE.md           # Quick testing reference
├── TESTING_SUMMARY.md            # Test coverage
├── PERFORMANCE_OPTIMIZATION.md   # Performance guide
├── PERFORMANCE_QUICK_REFERENCE.md
├── PERFORMANCE_SUMMARY.md
├── DESIGN_VALIDATION_README.md   # Design validation
├── VISUAL_COMPARISON_GUIDE.md
├── RESPONSIVE_DESIGN_TEST.md
├── DARK_MODE_TEST.md
├── ANIMATION_TEST.md
└── DESIGN_VALIDATION_CHECKLIST.md
```

## Database (`supabase/`)

Database migrations and configuration.

```
supabase/
└── migrations/
    ├── 20240101000000_initial_schema.sql
    ├── 20240102000000_add_applications.sql
    └── ...
```

## Python Functions (`api/`)

Python serverless functions for PDF processing.

```
api/
└── pdf-extract/
    ├── index.py           # PDF extraction function
    └── requirements.txt   # Python dependencies
```

## Scripts (`scripts/`)

Build and utility scripts.

```
scripts/
├── verify-env.ts          # Verify environment variables
├── integration-test.ts    # Integration test runner
├── pre-test-check.ts      # Pre-test validation
├── validate-design.ts     # Design validation
└── check-bundle-size.ts   # Bundle size checker
```

## Configuration Files

### Root Level

```
trackappli/
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── eslint.config.mjs      # ESLint configuration
├── middleware.ts          # Next.js middleware (route protection)
├── .env.local             # Environment variables (local)
├── .env.example           # Environment variables template
├── .env.test.example      # Test environment template
├── .gitignore             # Git ignore rules
└── vercel.json            # Vercel deployment configuration
```

## File Naming Conventions

### Components

- **PascalCase**: `ApplicationCard.tsx`, `AddApplicationModal.tsx`
- **Suffix**: Component type suffix for clarity (e.g., `Modal`, `Form`, `Card`)

### Hooks

- **camelCase**: `useApplications.ts`, `useAuth.ts`
- **Prefix**: Always start with `use`

### Services/Repositories

- **camelCase**: `application.service.ts`, `profile.repository.ts`
- **Suffix**: `.service.ts` or `.repository.ts`

### Types

- **camelCase**: `api.types.ts`, `frontend.types.ts`
- **Suffix**: `.types.ts`

### API Routes

- **kebab-case**: Folder names use kebab-case
- **File**: Always `route.ts` for API routes

## Import Aliases

TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { Button } from '../../../components/ui/Button'
import { Button } from '@/components/ui/Button';

// Available aliases:
// @/* → src/*
// @/components/* → src/components/*
// @/lib/* → src/lib/*
// @/hooks/* → src/hooks/*
// @/types/* → src/types/*
```

## Code Organization Principles

### 1. Separation of Concerns

- **Frontend**: Components, hooks, contexts (client-side)
- **Backend**: Services, repositories, core (server-side)
- **Shared**: Types, utilities, configuration

### 2. Atomic Design

Components are organized by complexity:

- **Atoms**: Basic UI components (Button, Input)
- **Molecules**: Combinations of atoms (SearchBar, StatusBadge)
- **Organisms**: Complex components (ApplicationCard, Header)
- **Templates**: Page layouts
- **Pages**: Complete pages in `app/` directory

### 3. Feature-Based Organization

Feature-specific code is grouped together:

```
features/applications/
├── ApplicationCard.tsx
├── AddApplicationModal.tsx
├── EditApplicationModal.tsx
└── SearchFilterBar.tsx
```

### 4. Layered Architecture

```
Presentation Layer (Components, Pages)
        ↓
Business Logic Layer (Hooks, Services)
        ↓
Data Access Layer (API Client, Repositories)
        ↓
Database Layer (Supabase)
```

## Related Documentation

- [README.md](../README.md) - Project overview
- [API Client Usage](./API_CLIENT_USAGE.md) - API client guide
- [Data Mapper Usage](./DATA_MAPPER_USAGE.md) - Data transformation
- [UI Components](../src/components/ui/README.md) - Component library
