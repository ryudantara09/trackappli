import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/core/database/client';
import { createAdminClient } from '@/core/auth/supabase';
import { BlogService } from '@/services/blog.service';
import { createErrorResponse } from '@/utils/errors';
import { requireAuth } from '@/core/auth/middleware';
import { assertAdminUser } from '@/utils/admin';
import {
  createArticleSchema,
  getArticlesQuerySchema,
  validateQueryParams,
  validateRequestBody,
} from '@/utils/validation';

export async function GET(request: NextRequest) {
  try {
    const params = validateQueryParams(request.nextUrl.searchParams, getArticlesQuerySchema);
    const supabase = createAnonClient();
    const blogService = new BlogService(supabase);
    const articles = await blogService.listArticles({ limit: params.limit });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    assertAdminUser(auth.user);

    const body = await validateRequestBody(request, createArticleSchema);
    const supabase = createAdminClient();
    const blogService = new BlogService(supabase);

    const article = await blogService.createArticle({
      title: body.title,
      summary: body.summary ?? null,
      content: body.content,
      slug: body.slug ?? body.title,
      cover_image_url: body.coverImageUrl ?? null,
      author_id: auth.userId,
      author_name: auth.user.user_metadata?.full_name ?? auth.user.email ?? 'Admin',
      published_at: body.publishedAt ?? new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}

