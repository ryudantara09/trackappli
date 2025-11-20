import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables, TablesInsert, TablesUpdate } from '../core/database/types';
import { NotFoundError } from '../utils/errors';

export type TechnicalSkill = Tables<'technical_skills'>;
export type TechnicalSkillInsert = TablesInsert<'technical_skills'>;
export type TechnicalSkillUpdate = TablesUpdate<'technical_skills'>;
export type Skill = Tables<'skills'>;

/**
 * Skills Repository
 * Handles all database operations for technical skills
 * Uses Supabase RLS for automatic user-based filtering
 */
export class SkillsRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Search for skills in the master list
   * @param query - Search query
   * @returns Array of matching skills
   */
  async search(query: string): Promise<Skill[]> {
    if (!query || query.length < 2) return [];

    const { data, error } = await this.supabase
      .from('skills')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(10);

    if (error) {
      throw new Error(`Failed to search skills: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Ensure a skill exists in the master skills table
   * @param name - Skill name
   * @param category - Optional category
   * @returns Skill ID
   */
  private async ensureSkillExists(name: string, category?: string | null): Promise<string> {
    // 1. Try to find existing skill (case-insensitive)
    const { data: existing } = await this.supabase
      .from('skills')
      .select('id')
      .ilike('name', name)
      .maybeSingle();

    if (existing) {
      return existing.id;
    }

    // 2. Create new skill if not found
    // We use upsert logic just in case of race conditions, though RLS might restrict upsert
    // So we try insert and handle error
    const { data: created, error } = await this.supabase
      .from('skills')
      .insert({ name, category })
      .select('id')
      .single();

    if (error) {
      // Handle race condition where skill was created between check and insert
      if (error.code === '23505') { // Unique violation
        const { data: retry } = await this.supabase
          .from('skills')
          .select('id')
          .ilike('name', name)
          .single();
        
        if (retry) return retry.id;
      }
      throw new Error(`Failed to create master skill: ${error.message}`);
    }

    return created.id;
  }

  /**
   * Find all technical skills for a specific user
   * @param userId - User ID to filter by
   * @returns Array of technical skills ordered by category and name
   */
  async findByUserId(userId: string): Promise<TechnicalSkill[]> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('*, skills(name, category)')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch technical skills: ${error.message}`);
    }

    // Map the joined data to the expected structure
    // We need to cast because the type definition doesn't include the joined 'skills' property
    return (data || []).map((item: any) => ({
      ...item,
      name: item.skills?.name || 'Unknown',
      category: item.skills?.category || 'OTHER',
      // Remove the nested object to keep the structure flat if needed, 
      // but keeping it is also fine. The frontend expects 'name' and 'category' at the top level.
    })).sort((a, b) => {
      // Sort by category then name
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
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
      .select('*, skills(name, category)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch technical skill: ${error.message}`);
    }

    // Map joined data
    const item = data as any;
    return {
      ...item,
      name: item.skills?.name || 'Unknown',
      category: item.skills?.category || 'OTHER',
    };
  }

  /**
   * Create a new technical skill
   * @param skill - Technical skill data to insert
   * @returns Created technical skill
   */
  async create(skill: any): Promise<TechnicalSkill> {
    // Ensure skill exists in master table and get its ID
    let skillId = skill.skill_id;
    
    if (!skillId && skill.name) {
      try {
        skillId = await this.ensureSkillExists(skill.name, skill.category);
      } catch (error) {
        console.error('Failed to ensure skill exists:', error);
        throw error;
      }
    }

    if (!skillId) {
      throw new Error('Skill ID or Name is required');
    }

    // Prepare insert data (exclude name and category)
    const insertData: TechnicalSkillInsert = {
      user_id: skill.user_id,
      skill_id: skillId,
      proficiency: skill.proficiency,
      years_of_exp: skill.years_of_exp,
      description: skill.description,
      verified: skill.verified,
    };

    const { data, error } = await this.supabase
      .from('technical_skills')
      .insert(insertData)
      .select('*, skills(name, category)')
      .single();

    if (error) {
      throw new Error(`Failed to create technical skill: ${error.message}`);
    }

    // Map joined data
    const item = data as any;
    return {
      ...item,
      name: item.skills?.name || 'Unknown',
      category: item.skills?.category || 'OTHER',
    };
  }

  /**
   * Update an existing technical skill
   * RLS ensures only the owner can update it
   * @param id - Technical skill ID
   * @param updates - Fields to update
   * @returns Updated technical skill
   */
  async update(id: string, updates: any): Promise<TechnicalSkill> {
    // If name is being updated, we might need to update the skill_id
    // But typically we don't update the skill name for an existing entry, we delete and re-add
    // However, if we want to support it:
    if (updates.name) {
       const skillId = await this.ensureSkillExists(updates.name, updates.category);
       updates.skill_id = skillId;
       // Remove name/category from updates object as they don't exist in technical_skills
       delete updates.name;
       delete updates.category;
    }

    const { data, error } = await this.supabase
      .from('technical_skills')
      .update(updates)
      .eq('id', id)
      .select('*, skills(name, category)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Technical skill');
      }
      throw new Error(`Failed to update technical skill: ${error.message}`);
    }

    // Map joined data
    const item = data as any;
    return {
      ...item,
      name: item.skills?.name || 'Unknown',
      category: item.skills?.category || 'OTHER',
    };
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
  async createBatch(skills: any[]): Promise<TechnicalSkill[]> {
    // 1. Ensure all skills exist in master table
    // We do this sequentially or in parallel. Parallel is faster but might hit race conditions on same skill.
    // For simplicity and safety, we'll do it sequentially for now, or map with Promise.all
    
    const preparedSkills: TechnicalSkillInsert[] = [];

    for (const skill of skills) {
      let skillId = skill.skill_id;
      if (!skillId && skill.name) {
        try {
          skillId = await this.ensureSkillExists(skill.name, skill.category);
        } catch (error) {
          console.error(`Failed to ensure skill exists for ${skill.name}:`, error);
          continue; // Skip this skill if we can't link it
        }
      }

      if (skillId) {
        preparedSkills.push({
          user_id: skill.user_id,
          skill_id: skillId,
          proficiency: skill.proficiency,
          years_of_exp: skill.years_of_exp,
          description: skill.description,
          verified: skill.verified,
        });
      }
    }

    if (preparedSkills.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('technical_skills')
      .insert(preparedSkills)
      .select('*, skills(name, category)');

    if (error) {
      throw new Error(`Failed to create technical skills batch: ${error.message}`);
    }

    // Map joined data
    return (data || []).map((item: any) => ({
      ...item,
      name: item.skills?.name || 'Unknown',
      category: item.skills?.category || 'OTHER',
    }));
  }

  /**
   * Find technical skills by category for a user
   * @param userId - User ID to filter by
   * @param category - Category to filter by
   * @returns Array of technical skills in the specified category
   */
  async findByCategory(userId: string, category: string): Promise<TechnicalSkill[]> {
    // We need to filter by the joined table's category
    // Supabase supports filtering on joined tables!
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('*, skills!inner(name, category)') // !inner ensures we only get rows where the join matches and filter applies
      .eq('user_id', userId)
      .eq('skills.category', category)
      .order('name', { ascending: true, foreignTable: 'skills' });

    if (error) {
      throw new Error(`Failed to fetch technical skills by category: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      ...item,
      name: item.skills?.name || 'Unknown',
      category: item.skills?.category || 'OTHER',
    }));
  }

  /**
   * Get all unique categories for a user's skills
   * @param userId - User ID to filter by
   * @returns Array of unique category names
   */
  async getCategories(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('skills(category)')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch skill categories: ${error.message}`);
    }

    // Extract unique categories
    const categories = [...new Set(data?.map((item: any) => item.skills?.category).filter(Boolean) || [])];
    return categories.sort() as string[];
  }

  /**
   * Find verified technical skills for a user
   * @param userId - User ID to filter by
   * @returns Array of verified technical skills
   */
  async findVerifiedByUserId(userId: string): Promise<TechnicalSkill[]> {
    const { data, error } = await this.supabase
      .from('technical_skills')
      .select('*, skills(name, category)')
      .eq('user_id', userId)
      .eq('verified', true);

    if (error) {
      throw new Error(`Failed to fetch verified technical skills: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      ...item,
      name: item.skills?.name || 'Unknown',
      category: item.skills?.category || 'OTHER',
    })).sort((a, b) => {
       if (a.category !== b.category) return a.category.localeCompare(b.category);
       return a.name.localeCompare(b.name);
    });
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
