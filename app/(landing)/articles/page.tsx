"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function ArticlesLandingPage() {
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?limit=50")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setArticles(data.data);
      })
      .catch(() => { /* silent */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-16 text-center">
        <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-semibold mb-3 block">
          Stories & Updates
        </span>
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-4">
          Articles
        </h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl mx-auto leading-relaxed">
          Stories from our projects — rescues, milestones, and the people behind them.
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <Icon name="article" className="text-6xl text-on-surface-variant/30 mb-4 inline-block" />
          <p className="text-on-surface-variant">No articles yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.id}`}
              className="group bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(0,58,40,0.04)] hover:shadow-[0_30px_60px_rgba(0,58,40,0.10)] transition-all hover:-translate-y-1"
            >
              <div className="h-52 relative bg-surface-container-low overflow-hidden">
                {a.cover_image_url ? (
                  <img
                    src={a.cover_image_url}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary-container/40">
                    <Icon name="article" className="text-5xl text-secondary/40" />
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3">
                {a.project_title && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary">
                    From: {a.project_title}
                  </span>
                )}
                <h3 className="font-headline text-xl font-bold text-on-surface line-clamp-2">{a.title}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                  {a.content.slice(0, 160)}
                  {a.content.length > 160 && "..."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                  <div className="text-xs text-on-surface-variant">
                    {a.author_first_name && (
                      <span>
                        {a.author_first_name} {a.author_last_name}
                        {" · "}
                      </span>
                    )}
                    {new Date(a.published_at).toLocaleDateString()}
                  </div>
                  <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read
                    <Icon name="arrow_forward" className="text-sm" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
