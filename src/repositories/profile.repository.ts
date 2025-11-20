import { SupabaseClient } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  summary: string | null;
  website: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  avatar_url: string | null;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Profile Repository
 * Handles database operations for user profiles
 */
export class ProfileRepository {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Find profile by user ID
   */
  async findById(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new profile
   */
  async create(profile: ProfileInsert): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing profile
   */
  async update(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Upsert profile (create or update)
   */
  async upsert(profile: ProfileInsert): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete profile
   */
  async delete(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }
}
