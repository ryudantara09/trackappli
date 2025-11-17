import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables, TablesInsert, TablesUpdate } from '../core/database/types';
import { NotFoundError } from '../utils/errors';

export type Application = Tables<'applications'>;
export type ApplicationInsert = TablesInsert<'applications'>;
export type ApplicationUpdate = TablesUpdate<'applications'>;

export interface ApplicationSearchParams {
  query?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Applications Repository
 * Handles all database operations for job applications
 * Uses Supabase RLS for automatic user-based filtering
 */
export class ApplicationsRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Find all applications for a specific user
   * @param userId - User ID to filter by
   * @param params - Optional search and filter parameters
   * @returns Array of applications
   */
  async findByUserId(
    userId: string,
    params?: ApplicationSearchParams
  ): Promise<Application[]> {
    let query = this.supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });

    // Apply search filter if query provided
    if (params?.query) {
      const searchTerm = `%${params.query}%`;
      query = query.or(
        `position_title.ilike.${searchTerm},company_name.ilike.${searchTerm},job_location.ilike.${searchTerm}`
      );
    }

    // Apply status filter if provided
    if (params?.status) {
      query = query.eq('status', params.status);
    }

    // Apply pagination
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find a single application by ID
   * RLS ensures only the owner can access it
   * @param id - Application ID
   * @returns Application or null if not found
   */
  async findById(id: number): Promise<Application | null> {
    const { data, error } = await this.supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch application: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new application
   * @param application - Application data to insert
   * @returns Created application
   */
  async create(application: ApplicationInsert): Promise<Application> {
    const { data, error } = await this.supabase
      .from('applications')
      .insert(application)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create application: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing application
   * RLS ensures only the owner can update it
   * @param id - Application ID
   * @param updates - Fields to update
   * @returns Updated application
   */
  async update(id: number, updates: ApplicationUpdate): Promise<Application> {
    const { data, error } = await this.supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Application');
      }
      throw new Error(`Failed to update application: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete an application
   * RLS ensures only the owner can delete it
   * @param id - Application ID
   * @returns True if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete application: ${error.message}`);
    }

    return true;
  }

  /**
   * Search applications with advanced filtering
   * @param userId - User ID to filter by
   * @param params - Search parameters
   * @returns Array of matching applications
   */
  async search(
    userId: string,
    params: ApplicationSearchParams
  ): Promise<Application[]> {
    return this.findByUserId(userId, params);
  }

  /**
   * Count total applications for a user
   * @param userId - User ID
   * @param status - Optional status filter
   * @returns Total count
   */
  async count(userId: string, status?: string): Promise<number> {
    let query = this.supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to count applications: ${error.message}`);
    }

    return count || 0;
  }
}
