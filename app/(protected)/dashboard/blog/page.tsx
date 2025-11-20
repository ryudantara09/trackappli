'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { slugify } from '@/utils/slugify';
import type { BlogArticle } from '@/types/frontend.types';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ArticleFormState {
  title: string;
  slug: string;
  summary: string;
  coverImageUrl: string;
  content: string;
  publishedAt: string;
}

const initialFormState = (): ArticleFormState => ({
  title: '',
  slug: '',
  summary: '',
  coverImageUrl: '',
  content: '',
  publishedAt: new Date().toISOString().slice(0, 16),
});

export default function BlogAdminPage() {
  const { isAdmin, user } = useAuth();
  const { showSuccess, showError } = useToastContext();
  const [form, setForm] = useState<ArticleFormState>(initialFormState);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const authorLabel = useMemo(
    () => user?.user_metadata?.full_name || user?.email || 'Admin',
    [user]
  );

  useEffect(() => {
    if (!isAdmin) return;
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/blog?limit=50');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const payload = await response.json();
        setArticles(Array.isArray(payload?.data) ? payload.data : []);
      } catch (error) {
        showError('Unable to load articles');
        if (process.env.NODE_ENV === 'development') {
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [isAdmin, showError]);

  const resetForm = () => {
    setForm(initialFormState());
    setEditingSlug(null);
  };

  const handleInputChange = (field: keyof ArticleFormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !editingSlug) {
        next.slug = slugify(value);
      }
      if (field === 'slug') {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: form.title,
        summary: form.summary || undefined,
        slug: form.slug || undefined,
        coverImageUrl: form.coverImageUrl || undefined,
        content: form.content,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
        authorName: authorLabel,
      };

      const url = editingSlug ? `/api/blog/${editingSlug}` : '/api/blog';
      const method = editingSlug ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      showSuccess(editingSlug ? 'Article updated' : 'Article published');
      resetForm();
      const data = await response.json();
      setArticles((prev) => {
        const remaining = prev.filter((article) => article.slug !== editingSlug);
        if (data?.data) {
          return editingSlug ? [data.data, ...remaining] : [data.data, ...prev];
        }
        return prev;
      });
    } catch (error) {
      showError('Unable to save article');
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (article: BlogArticle) => {
    setEditingSlug(article.slug);
    setForm({
      title: article.title,
      slug: article.slug,
      summary: article.summary ?? '',
      coverImageUrl: article.coverImageUrl ?? '',
      content: article.content,
      publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    });
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const response = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      showSuccess('Article deleted');
      setArticles((prev) => prev.filter((article) => article.slug !== slug));
      if (editingSlug === slug) {
        resetForm();
      }
    } catch (error) {
      showError('Unable to delete article');
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto rounded-xl border border-neutral-border-light dark:border-neutral-border-dark bg-white dark:bg-neutral-surface-dark p-10 text-center">
          <h1 className="text-2xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-3">
            Admin Access Required
          </h1>
          <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">
            You need administrative privileges to manage blog content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
      <PageHeader 
        badge="Blog Studio"
        title="Publish homepage-worthy insights"
        description="Articles added here sync directly to the homepage spotlight. Write rich content, schedule publish times, and keep your community updated."
      >
        <Button variant="secondary" onClick={resetForm}>
          New Draft
        </Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark bg-white dark:bg-neutral-surface-dark p-6 space-y-4"
        >
          <div>
            <label className="text-sm font-medium block mb-1">Title</label>
            <input
              type="text"
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-lg px-3 py-2 bg-white dark:bg-neutral-bg-dark"
              value={form.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Slug</label>
              <input
                type="text"
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-lg px-3 py-2 bg-white dark:bg-neutral-bg-dark"
                value={form.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Publish Date</label>
              <input
                type="datetime-local"
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-lg px-3 py-2 bg-white dark:bg-neutral-bg-dark"
                value={form.publishedAt}
                onChange={(e) => handleInputChange('publishedAt', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Summary</label>
            <textarea
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-lg px-3 py-2 bg-white dark:bg-neutral-bg-dark"
              rows={3}
              value={form.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Short teaser that appears on the homepage"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Cover Image URL</label>
            <input
              type="url"
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-lg px-3 py-2 bg-white dark:bg-neutral-bg-dark"
              value={form.coverImageUrl}
              onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Content</label>
            <div className="border border-neutral-border-light dark:border-neutral-border-dark rounded-lg overflow-hidden bg-white dark:bg-neutral-bg-dark">
              <ReactQuill theme="snow" value={form.content} onChange={(value) => handleInputChange('content', value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingSlug ? 'Update Article' : 'Publish Article'}
            </Button>
            {editingSlug && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </form>

        <div className="rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark bg-white dark:bg-neutral-surface-dark p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Published Articles</h2>
            <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">
              Click an article to edit or remove it from the homepage.
            </p>
          </div>
          {isLoading ? (
            <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">Loading articles…</p>
          ) : articles.length === 0 ? (
            <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">No articles yet. Create your first insight!</p>
          ) : (
            <ul className="space-y-3">
              {articles.map((article) => (
                <li
                  key={article.slug}
                  className="border border-neutral-border-light dark:border-neutral-border-dark rounded-xl px-4 py-3 hover:border-primary-blue/60 transition cursor-pointer"
                  onClick={() => handleEdit(article)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{article.title}</p>
                      <p className="text-xs text-neutral-gray dark:text-neutral-text-secondary-dark">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(article.slug);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

