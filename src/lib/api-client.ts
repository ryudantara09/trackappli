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
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Centralized API Client
 * 
 * Provides methods for all backend API operations with:
 * - Automatic data transformation (backend ↔ frontend)
 * - Error handling and typed errors
 * - Authentication token management
 * - Type-safe request/response handling
 * - Response caching for improved performance
 */
class ApiClient {
  private baseUrl = '/api';
  private cache = new Map<string, CacheEntry<any>>();
  private defaultCacheTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data if available and not expired
   * 
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache is expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache entry
   * 
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (optional)
   */
  private setCache<T>(key: string, data: T, ttl?: number): void {
    const cacheTTL = ttl ?? this.defaultCacheTTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + cacheTTL,
    };
    this.cache.set(key, entry);
  }

  /**
   * Clear cache for a specific key or all cache
   * 
   * @param key - Cache key (optional, clears all if not provided)
   */
  public clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Generic request method with error handling
   * 
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @param useCache - Whether to use cache for GET requests
   * @returns Parsed JSON response
   * @throws ApiError on request failure
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
    useCache: boolean = true
  ): Promise<T> {
    // Check cache for GET requests
    const method = options?.method?.toUpperCase() || 'GET';
    const cacheKey = `${method}:${endpoint}`;
    
    if (method === 'GET' && useCache) {
      const cached = this.getCached<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

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

      // Cache successful GET requests
      if (method === 'GET' && useCache) {
        this.setCache(cacheKey, data);
      }

      // Invalidate cache on mutations
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        // Clear all application-related cache
        this.clearCache('GET:/applications');
        // Clear specific application cache if ID is in endpoint
        const idMatch = endpoint.match(/\/applications\/(\d+)/);
        if (idMatch) {
          this.clearCache(`GET:/applications/${idMatch[1]}`);
        }
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
