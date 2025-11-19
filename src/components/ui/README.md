# Loading and Error State Components

This directory contains components for handling loading states, error states, and empty states throughout the application.

## Components

### LoadingSpinner

A simple animated spinner for indicating loading states.

```tsx
import { LoadingSpinner } from '@/components/ui';

// Basic usage
<LoadingSpinner />

// With size variants
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
```

### Skeleton

A skeleton placeholder for content that is loading.

```tsx
import { Skeleton } from '@/components/ui';

// Basic rectangular skeleton
<Skeleton className="h-4 w-full" />

// Circular skeleton (for avatars)
<Skeleton variant="circular" className="w-12 h-12" />

// Text skeleton
<Skeleton variant="text" className="h-4 w-3/4" />

// With shimmer animation
<Skeleton animation="wave" className="h-20 w-full" />
```

### ApplicationCardSkeleton

Pre-built skeleton for application cards.

```tsx
import { ApplicationCardSkeleton } from '@/components/ui';

// Show while loading application cards
{isLoading && (
  <>
    <ApplicationCardSkeleton />
    <ApplicationCardSkeleton />
    <ApplicationCardSkeleton />
  </>
)}
```

### TableSkeleton

Skeleton for table layouts.

```tsx
import { TableSkeleton } from '@/components/ui';

// Default 5 rows, 5 columns
<TableSkeleton />

// Custom dimensions
<TableSkeleton rows={10} columns={3} />
```

### ErrorBoundary

React Error Boundary for catching and displaying errors.

```tsx
import { ErrorBoundary } from '@/components/ui';

// Wrap components that might throw errors
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={<div>Custom error UI</div>}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### ErrorMessage

Display error messages with retry functionality.

```tsx
import { ErrorMessage } from '@/components/ui';

// Inline error
<ErrorMessage message="Failed to load data" />

// Banner style with retry
<ErrorMessage
  variant="banner"
  title="Error Loading Applications"
  message="Unable to fetch applications. Please try again."
  onRetry={handleRetry}
  onDismiss={handleDismiss}
/>

// Card style
<ErrorMessage
  variant="card"
  message="Something went wrong"
  onRetry={handleRetry}
/>
```

### EmptyState

Display empty states when no data is available.

```tsx
import { EmptyState } from '@/components/ui';

// No applications
<EmptyState
  type="no-applications"
  onAction={handleAddApplication}
/>

// No search results
<EmptyState
  type="no-results"
  searchQuery={searchTerm}
/>

// Empty column (Kanban)
<EmptyState type="column-empty" />

// Custom empty state
<EmptyState
  type="no-applications"
  title="Custom Title"
  description="Custom description"
  actionLabel="Custom Action"
  onAction={handleAction}
/>
```

### LoadingOverlay

Full-screen or container loading overlay.

```tsx
import { LoadingOverlay } from '@/components/ui';

// Container overlay
{isLoading && <LoadingOverlay message="Loading applications..." />}

// Full-screen overlay
{isLoading && <LoadingOverlay fullScreen message="Processing..." />}

// Transparent overlay
{isLoading && <LoadingOverlay transparent />}
```

### AsyncContent

Wrapper component that handles loading, error, and empty states automatically.

```tsx
import { AsyncContent } from '@/components/ui';

<AsyncContent
  isLoading={isLoading}
  error={error}
  isEmpty={applications.length === 0}
  onRetry={refetch}
  emptyMessage="No applications found"
>
  {/* Your content here */}
  {applications.map(app => (
    <ApplicationCard key={app.id} application={app} />
  ))}
</AsyncContent>

// With custom components
<AsyncContent
  isLoading={isLoading}
  error={error}
  loadingComponent={<ApplicationCardSkeleton />}
  errorComponent={<CustomError />}
  emptyComponent={<CustomEmpty />}
>
  {/* Your content */}
</AsyncContent>
```

## Hooks

### useRetry

Hook for handling retry logic with exponential backoff.

```tsx
import { useRetry } from '@/hooks/useRetry';

function MyComponent() {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    return response.json();
  };

  const { execute, isLoading, error, retryCount, reset } = useRetry(
    fetchData,
    {
      maxRetries: 3,
      retryDelay: 1000,
      onError: (error) => {
        console.error('All retries failed:', error);
      },
    }
  );

  return (
    <div>
      <button onClick={execute} disabled={isLoading}>
        Load Data
      </button>
      {isLoading && <LoadingSpinner />}
      {error && (
        <ErrorMessage
          message={error.message}
          onRetry={execute}
        />
      )}
      {retryCount > 0 && <p>Retry attempt: {retryCount}</p>}
    </div>
  );
}
```

## Usage Patterns

### Pattern 1: Simple Loading State

```tsx
function ApplicationsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications().then(data => {
      setApplications(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <ApplicationCardSkeleton />
        <ApplicationCardSkeleton />
        <ApplicationCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map(app => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}
```

### Pattern 2: Error Handling with Retry

```tsx
function ApplicationsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <ErrorMessage
        variant="card"
        message={error.message}
        onRetry={loadApplications}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map(app => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}
```

### Pattern 3: Complete Async State Management

```tsx
function ApplicationsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <AsyncContent
      isLoading={isLoading}
      error={error}
      isEmpty={applications.length === 0}
      onRetry={loadApplications}
      loadingComponent={
        <div className="grid gap-4">
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
        </div>
      }
    >
      <div className="grid gap-4">
        {applications.map(app => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>
    </AsyncContent>
  );
}
```

### Pattern 4: Error Boundary for Component Protection

```tsx
function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error tracking service
        logErrorToService(error, errorInfo);
      }}
    >
      <Dashboard />
    </ErrorBoundary>
  );
}
```

## Styling

All components use Tailwind CSS classes and follow the design system defined in `tailwind.config.js`. The components are designed to be:

- **Accessible**: Proper ARIA labels and semantic HTML
- **Responsive**: Work on all screen sizes
- **Themeable**: Support light/dark mode through Tailwind classes
- **Customizable**: Accept className props for additional styling

## Best Practices

1. **Always show loading states** for async operations
2. **Provide retry mechanisms** for failed requests
3. **Use skeleton loaders** for better perceived performance
4. **Handle empty states** gracefully with helpful messages
5. **Wrap risky components** in ErrorBoundary
6. **Use AsyncContent** for consistent async state handling
7. **Provide meaningful error messages** to users
8. **Test error scenarios** to ensure proper error handling
