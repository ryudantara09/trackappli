/**
 * Database module exports
 * 
 * This module provides type-safe database access through Supabase
 */

export { createAdminClient, createAnonClient } from './client';
export type { Database, Tables, TablesInsert, TablesUpdate } from './types';
