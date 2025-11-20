import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables, TablesInsert, TablesUpdate } from '../core/database/types';
import { NotFoundError } from '../utils/errors';

export type WorkExperience = Tables<'work_experience'>;
export type WorkExperienceInsert = TablesInsert<'work_experience'>;
export type WorkExperienceUpdate = TablesUpdate<'work_experience'>;

/**
 * Work Experience Repository
 * Handles all database operations for work experience entries
 * Uses Supabase RLS for automatic user-based filtering
 */
export class ExperienceRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Find all work experience entries for a specific user
   * @param userId - User ID to filter by
   * @returns Array of work experience entries ordered by start date (most recent first)
   */
  async findByUserId(userId: string): Promise<WorkExperience[]> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch work experience: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find a single work experience entry by ID
   * RLS ensures only the owner can access it
   * @param id - Work experience ID
   * @returns Work experience entry or null if not found
   */
  async findById(id: string): Promise<WorkExperience | null> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch work experience: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new work experience entry
   * @param experience - Work experience data to insert
   * @returns Created work experience entry
   */
  async create(experience: WorkExperienceInsert): Promise<WorkExperience> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .insert(experience)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create work experience: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing work experience entry
   * RLS ensures only the owner can update it
   * @param id - Work experience ID
   * @param updates - Fields to update
   * @returns Updated work experience entry
   */
  async update(id: string, updates: WorkExperienceUpdate): Promise<WorkExperience> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Work experience');
      }
      throw new Error(`Failed to update work experience: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a work experience entry
   * RLS ensures only the owner can delete it
   * @param id - Work experience ID
   * @returns True if deleted successfully
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('work_experience')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete work experience: ${error.message}`);
    }

    return true;
  }

  /**
   * Create multiple work experience entries in a batch
   * Useful for CV import functionality
   * @param experiences - Array of work experience data to insert
   * @returns Array of created work experience entries
   */
  async createBatch(experiences: WorkExperienceInsert[]): Promise<WorkExperience[]> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .insert(experiences)
      .select();

    if (error) {
      throw new Error(`Failed to create work experience batch: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get current work experience entries for a user
   * @param userId - User ID to filter by
   * @returns Array of current work experience entries
   */
  async findCurrentByUserId(userId: string): Promise<WorkExperience[]> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', userId)
      .eq('current', true)
      .order('start_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch current work experience: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Delete all work experience entries for a specific user
   * @param userId - User ID to delete entries for
   */
  async deleteAllForUser(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('work_experience')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete work experience: ${error.message}`);
    }
  }
}
