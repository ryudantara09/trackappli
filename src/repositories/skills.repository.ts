import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables, TablesInsert, TablesUpdate } from '../core/database/types';
import { NotFoundError } from '../utils/errors';

export type TechnicalSkill = Tables<'technical_skills'>;
export type TechnicalSkillInsert = TablesInsert<'technical_skills'>;
export type TechnicalSkillUpdate = TablesUpdate<'technical_skills'>;

/**
 * Skills Repository
 * Handles all database operations for technical skills
 * Uses Supabase RLS for automatic user-based filtering
 */
export class SkillsRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Find all technical skills for a specific user
   * @param userId - User ID to filter by
   * @returns Array of technical skills ordered by category and name
   */
  async findByUserId(userId: string): Promise<TechnicalSkill[]> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('*')
      .eq('user_id', userId)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch technical skills: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find a single technical skill by ID
   * RLS ensures only the owner can access it
   * @param id - Technical skill ID
   * @returns Technical skill or null if not found
   */
  async findById(id: string): Promise<TechnicalSkill | null> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch technical skill: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new technical skill
   * @param skill - Technical skill data to insert
   * @returns Created technical skill
   */
  async create(skill: TechnicalSkillInsert): Promise<TechnicalSkill> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .insert(skill)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create technical skill: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing technical skill
   * RLS ensures only the owner can update it
   * @param id - Technical skill ID
   * @param updates - Fields to update
   * @returns Updated technical skill
   */
  async update(id: string, updates: TechnicalSkillUpdate): Promise<TechnicalSkill> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Technical skill');
      }
      throw new Error(`Failed to update technical skill: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a technical skill
   * RLS ensures only the owner can delete it
   * @param id - Technical skill ID
   * @returns True if deleted successfully
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('technical_skills')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete technical skill: ${error.message}`);
    }

    return true;
  }

  /**
   * Create multiple technical skills in a batch
   * Useful for CV import functionality
   * @param skills - Array of technical skill data to insert
   * @returns Array of created technical skills
   */
  async createBatch(skills: TechnicalSkillInsert[]): Promise<TechnicalSkill[]> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .insert(skills)
      .select();

    if (error) {
      throw new Error(`Failed to create technical skills batch: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find technical skills by category for a user
   * @param userId - User ID to filter by
   * @param category - Category to filter by
   * @returns Array of technical skills in the specified category
   */
  async findByCategory(userId: string, category: string): Promise<TechnicalSkill[]> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch technical skills by category: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get all unique categories for a user's skills
   * @param userId - User ID to filter by
   * @returns Array of unique category names
   */
  async getCategories(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('category')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch skill categories: ${error.message}`);
    }

    // Extract unique categories
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return categories.sort();
  }

  /**
   * Find verified technical skills for a user
   * @param userId - User ID to filter by
   * @returns Array of verified technical skills
   */
  async findVerifiedByUserId(userId: string): Promise<TechnicalSkill[]> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('*')
      .eq('user_id', userId)
      .eq('verified', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch verified technical skills: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Delete all technical skills for a specific user
   * @param userId - User ID to delete skills for
   */
  async deleteAllForUser(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('technical_skills')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete technical skills: ${error.message}`);
    }
  }
}
