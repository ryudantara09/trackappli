import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createAnonClient } from '@/core/database/client';
import { BlogService } from '@/services/blog.service';
import type { BlogArticle } from '@/types/frontend.types';
import { CalendarIcon, UserIcon, ClockIcon } from '@/components/ui/Icon';

async function fetchArticle(slug: string): Promise<BlogArticle | null> {
  const supabase = createAnonClient();
  const blogService = new BlogService(supabase);
  return blogService.getArticleBySlug(slug);
}

// Calculate reading time based on word count
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  
  if (!article) {
    return {
      title: 'Article not found | Trakaply Blog',
      description: 'The requested article could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trakaply.com';
  const articleUrl = `${siteUrl}/blog/${slug}`;
  const imageUrl = article.coverImageUrl || `${siteUrl}/Logos/trakaply-blue.svg`;

  return {
    title: `${article.title} | Trakaply Blog`,
    description: article.summary || 'Insights on job tracking, career management, and professional development.',
    keywords: article.tags?.join(', ') || 'job tracking, career tips, professional development',
    authors: [{ name: article.authorName || 'Trakaply Editorial Team' }],
    creator: 'Trakaply',
    publisher: 'Trakaply',
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: articleUrl,
      title: article.title,
      description: article.summary || undefined,
      siteName: 'Trakaply Blog',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authorName || 'Trakaply Editorial Team'],
      tags: article.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || undefined,
      images: [imageUrl],
      creator: '@trakaply',
    },
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  
  if (!article) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trakaply.com';
  const articleUrl = `${siteUrl}/blog/${slug}`;
  const readingTime = calculateReadingTime(article.content);
  const publishedDate = new Date(article.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.summary,
    image: article.coverImageUrl || `${siteUrl}/Logos/trakaply-blue.svg`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: article.authorName || 'Trakaply Editorial Team',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Trakaply',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/Logos/trakaply-blue.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: article.tags?.join(', '),
    articleSection: 'Career Development',
    wordCount: article.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="flex flex-col min-h-screen bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
        <Header variant="landing" />
        
        {/* Hero Section with Cover Image */}
        <div className="relative bg-gradient-to-b from-blue-50 dark:from-blue-900/10 to-transparent pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
              <a href="/" className="text-primary-blue hover:underline">Home</a>
              <span className="mx-2 text-neutral-gray">/</span>
              <a href="/blog" className="text-primary-blue hover:underline">Blog</a>
              <span className="mx-2 text-neutral-gray">/</span>
              <span className="text-neutral-gray dark:text-neutral-text-secondary-dark">{article.title}</span>
            </nav>

            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-blue bg-blue-100 dark:bg-blue-900/30 rounded-full">
                Career Insights
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {article.title}
            </h1>

            {/* Summary */}
            {article.summary && (
              <p className="text-xl text-neutral-gray dark:text-neutral-text-secondary-dark leading-relaxed mb-8 max-w-3xl">
                {article.summary}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">{article.authorName || 'Trakaply Editorial Team'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <time dateTime={article.publishedAt}>{formattedDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImageUrl && (
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 -mt-8 mb-12">
            <div className="w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl border border-neutral-border-light dark:border-neutral-border-dark">
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pb-16">
          <article
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-neutral-text-primary-light dark:prose-headings:text-neutral-text-primary-dark
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-neutral-text-primary-light dark:prose-p:text-neutral-text-primary-dark prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary-blue prose-a:no-underline hover:prose-a:underline
              prose-strong:text-neutral-text-primary-light dark:prose-strong:text-neutral-text-primary-dark prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-neutral-text-primary-light dark:prose-li:text-neutral-text-primary-dark prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-primary-blue prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-neutral-gray dark:prose-blockquote:text-neutral-text-secondary-dark
              prose-code:text-primary-blue prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-neutral-surface-light dark:prose-pre:bg-neutral-surface-dark prose-pre:border prose-pre:border-neutral-border-light dark:prose-pre:border-neutral-border-dark prose-pre:rounded-xl
              prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-border-light dark:border-neutral-border-dark">
              <h3 className="text-sm font-semibold text-neutral-gray dark:text-neutral-text-secondary-dark uppercase tracking-wider mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-sm font-medium bg-neutral-surface-light dark:bg-neutral-surface-dark border border-neutral-border-light dark:border-neutral-border-dark rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-neutral-border-light dark:border-neutral-border-dark">
            <h3 className="text-sm font-semibold text-neutral-gray dark:text-neutral-text-secondary-dark uppercase tracking-wider mb-4">
              Share this article
            </h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-surface-light dark:bg-neutral-surface-dark border border-neutral-border-light dark:border-neutral-border-dark hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-surface-light dark:bg-neutral-surface-dark border border-neutral-border-light dark:border-neutral-border-dark hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

