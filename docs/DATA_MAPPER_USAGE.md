# Data Mapper Usage Guide

## Overview

The Data Mapper (`src/lib/data-mappers.ts`) handles bidirectional transformation between backend (database) and frontend (UI) data formats. This abstraction layer ensures that field naming differences and enum value variations are handled transparently.

## Why Data Mapping?

The backend uses database-friendly naming conventions (snake_case, uppercase enums), while the frontend uses UI-friendly conventions (camelCase, title-case enums):

**Backend (Database):**
```typescript
{
  id: 123,
  position_title: "Senior Developer",
  company_name: "Tech Corp",
  job_location: "Remote",
  status: "APPLIED",
  applied_at: "2024-01-15T10:00:00Z",
  tech_stack: ["React", "TypeScript"]
}
```

**Frontend (UI):**
```typescript
{
  id: "123",
  position: "Senior Developer",
  company: "Tech Corp",
  location: "Remote",
  status: ApplicationStatus.APPLIED, // "Applied"
  dateApplied: "2024-01-15T10:00:00Z",
  skills: ["React", "TypeScript"]
}
```

## Quick Start

The API client uses the data mapper automatically, so you typically don't need to call it directly:

```typescript
import { apiClient } from '@/lib/api-client';

// Data is automatically transformed
const apps = await apiClient.getApplications(); // Returns FrontendApplication[]
```

## Direct Usage

If you need to transform data manually:

```typescript
import { ApplicationMapper } from '@/lib/data-mappers';

// Backend → Frontend
const frontendApp = ApplicationMapper.toFrontend(backendApp);

// Frontend → Backend
const backendData = ApplicationMapper.toBackend(formData);

// Array transformation
const frontendApps = ApplicationMapper.toFrontendArray(backendApps);
```

## Field Mappings

### Application Fields

| Frontend Field | Backend Field | Type Transformation |
|---------------|---------------|---------------------|
| `id` | `id` | number → string |
| `position` | `position_title` | - |
| `company` | `company_name` | - |
| `location` | `job_location` | - |
| `url` | `position_url` | - |
| `dateApplied` | `applied_at` | Date → ISO string |
| `skills` | `tech_stack` | - |
| `softSkills` | `soft_skills` | - |
| `jobType` | `job_type` | Enum mapping |
| `cvPath` | `cv_path` | - |
| `coverLetterPath` | `cover_letter_path` | - |

### Status Enum Mapping

| Frontend | Backend | Display |
|----------|---------|---------|
| `ApplicationStatus.APPLIED` | `"APPLIED"` | "Applied" |
| `ApplicationStatus.INTERVIEW` | `"INTERVIEWING"` | "Interview" |
| `ApplicationStatus.OFFER` | `"OFFERED"` | "Offer" |
| `ApplicationStatus.REJECTED` | `"REJECTED"` | "Rejected" |
| `ApplicationStatus.WITHDRAWN` | `"REJECTED"` | "Withdrawn" |

**Note:** The backend doesn't have a separate "WITHDRAWN" status, so it maps to "REJECTED".

### Job Type Enum Mapping

| Frontend | Backend | Display |
|----------|---------|---------|
| `JobType.FULL_TIME` | `"FULL_TIME"` | "Full-time" |
| `JobType.PART_TIME` | `"PART_TIME"` | "Part-time" |
| `JobType.CONTRACT` | `"CONTRACT"` | "Contract" |
| `JobType.INTERNSHIP` | `"INTERNSHIP"` | "Internship" |
| `JobType.FREELANCE` | `"FREELANCE"` | "Freelance" |

## Methods

### `toFrontend(backend)`

Transforms a backend Application object to frontend format.

**Usage:**

```typescript
import { ApplicationMapper } from '@/lib/data-mappers';

const backendApp = {
  id: 123,
  position_title: "Senior Developer",
  company_name: "Tech Corp",
  status: "APPLIED",
  // ... other backend fields
};

const frontendApp = ApplicationMapper.toFrontend(backendApp);
// Result: { id: "123", position: "Senior Developer", company: "Tech Corp", status: ApplicationStatus.APPLIED, ... }
```

### `toBackend(frontend)`

Transforms frontend Application data to backend format for create/update operations.

**Usage:**

```typescript
import { ApplicationMapper } from '@/lib/data-mappers';

const formData = {
  position: "Senior Developer",
  company: "Tech Corp",
  location: "Remote",
  status: ApplicationStatus.APPLIED,
  // ... other frontend fields
};

const backendData = ApplicationMapper.toBackend(formData);
// Result: { position_title: "Senior Developer", company_name: "Tech Corp", status: "APPLIED", ... }
```

**Partial Updates:**

The mapper handles partial data for updates:

```typescript
const partialUpdate = {
  status: ApplicationStatus.INTERVIEW,
  notes: "Phone screen scheduled",
};

const backendData = ApplicationMapper.toBackend(partialUpdate);
// Result: { status: "INTERVIEWING", notes: "Phone screen scheduled" }
```

### `toFrontendArray(backendArray)`

Convenience method for transforming arrays:

```typescript
const backendApps = [
  { id: 1, position_title: "Dev 1", ... },
  { id: 2, position_title: "Dev 2", ... },
];

const frontendApps = ApplicationMapper.toFrontendArray(backendApps);
// Result: [{ id: "1", position: "Dev 1", ... }, { id: "2", position: "Dev 2", ... }]
```

## Usage Patterns

### In API Client

The API client uses the mapper automatically:

```typescript
// src/lib/api-client.ts
async getApplications(): Promise<FrontendApplication[]> {
  const response = await this.request('/applications');
  return ApplicationMapper.toFrontendArray(response.data); // ← Automatic transformation
}

async createApplication(data: ApplicationFormData): Promise<FrontendApplication> {
  const backendData = ApplicationMapper.toBackend(data); // ← Transform to backend format
  const response = await this.request('/applications', {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
  return ApplicationMapper.toFrontend(response.data); // ← Transform response back
}
```

### In Custom Hooks

Hooks use the API client, which handles mapping automatically:

```typescript
// src/hooks/useApplications.ts
export function useApplications() {
  const [applications, setApplications] = useState<FrontendApplication[]>([]);

  const loadApplications = async () => {
    const data = await apiClient.getApplications(); // Already in frontend format
    setApplications(data);
  };

  return { applications, loadApplications };
}
```

### In Components

Components work with frontend types only:

```typescript
function ApplicationCard({ application }: { application: FrontendApplication }) {
  return (
    <div>
      <h3>{application.position}</h3>
      <p>{application.company}</p>
      <StatusBadge status={application.status} />
    </div>
  );
}
```

## Type Safety

The mapper ensures type safety at compile time:

```typescript
// TypeScript knows the return type
const frontendApp: FrontendApplication = ApplicationMapper.toFrontend(backendApp);

// TypeScript validates input
const backendData = ApplicationMapper.toBackend({
  position: "Developer",
  // TypeScript error if required fields are missing
});
```

## Handling Null/Undefined Values

The mapper handles optional fields gracefully:

```typescript
const backendApp = {
  id: 123,
  position_title: "Developer",
  company_name: "Tech Corp",
  description: null,  // ← Null value
  notes: undefined,   // ← Undefined value
};

const frontendApp = ApplicationMapper.toFrontend(backendApp);
// Result: { ..., description: undefined, notes: undefined }
```

## Custom Transformations

If you need to add custom field transformations, extend the mapper:

```typescript
// src/lib/data-mappers.ts
export class ApplicationMapper {
  // ... existing methods

  static toFrontendWithCustomField(backend: BackendApplication) {
    const base = this.toFrontend(backend);
    return {
      ...base,
      customField: this.transformCustomField(backend.custom_field),
    };
  }

  private static transformCustomField(value: any) {
    // Custom transformation logic
    return value;
  }
}
```

## Testing

### Unit Tests

Test the mapper in isolation:

```typescript
import { ApplicationMapper } from '@/lib/data-mappers';

describe('ApplicationMapper', () => {
  it('should transform backend to frontend', () => {
    const backend = {
      id: 123,
      position_title: "Developer",
      company_name: "Tech Corp",
      status: "APPLIED",
    };

    const frontend = ApplicationMapper.toFrontend(backend);

    expect(frontend.id).toBe("123");
    expect(frontend.position).toBe("Developer");
    expect(frontend.company).toBe("Tech Corp");
    expect(frontend.status).toBe(ApplicationStatus.APPLIED);
  });

  it('should transform frontend to backend', () => {
    const frontend = {
      position: "Developer",
      company: "Tech Corp",
      status: ApplicationStatus.APPLIED,
    };

    const backend = ApplicationMapper.toBackend(frontend);

    expect(backend.position_title).toBe("Developer");
    expect(backend.company_name).toBe("Tech Corp");
    expect(backend.status).toBe("APPLIED");
  });
});
```

## Troubleshooting

### "Property does not exist" errors

Make sure you're using the correct type:

```typescript
// ✗ Wrong - using backend type in frontend
const app: BackendApplication = await apiClient.getApplications();

// ✓ Correct - using frontend type
const apps: FrontendApplication[] = await apiClient.getApplications();
```

### Status enum not matching

Ensure you're using the frontend enum:

```typescript
import { ApplicationStatus } from '@/types/frontend.types';

// ✓ Correct
const status = ApplicationStatus.APPLIED;

// ✗ Wrong - using string directly
const status = "APPLIED";
```

### Missing fields after transformation

Check if the field exists in the mapping. If it's a new field, add it to the mapper:

```typescript
static toFrontend(backend: BackendApplication): FrontendApplication {
  return {
    // ... existing fields
    newField: backend.new_field, // ← Add new field mapping
  };
}
```

## Related Documentation

- [API Client Usage](./API_CLIENT_USAGE.md) - Using the API client with automatic mapping
- [Type Definitions](../src/types/README.md) - Frontend and backend type definitions
- [Backend API Types](../src/types/api.types.ts) - Backend data structures
- [Frontend Types](../src/types/frontend.types.ts) - Frontend data structures
