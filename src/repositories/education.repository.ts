import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables, TablesInsert, TablesUpdate } from '../core/database/types';
import { NotFoundError } from '../utils/errors';

export type Education = Tables<'education'>;
export type EducationInsert = TablesInsert<'education'>;
export type EducationUpdate = TablesUpdate<'education'>;

/**
 * Education Repository
 * Handles all database operations for education entries
 * Uses Supabase RLS for automatic user-based filtering
 */
export class EducationRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Find all education entries for a specific user
   * @param userId - User ID to filter by
   * @returns Array of education entries ordered by start date (most recent first)
   */
  async findByUserId(userId: string): Promise<Education[]> {
    const { data, error } = await this.supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch education: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find a single education entry by ID
   * RLS ensures only the owner can access it
   * @param id - Education ID
   * @returns Education entry or null if not found
   */
  async findById(id: string): Promise<Education | null> {
    const { data, error } = await this.supabase
      .from('education')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch education: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new education entry
   * @param education - Education data to insert
   * @returns Created education entry
   */
  async create(education: EducationInsert): Promise<Education> {
    const { data, error } = await this.supabase
      .from('education')
      .insert(education)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create education: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing education entry
   * RLS ensures only the owner can update it
   * @param id - Education ID
   * @param updates - Fields to update
   * @returns Updated education entry
   */
  async update(id: string, updates: EducationUpdate): Promise<Education> {
    const { data, error } = await this.supabase
      .from('education')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Education');
      }
      throw new Error(`Failed to update education: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete an education entry
   * RLS ensures only the owner can delete it
   * @param id - Education ID
   * @returns True if deleted successfully
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('education')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete education: ${error.message}`);
    }

    return true;
  }

  /**
   * Create multiple education entries in a batch
   * Useful for CV import functionality
   * @param educations - Array of education data to insert
   * @returns Array of created education entries
   */
  async createBatch(educations: EducationInsert[]): Promise<Education[]> {
    const { data, error } = await this.supabase
      .from('education')
      .insert(educations)
      .select();

    if (error) {
      throw new Error(`Failed to create education batch: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get current education entries for a user (still studying)
   * @param userId - User ID to filter by
   * @returns Array of current education entries
   */
  async findCurrentByUserId(userId: string): Promise<Education[]> {
    const { data, error } = await this.supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .eq('current', true)
      .order('start_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch current education: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Delete all education entries for a specific user
   * @param userId - User ID to delete entries for
   */
  async deleteAllForUser(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('education')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete education: ${error.message}`);
    }
  }
}
