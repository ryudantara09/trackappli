# Toast Notification System

## Overview

The toast notification system provides a centralized way to display success, error, and info messages to users across the application.

## Architecture

The system consists of three main parts:

1. **useToast Hook** (`src/hooks/useToast.ts`) - Core logic for managing toast state
2. **ToastContext** (`src/contexts/ToastContext.tsx`) - Global context provider
3. **Toast Components** - UI components for displaying toasts
   - `Toast.tsx` - Individual toast component
   - `ToastContainer.tsx` - Container for managing multiple toasts

## Usage

### Basic Usage

```tsx
import { useToastContext } from '@/contexts/ToastContext';

function MyComponent() {
  const { showSuccess, showError, showInfo } = useToastContext();
  
  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data');
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

### Available Methods

- `showSuccess(message, options?)` - Show success toast (green)
- `showError(message, options?)` - Show error toast (red)
- `showInfo(message, options?)` - Show info toast (blue)
- `showToast(message, type, options?)` - Generic toast method
- `dismissToast(id)` - Manually dismiss a toast
- `clearAll()` - Clear all toasts

### Options

```typescript
interface ToastOptions {
  duration?: number; // Duration in milliseconds (default: 5000)
}

// Example with custom duration
showSuccess('Saved!', { duration: 3000 }); // 3 seconds
```

## Features

- ✅ Auto-dismiss with configurable timeout (default 5 seconds)
- ✅ Manual dismiss by clicking X button
- ✅ Multiple toasts stacked vertically
- ✅ Smooth slide-in animations
- ✅ Dark mode support
- ✅ Accessible (ARIA live regions)
- ✅ Global state management via Context

## Integration

The ToastProvider is already integrated in the root layout (`app/layout.tsx`), so toasts work throughout the entire application without additional setup.

```tsx
// app/layout.tsx
<ToastProvider>
  {children}
</ToastProvider>
```

## Examples

### CRUD Operations

```tsx
// Create
const handleCreate = async (data) => {
  try {
    await createApplication(data);
    showSuccess('Application created successfully!');
  } catch (error) {
    showError('Failed to create application');
  }
};

// Update
const handleUpdate = async (id, data) => {
  try {
    await updateApplication(id, data);
    showSuccess('Application updated!');
  } catch (error) {
    showError('Failed to update application');
  }
};

// Delete
const handleDelete = async (id) => {
  try {
    await deleteApplication(id);
    showSuccess('Application deleted');
  } catch (error) {
    showError('Failed to delete application');
  }
};
```

### Form Validation

```tsx
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!formData.email) {
    showError('Email is required');
    return;
  }
  
  if (!isValidEmail(formData.email)) {
    showError('Please enter a valid email');
    return;
  }
  
  // Submit form...
  showSuccess('Form submitted successfully!');
};
```

### API Errors

```tsx
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    const data = await response.json();
    showInfo('Data loaded successfully');
    return data;
  } catch (error) {
    showError('Failed to load data. Please try again.');
  }
};
```

## Styling

Toasts are styled with Tailwind CSS and support dark mode automatically:

- Success: Green background
- Error: Red background
- Info: Blue background

The toast container is positioned at `top-5 right-5` with a high z-index (`z-[9999]`) to ensure it appears above all other content.

## Accessibility

- Uses ARIA live regions (`aria-live="polite"`)
- Keyboard accessible (can be dismissed with click)
- Screen reader friendly
- Respects reduced motion preferences

## Performance

- Toasts auto-dismiss after 5 seconds by default
- Old toasts are automatically removed from state
- Animations use CSS transforms for optimal performance
- No memory leaks - timers are properly cleaned up
