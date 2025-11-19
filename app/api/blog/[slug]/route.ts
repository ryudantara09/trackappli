import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/core/database/client';
import { createAdminClient } from '@/core/auth/supabase';
import { BlogService } from '@/services/blog.service';
import { createErrorResponse, NotFoundError } from '@/utils/errors';
import { requireAuth } from '@/core/auth/middleware';
import { assertAdminUser } from '@/utils/admin';
import { updateArticleSchema, validateRequestBody } from '@/utils/validation';

interface RouteParams {
  slug: string;
}

async function getArticleOrThrow(slug: string) {
  const supabase = createAnonClient();
  const blogService = new BlogService(supabase);
  const article = await blogService.getArticleBySlug(slug);
  if (!article) {
    throw new NotFoundError('Article');
  }
  return article;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const article = await getArticleOrThrow(params.slug);
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const auth = await requireAuth();
    assertAdminUser(auth.user);

    const payload = await validateRequestBody(request, updateArticleSchema);
    const supabase = createAdminClient();
    const blogService = new BlogService(supabase);

    const article = await blogService.updateArticle(params.slug, {
      title: payload.title,
      summary: payload.summary ?? null,
      content: payload.content,
      cover_image_url: payload.coverImageUrl ?? null,
      slug: payload.slug,
      author_id: auth.userId,
      author_name: payload.authorName ?? auth.user.user_metadata?.full_name ?? auth.user.email ?? 'Admin',
      published_at: payload.publishedAt ?? undefined,
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const auth = await requireAuth();
    assertAdminUser(auth.user);

    const supabase = createAdminClient();
    const blogService = new BlogService(supabase);
    await blogService.deleteArticle(params.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}

