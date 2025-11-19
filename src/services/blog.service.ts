import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/core/database/types';
import type { TablesInsert, TablesUpdate } from '@/core/database/types';
import { slugify } from '@/utils/slugify';
import { BlogArticle } from '@/types/frontend.types';
import { NotFoundError } from '@/utils/errors';

type ArticleRow = Database['public']['Tables']['articles']['Row'];

interface ListArticlesOptions {
  limit?: number;
  includeDrafts?: boolean;
}

export class BlogService {
  constructor(private supabase: SupabaseClient<Database>) {}

  private mapRowToArticle(row: ArticleRow): BlogArticle {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.summary ?? undefined,
      coverImageUrl: row.cover_image_url ?? undefined,
      content: row.content,
      authorId: row.author_id ?? undefined,
      authorName: row.author_name ?? undefined,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async listArticles(options: ListArticlesOptions = {}) {
    const { limit = 10 } = options;
    const query = this.supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row) => this.mapRowToArticle(row));
  }

  async getArticleBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return this.mapRowToArticle(data);
  }

  async createArticle(payload: TablesInsert<'articles'>) {
    const slug = await this.generateUniqueSlug(payload.slug ?? payload.title);
    const { data, error } = await this.supabase
      .from('articles')
      .insert({
        ...payload,
        slug,
      })
      .select('*')
      .single();

    if (error) throw error;
    return this.mapRowToArticle(data);
  }

  async updateArticle(slug: string, updates: TablesUpdate<'articles'>) {
    const existing = await this.getArticleRowBySlug(slug);
    const nextSlug =
      updates.slug && updates.slug !== existing.slug
        ? await this.generateUniqueSlug(updates.slug, existing.id)
        : undefined;

    const { data, error } = await this.supabase
      .from('articles')
      .update({
        ...updates,
        slug: nextSlug ?? updates.slug,
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) throw error;
    return this.mapRowToArticle(data);
  }

  async deleteArticle(slug: string) {
    const existing = await this.getArticleRowBySlug(slug);
    const { error } = await this.supabase.from('articles').delete().eq('id', existing.id);
    if (error) throw error;
    return true;
  }

  private async getArticleRowBySlug(slug: string): Promise<ArticleRow> {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new NotFoundError('Article');
    }
    return data;
  }

  private async generateUniqueSlug(desiredSlug: string, excludeId?: string) {
    const base = slugify(desiredSlug);
    let candidate = base;
    let attempt = 1;

    while (attempt < 10) {
      const { data, error } = await this.supabase
        .from('articles')
        .select('id')
        .eq('slug', candidate)
        .maybeSingle();

      if (error) throw error;
      if (!data || data.id === excludeId) {
        return candidate;
      }

      candidate = `${base}-${attempt}`;
      attempt += 1;
    }

    return `${base}-${Date.now()}`;
  }
}

