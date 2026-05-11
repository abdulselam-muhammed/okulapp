"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/atoms";

interface PublicArticle {
  id: number;
  title: string;
  cover_image_url: string | null;
  content: string;
  published_at: string;
  project_id: number | null;
  project_title: string | null;
  author_first_name: string | null;
  author_last_name: string | null;
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<PublicArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setArticle(data.data);
        else router.replace("/articles");
      })
      .catch(() => router.replace("/articles"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <main className="pt-32 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!article) return null;

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      {article.cover_image_url && (
        <section className="relative h-[420px] overflow-hidden">
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 via-inverse-surface/20 to-transparent" />
        </section>
      )}

      <article className="max-w-3xl mx-auto px-6 mt-12">
        <Link href="/articles" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6 text-sm font-bold">
          <Icon name="arrow_back" /> All Articles
        </Link>

        {article.project_title && article.project_id && (
          <Link
            href={`/projects/${article.project_id}`}
            className="inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline mb-3"
          >
            From project: {article.project_title}
          </Link>
        )}

        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-12 pb-6 border-b border-outline-variant/10">
          {article.author_first_name && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary text-xs font-bold">
                {article.author_first_name.charAt(0)}{article.author_last_name?.charAt(0)}
              </div>
              <span className="font-medium">
                {article.author_first_name} {article.author_last_name}
              </span>
            </div>
          )}
          <span>{new Date(article.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</span>
        </div>

        <div className="prose prose-lg max-w-none text-on-surface leading-relaxed whitespace-pre-wrap font-body">
          {article.content}
        </div>

        {article.project_id && (
          <div className="mt-16 p-8 bg-primary-container/30 rounded-lg flex items-center justify-between gap-6">
            <div>
              <p className="font-bold text-on-surface mb-1">Want to learn more?</p>
              <p className="text-sm text-on-surface-variant">
                Explore the full project this article is part of.
              </p>
            </div>
            <Link
              href={`/projects/${article.project_id}`}
              className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 hover:bg-primary-dim transition-colors shrink-0"
            >
              View Project
              <Icon name="arrow_forward" />
            </Link>
          </div>
        )}
      </article>
    </main>
  );
}
