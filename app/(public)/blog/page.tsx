import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createAnonClient } from '@/core/database/client';
import { BlogService } from '@/services/blog.service';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Blog | trakappli',
  description: 'Latest insights on the job market, career coaching, and education technology.',
};

async function fetchArticles() {
  try {
    const supabase = createAnonClient();
    const blogService = new BlogService(supabase);
    return await blogService.listArticles({ limit: 50 });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}

export default async function BlogPage() {
  const articles = await fetchArticles();

  return (
    <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark min-h-screen flex flex-col">
      <Header variant="landing" />
      
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 bg-primary-light text-primary-dark dark:bg-white/10 dark:text-primary-light">
            Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            Latest Insights
          </h1>
          <p className="mt-4 text-lg text-neutral-gray dark:text-neutral-text-secondary-dark">
            Expert advice on job tracking, career development, and the future of work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark bg-white dark:bg-neutral-surface-dark overflow-hidden hover:shadow-lg transition-shadow"
            >
              {article.coverImageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.coverImageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-gray dark:text-neutral-text-secondary-dark mb-2">
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    <Link href={`/blog/${article.slug}`} className="hover:text-primary-blue transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-neutral-gray dark:text-neutral-text-secondary-dark line-clamp-3 text-sm">
                    {article.summary}
                  </p>
                </div>
                <div className="mt-auto pt-4">
                  <Button as="a" href={`/blog/${article.slug}`} variant="secondary" size="small" className="w-full justify-center">
                    Read Article
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-neutral-gray dark:text-neutral-text-secondary-dark">No articles found.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
