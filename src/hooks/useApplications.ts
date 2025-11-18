/**
 * useApplications Hook
 * 
 * Custom hook for managing application data with CRUD operations.
 * Handles data fetching, caching, and state management for applications.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from '../lib/api-client';
import { FrontendApplication, ApplicationFormData } from '../types/frontend.types';

/**
 * Filter parameters for applications
 */
export interface ApplicationFilters {
  q?: string;
  status?: string;
}

/**
 * Hook return type
 */
export interface UseApplicationsReturn {
  applications: FrontendApplication[];
  loading: boolean;
  error: string | null;
  addApplication: (data: ApplicationFormData) => Promise<FrontendApplication>;
  updateApplication: (id: string, data: Partial<ApplicationFormData>) => Promise<FrontendApplication>;
  deleteApplication: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for managing applications
 * 
 * @param filters - Optional filters for search and status
 * @returns Application data and CRUD operations
 * 
 * @example
 * ```tsx
 * const { applications, loading, addApplication } = useApplications();
 * 
 * const handleAdd = async (data) => {
 *   try {
 *     await addApplication(data);
 *   } catch (error) {
 *     console.error('Failed to add application:', error);
 *   }
 * };
 * ```
 */
export function useApplications(filters?: ApplicationFilters): UseApplicationsReturn {
  const [applications, setApplications] = useState<FrontendApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load applications from API
   */
  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiClient.getApplications(filters);
      setApplications(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Failed to load applications';
      setError(errorMessage);
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  }, [filters?.q, filters?.status]);

  /**
   * Load applications on mount and when filters change
   */
  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  /**
   * Add a new application
   * 
   * @param data - Application form data
   * @returns Created application
   * @throws ApiError on validation or request failure
   */
  const addApplication = async (data: ApplicationFormData): Promise<FrontendApplication> => {
    try {
      const newApp = await apiClient.createApplication(data);
      
      // Optimistically update local state
      setApplications(prev => [newApp, ...prev]);
      
      return newApp;
    } catch (err) {
      console.error('Error adding application:', err);
      throw err;
    }
  };

  /**
   * Update an existing application
   * 
   * @param id - Application ID
   * @param data - Partial application data to update
   * @returns Updated application
   * @throws ApiError on validation, not found, or request failure
   */
  const updateApplication = async (
    id: string, 
    data: Partial<ApplicationFormData>
  ): Promise<FrontendApplication> => {
    try {
      const updated = await apiClient.updateApplication(id, data);
      
      // Optimistically update local state
      setApplications(prev =>
        prev.map(app => (app.id === id ? updated : app))
      );
      
      return updated;
    } catch (err) {
      console.error('Error updating application:', err);
      throw err;
    }
  };

  /**
   * Delete an application
   * 
   * @param id - Application ID
   * @throws ApiError on not found or request failure
   */
  const deleteApplication = async (id: string): Promise<void> => {
    try {
      await apiClient.deleteApplication(id);
      
      // Optimistically update local state
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      console.error('Error deleting application:', err);
      throw err;
    }
  };

  /**
   * Refresh applications from API
   */
  const refresh = async (): Promise<void> => {
    await loadApplications();
  };

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    refresh,
  };
}
