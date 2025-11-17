/**
 * Error Handling Utilities
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(403, 'FORBIDDEN', message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: string) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(502, 'EXTERNAL_SERVICE_ERROR', message || `${service} service unavailable`);
  }
}

export function formatErrorResponse(error: unknown): ErrorResponse {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const issues = error.issues;
    const firstError = issues[0];
    const fieldPath = firstError.path.join('.');
    const message = fieldPath ? `${fieldPath}: ${firstError.message}` : firstError.message;
    
    return {
      error: message,
      code: 'VALIDATION_ERROR',
      details: process.env.NODE_ENV === 'development' 
        ? JSON.stringify(issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })))
        : undefined,
    };
  }

  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined,
    };
  }

  if (error instanceof Error) {
    return {
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }

  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

export function createErrorResponse(error: unknown): NextResponse<ErrorResponse> {
  const errorResponse = formatErrorResponse(error);
  
  // Determine status code
  let statusCode = 500;
  if (error instanceof ZodError) {
    statusCode = 400;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

export function logError(context: string, error: unknown, metadata?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(JSON.stringify({
    timestamp,
    context,
    error: errorMessage,
    stack: errorStack,
    metadata,
  }));
}
