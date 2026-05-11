"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms";

interface PublicProject {
  id: number;
  title: string;
  description: string;
  cover_image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "upcoming" | "active" | "completed" | "cancelled";
  donation_goal: number | null;
  donation_raised: number;
  articles_count?: number;
  images_count?: number;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-secondary-container text-on-secondary-container",
  active: "bg-primary text-on-primary",
  completed: "bg-surface-container-high text-on-surface-variant",
  cancelled: "bg-error-container/30 text-on-error-container",
};

export default function ProjectsLandingPage() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects?limit=50")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
      })
      .catch(() => { /* silent */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-16 text-center">
        <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-semibold mb-3 block">
          Our Initiatives
        </span>
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-4">
          Projects
        </h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl mx-auto leading-relaxed">
          Every project tells a story of compassion and impact. Explore the initiatives we run for our campus animal community.
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <Icon name="folder_open" className="text-6xl text-on-surface-variant/30 mb-4 inline-block" />
          <p className="text-on-surface-variant">No projects yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => {
            const progress = p.donation_goal && p.donation_goal > 0
              ? Math.min(100, (Number(p.donation_raised) / Number(p.donation_goal)) * 100)
              : null;
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(0,58,40,0.04)] hover:shadow-[0_30px_60px_rgba(0,58,40,0.10)] transition-all hover:-translate-y-1"
              >
                <div className="h-52 relative bg-surface-container-low overflow-hidden">
                  {p.cover_image_url ? (
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-container/30">
                      <Icon name="folder_special" className="text-5xl text-primary/40" />
                    </div>
                  )}
                  <span className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase rounded-full ${STATUS_STYLES[p.status]}`}>
                    {p.status}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-headline text-xl font-bold text-on-surface line-clamp-2">{p.title}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>

                  {progress !== null && (
                    <div className="pt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-primary">${Number(p.donation_raised).toFixed(0)}</span>
                        <span className="text-on-surface-variant">of ${Number(p.donation_goal).toFixed(0)}</span>
                      </div>
                      <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      {(p.articles_count ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <Icon name="article" className="text-sm" />
                          {p.articles_count}
                        </span>
                      )}
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore
                      <Icon name="arrow_forward" className="text-sm" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
