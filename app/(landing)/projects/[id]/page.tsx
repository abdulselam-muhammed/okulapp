"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/atoms";

interface ProjectImage {
  id: number;
  image_url: string;
  caption: string | null;
}

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
  created_at: string;
  images?: ProjectImage[];
}

interface ArticlePreview {
  id: number;
  title: string;
  cover_image_url: string | null;
  published_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-secondary-container text-on-secondary-container",
  active: "bg-primary text-on-primary",
  completed: "bg-surface-container-high text-on-surface-variant",
  cancelled: "bg-error-container/30 text-on-error-container",
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [articles, setArticles] = useState<ArticlePreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/articles?project_id=${id}`).then((r) => r.json()),
    ])
      .then(([projectRes, articlesRes]) => {
        if (projectRes.success) setProject(projectRes.data);
        else router.replace("/projects");
        if (articlesRes.success) setArticles(articlesRes.data);
      })
      .catch(() => router.replace("/projects"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <main className="pt-32 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!project) return null;

  const progress = project.donation_goal && project.donation_goal > 0
    ? Math.min(100, (Number(project.donation_raised) / Number(project.donation_goal)) * 100)
    : null;

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative h-[480px] overflow-hidden">
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary-container" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link href="/projects" className="inline-flex items-center gap-2 text-on-primary/80 hover:text-on-primary mb-4 text-sm font-bold">
              <Icon name="arrow_back" /> All Projects
            </Link>
            <span className={`inline-block px-4 py-1 text-xs font-bold uppercase rounded-full mb-4 ${STATUS_STYLES[project.status]}`}>
              {project.status}
            </span>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-primary tracking-tight max-w-4xl">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Description + Gallery */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">About this project</h2>
            <p className="text-on-surface-variant leading-relaxed text-lg whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {project.images && project.images.length > 0 && (
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.map((img) => (
                  <div key={img.id} className="aspect-square overflow-hidden rounded-lg shadow-md group">
                    <img
                      src={img.image_url}
                      alt={img.caption || ""}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {articles.length > 0 && (
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Related Articles</h2>
              <div className="space-y-4">
                {articles.map((a) => (
                  <Link
                    key={a.id}
                    href={`/articles/${a.id}`}
                    className="group flex gap-4 p-4 bg-surface-container-lowest rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    {a.cover_image_url ? (
                      <img src={a.cover_image_url} alt={a.title} className="w-24 h-24 rounded-md object-cover shrink-0" />
                    ) : (
                      <div className="w-24 h-24 rounded-md bg-secondary-container flex items-center justify-center shrink-0">
                        <Icon name="article" className="text-secondary text-2xl" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">{a.title}</h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Published {new Date(a.published_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Icon name="arrow_forward" className="text-on-surface-variant group-hover:text-primary self-center" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {progress !== null && (
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-on-surface mb-3">Donation Progress</h3>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-extrabold text-primary">
                  ${Number(project.donation_raised).toFixed(0)}
                </span>
                <span className="text-sm text-on-surface-variant">
                  of ${Number(project.donation_goal).toFixed(0)}
                </span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden mb-4">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <Link
                href="/donate"
                className="block w-full text-center py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-dim transition-colors"
              >
                Support this project
              </Link>
            </div>
          )}

          <div className="bg-surface-container-low p-6 rounded-lg">
            <h3 className="font-bold text-on-surface mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              {project.start_date && (
                <div className="flex items-center gap-3">
                  <Icon name="calendar_today" className="text-on-surface-variant text-base" />
                  <div>
                    <dt className="text-xs text-on-surface-variant">Started</dt>
                    <dd className="font-bold text-on-surface">{new Date(project.start_date).toLocaleDateString()}</dd>
                  </div>
                </div>
              )}
              {project.end_date && (
                <div className="flex items-center gap-3">
                  <Icon name="event" className="text-on-surface-variant text-base" />
                  <div>
                    <dt className="text-xs text-on-surface-variant">Ends</dt>
                    <dd className="font-bold text-on-surface">{new Date(project.end_date).toLocaleDateString()}</dd>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Icon name="article" className="text-on-surface-variant text-base" />
                <div>
                  <dt className="text-xs text-on-surface-variant">Articles</dt>
                  <dd className="font-bold text-on-surface">{articles.length}</dd>
                </div>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}
