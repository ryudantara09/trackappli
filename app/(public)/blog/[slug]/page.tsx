import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { createAnonClient } from '@/core/database/client';
import { BlogService } from '@/services/blog.service';
import type { BlogArticle } from '@/types/frontend.types';

async function fetchArticle(slug: string): Promise<BlogArticle | null> {
  const supabase = createAnonClient();
  const blogService = new BlogService(supabase);
  return blogService.getArticleBySlug(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) {
    return {
      title: 'Article not found | Trakaply',
    };
  }
  return {
    title: `${article.title} | Trakaply`,
    description: article.summary ?? 'Learn from Trakaply’s latest insights on the job market.',
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) {
    notFound();
  }

  return (
    <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark min-h-screen">
      <Header variant="landing" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 py-16 space-y-6">
        <p className="text-sm uppercase tracking-[0.4em] text-primary-blue">Trakaply Blog</p>
        <h1 className="text-4xl font-extrabold leading-tight">{article.title}</h1>
        <div className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">
          <span>{article.authorName ?? 'Trakaply Editorial Team'}</span>
          <span className="mx-2">•</span>
          <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        {article.coverImageUrl && (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark object-cover"
          />
        )}
        {article.summary && (
          <p className="text-lg text-neutral-gray dark:text-neutral-text-secondary-dark border-l-4 border-primary-blue pl-4">
            {article.summary}
          </p>
        )}
        <article
          className="leading-relaxed [&>p]:mb-4 [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:mt-6 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>a]:text-primary-blue"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}

