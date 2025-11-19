# API Client Usage Guide

## Overview

The API Client (`src/lib/api-client.ts`) provides a centralized, type-safe interface for all backend API communication. It handles authentication, data transformation, error handling, and response caching automatically.

## Quick Start

```typescript
import { apiClient } from '@/lib/api-client';

// Fetch all applications
const applications = await apiClient.getApplications();

// Create a new application
const newApp = await apiClient.createApplication({
  position: 'Senior Developer',
  company: 'Tech Corp',
  location: 'Remote',
  url: 'https://example.com/job',
  status: ApplicationStatus.APPLIED,
});

// Update an application
const updated = await apiClient.updateApplication('123', {
  status: ApplicationStatus.INTERVIEW,
  notes: 'Phone screen scheduled',
});

// Delete an application
await apiClient.deleteApplication('123');
```

## Features

### 1. Automatic Data Transformation

The API client automatically transforms data between backend and frontend formats using the `ApplicationMapper`:

- **Backend → Frontend**: Converts database field names to UI-friendly names
- **Frontend → Backend**: Converts form data to database schema

You don't need to worry about field name differences - the API client handles it transparently.

### 2. Response Caching

GET requests are automatically cached for 5 minutes to improve performance:

```typescript
// First call - fetches from server
const apps1 = await apiClient.getApplications();

// Second call within 5 minutes - returns cached data
const apps2 = await apiClient.getApplications();

// Cache is automatically invalidated on mutations
await apiClient.createApplication(data); // Clears cache
const apps3 = await apiClient.getApplications(); // Fresh data
```

**Manual Cache Control:**

```typescript
// Clear specific cache
apiClient.clearCache('GET:/applications');

// Clear all cache
apiClient.clearCache();
```

### 3. Error Handling

All errors are thrown as `ApiError` instances with detailed information:

```typescript
try {
  await apiClient.createApplication(data);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Status:', error.statusCode);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error.details);
  }
}
```

**Common Error Codes:**

- `400` - Validation error (check `details` for field-specific errors)
- `401` - Authentication required
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Server error
- `0` - Network error (no connection)

### 4. Type Safety

All methods are fully typed with TypeScript:

```typescript
// TypeScript knows the return type
const apps: FrontendApplication[] = await apiClient.getApplications();

// TypeScript validates input data
await apiClient.createApplication({
  position: 'Developer',
  company: 'Tech Corp',
  // TypeScript error: missing required fields
});
```

## API Methods

### Applications

#### `getApplications(params?)`

Fetch user's applications with optional filtering and pagination.

**Parameters:**

```typescript
interface GetApplicationsParams {
  q?: string;        // Search query (searches position, company, location)
  status?: string;   // Filter by status (APPLIED, INTERVIEWING, OFFERED, REJECTED)
  limit?: number;    // Number of results per page
  offset?: number;   // Pagination offset
}
```

**Example:**

```typescript
// Get all applications
const all = await apiClient.getApplications();

// Search applications
const results = await apiClient.getApplications({ 
  q: 'developer' 
});

// Filter by status
const interviews = await apiClient.getApplications({ 
  status: 'INTERVIEWING' 
});

// Pagination
const page1 = await apiClient.getApplications({ 
  limit: 10, 
  offset: 0 
});
const page2 = await apiClient.getApplications({ 
  limit: 10, 
  offset: 10 
});
```

#### `getApplication(id)`

Fetch a single application by ID.

**Parameters:**

- `id` (string): Application ID

**Example:**

```typescript
const app = await apiClient.getApplication('123');
console.log(app.position, app.company);
```

#### `createApplication(data)`

Create a new application.

**Parameters:**

```typescript
interface ApplicationFormData {
  position: string;
  company: string;
  location: string;
  url: string;
  status: ApplicationStatus;
  description?: string;
  notes?: string;
  skills?: string[];
  softSkills?: string[];
  jobType?: JobType;
  tags?: string[];
}
```

**Example:**

```typescript
const newApp = await apiClient.createApplication({
  position: 'Senior Frontend Developer',
  company: 'Tech Startup',
  location: 'San Francisco, CA',
  url: 'https://example.com/careers/senior-frontend',
  status: ApplicationStatus.APPLIED,
  description: 'Exciting opportunity to work on cutting-edge React applications',
  skills: ['React', 'TypeScript', 'Next.js'],
  softSkills: ['Communication', 'Team Leadership'],
  jobType: JobType.FULL_TIME,
  tags: ['remote-friendly', 'startup'],
});
```

#### `updateApplication(id, data)`

Update an existing application.

**Parameters:**

- `id` (string): Application ID
- `data` (Partial<ApplicationFormData>): Fields to update

**Example:**

```typescript
// Update status
await apiClient.updateApplication('123', {
  status: ApplicationStatus.INTERVIEW,
});

// Update multiple fields
await apiClient.updateApplication('123', {
  status: ApplicationStatus.OFFER,
  notes: 'Received offer! Salary: $120k',
});
```

#### `deleteApplication(id)`

Delete an application.

**Parameters:**

- `id` (string): Application ID

**Example:**

```typescript
await apiClient.deleteApplication('123');
```

## Usage in React Components

### With Custom Hooks

The recommended way to use the API client is through custom hooks:

```typescript
import { useApplications } from '@/hooks/useApplications';

function ApplicationsList() {
  const { 
    applications, 
    loading, 
    error, 
    addApplication,
    updateApplication,
    deleteApplication,
    refresh 
  } = useApplications();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {applications.map(app => (
        <div key={app.id}>{app.position} at {app.company}</div>
      ))}
    </div>
  );
}
```

### Direct Usage

For one-off requests or server components:

```typescript
import { apiClient } from '@/lib/api-client';

async function ServerComponent() {
  const applications = await apiClient.getApplications();
  
  return (
    <div>
      {applications.map(app => (
        <div key={app.id}>{app.position}</div>
      ))}
    </div>
  );
}
```

### Error Handling in Components

```typescript
import { apiClient, ApiError } from '@/lib/api-client';
import { useToast } from '@/hooks/useToast';

function CreateApplicationForm() {
  const { showToast } = useToast();

  const handleSubmit = async (data: ApplicationFormData) => {
    try {
      await apiClient.createApplication(data);
      showToast('Application created successfully!', 'success');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 400) {
          showToast(`Validation error: ${error.details}`, 'error');
        } else if (error.statusCode === 401) {
          showToast('Please log in to continue', 'error');
        } else {
          showToast(error.message, 'error');
        }
      }
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Performance Optimization

### Cache Strategy

The API client uses an intelligent caching strategy:

1. **GET requests** are cached for 5 minutes
2. **Mutations** (POST, PUT, DELETE) automatically invalidate related cache
3. Cache is stored in memory (cleared on page refresh)

### Best Practices

1. **Use hooks for component data**: Hooks provide automatic state management and error handling
2. **Batch requests**: If you need multiple resources, fetch them in parallel:

```typescript
const [applications, profile] = await Promise.all([
  apiClient.getApplications(),
  apiClient.getProfile(),
]);
```

3. **Leverage cache**: Don't disable cache unless you need real-time data
4. **Handle errors gracefully**: Always wrap API calls in try-catch blocks

## Testing

### Mocking the API Client

For unit tests, you can mock the API client:

```typescript
import { apiClient } from '@/lib/api-client';

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    getApplications: jest.fn(),
    createApplication: jest.fn(),
    // ... other methods
  },
}));

// In your test
(apiClient.getApplications as jest.Mock).mockResolvedValue([
  { id: '1', position: 'Developer', company: 'Tech Corp' },
]);
```

### Integration Tests

For integration tests, use the real API client with a test database:

```typescript
import { apiClient } from '@/lib/api-client';

describe('Application CRUD', () => {
  it('should create and fetch application', async () => {
    const created = await apiClient.createApplication({
      position: 'Test Position',
      company: 'Test Company',
      // ... other fields
    });

    const fetched = await apiClient.getApplication(created.id);
    expect(fetched.position).toBe('Test Position');
  });
});
```

## Troubleshooting

### "Network error" on all requests

- Check if the development server is running (`npm run dev`)
- Verify environment variables are configured (`.env.local`)
- Check browser console for CORS errors

### "Authentication required" (401)

- User session may have expired - redirect to login
- Check if Supabase auth is properly configured
- Verify cookies are being sent (credentials: 'include')

### Cached data not updating

- Cache is automatically invalidated on mutations
- For manual refresh, call `apiClient.clearCache()`
- Check if you're using the same query parameters (cache key includes params)

### TypeScript errors

- Ensure you're importing types from `@/types/frontend.types`
- Check that your data matches the `ApplicationFormData` interface
- Update TypeScript if you see "Property does not exist" errors

## Related Documentation

- [Data Mapper Usage](./DATA_MAPPER_USAGE.md) - Understanding data transformation
- [Custom Hooks](../src/hooks/README.md) - Using React hooks with the API client
- [Error Handling](./ERROR_HANDLING.md) - Comprehensive error handling guide
