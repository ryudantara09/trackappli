/**
 * API Client Layer
 * 
 * Centralized client for all backend API communication.
 * Handles authentication, data transformation, and error handling.
 */

import { ApplicationMapper } from './data-mappers';
import { 
  FrontendApplication, 
  ApplicationFormData 
} from '../types/frontend.types';

/**
 * API Error class for client-side error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Query parameters for getApplications
 */
export interface GetApplicationsParams {
  q?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Centralized API Client
 * 
 * Provides methods for all backend API operations with:
 * - Automatic data transformation (backend ↔ frontend)
 * - Error handling and typed errors
 * - Authentication token management
 * - Type-safe request/response handling
 */
class ApiClient {
  private baseUrl = '/api';

  /**
   * Generic request method with error handling
   * 
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @returns Parsed JSON response
   * @throws ApiError on request failure
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        credentials: 'include', // Include cookies for auth
      });

      // Parse response body
      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          data.code,
          data.details
        );
      }

      return data;
    } catch (error) {
      // Re-throw ApiError as-is
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError(
          'Network error. Please check your connection.',
          0,
          'NETWORK_ERROR'
        );
      }

      // Handle other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        500,
        'UNKNOWN_ERROR'
      );
    }
  }

  /**
   * GET /api/applications
   * 
   * Fetch user's applications with optional filtering
   * 
   * @param params - Query parameters for filtering and pagination
   * @returns Array of frontend-formatted applications
   * @throws ApiError on request failure
   */
  async getApplications(params?: GetApplicationsParams): Promise<FrontendApplication[]> {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.q) queryParams.append('q', params.q);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/applications?${queryString}` : '/applications';

    // Make request
    const response = await this.request<{ success: boolean; data: any[] }>(endpoint);

    // Transform backend data to frontend format
    return ApplicationMapper.toFrontendArray(response.data);
  }

  /**
   * GET /api/applications/:id
   * 
   * Fetch a single application by ID
   * 
   * @param id - Application ID
   * @returns Frontend-formatted application
   * @throws ApiError on request failure or not found
   */
  async getApplication(id: string): Promise<FrontendApplication> {
    const response = await this.request<{ success: boolean; data: any }>(
      `/applications/${id}`
    );

    // Transform backend data to frontend format
    return ApplicationMapper.toFrontend(response.data);
  }

  /**
   * POST /api/applications
   * 
   * Create a new application
   * 
   * @param data - Application form data
   * @returns Created application in frontend format
   * @throws ApiError on validation error or request failure
   */
  async createApplication(data: ApplicationFormData): Promise<FrontendApplication> {
    // Transform frontend data to backend format
    const backendData = ApplicationMapper.toBackend(data);

    // Make request
    const response = await this.request<{ success: boolean; data: any }>(
      '/applications',
      {
        method: 'POST',
        body: JSON.stringify(backendData),
      }
    );

    // Transform backend response to frontend format
    return ApplicationMapper.toFrontend(response.data);
  }

  /**
   * PUT /api/applications/:id
   * 
   * Update an existing application
   * 
   * @param id - Application ID
   * @param data - Partial application data to update
   * @returns Updated application in frontend format
   * @throws ApiError on validation error, not found, or request failure
   */
  async updateApplication(
    id: string,
    data: Partial<ApplicationFormData>
  ): Promise<FrontendApplication> {
    // Transform frontend data to backend format
    const backendData = ApplicationMapper.toBackend(data);

    // Make request
    const response = await this.request<{ success: boolean; data: any }>(
      `/applications/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(backendData),
      }
    );

    // Transform backend response to frontend format
    return ApplicationMapper.toFrontend(response.data);
  }

  /**
   * DELETE /api/applications/:id
   * 
   * Delete an application
   * 
   * @param id - Application ID
   * @throws ApiError on not found or request failure
   */
  async deleteApplication(id: string): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/applications/${id}`,
      {
        method: 'DELETE',
      }
    );
  }
}

/**
 * Singleton API client instance
 * 
 * Import and use this instance throughout the application:
 * 
 * ```typescript
 * import { apiClient } from '@/lib/api-client';
 * 
 * const applications = await apiClient.getApplications();
 * ```
 */
export const apiClient = new ApiClient();
