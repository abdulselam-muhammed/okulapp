"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms";
import { ArticleFormModal, ConfirmDialog } from "@/components/organisms";
import { useArticlesStore, type ArticleItem } from "@/lib/stores";
import { useAbility } from "@/lib/hooks/useAbility";

export default function ArticlesAdminPage() {
  const { articles, loading, fetchArticles, deleteArticle } = useArticlesStore();
  const ability = useAbility();
  const canManage = ability.can("create", "Article");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ArticleItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArticleItem | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  function handleDelete(a: ArticleItem) {
    setDeleteTarget(a);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteArticle(deleteTarget.id, deleteTarget.title);
    setDeleteTarget(null);
  }

  function handleEdit(a: ArticleItem) {
    setEditing(a);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <>
      <ArticleFormModal open={showForm} onClose={handleClose} article={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Article"
        message={`Delete article "${deleteTarget?.title}"?`}
        detail="This will permanently delete the article. This action cannot be undone."
        confirmLabel="Delete Article"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
              Publications
            </span>
            <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">
              Articles
            </h2>
            <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
              Blog posts and stories. Each article can be linked to a project.
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10"
            >
              <Icon name="add" className="text-lg" />
              New Article
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Articles</p>
            <span className="text-3xl font-bold text-on-surface">{articles.length}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Linked to Project</p>
            <span className="text-3xl font-bold text-primary">{articles.filter((a) => a.project_id).length}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Standalone</p>
            <span className="text-3xl font-bold text-on-surface">{articles.filter((a) => !a.project_id).length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,58,40,0.05)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container text-on-surface-variant">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Article</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Project</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Author</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Published</th>
                    {canManage && (
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={canManage ? 5 : 4} className="px-8 py-16 text-center text-on-surface-variant">
                        <Icon name="article" className="text-4xl text-on-surface-variant/30 mb-3 inline-block" />
                        <p>No articles yet. Publish your first one!</p>
                      </td>
                    </tr>
                  ) : (
                    articles.map((a, i) => (
                      <tr key={a.id} className={`hover:bg-surface-bright transition-colors group ${i % 2 === 1 ? "bg-surface-container-low/10" : ""}`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {a.cover_image_url ? (
                              <img src={a.cover_image_url} alt="" className="w-14 h-14 rounded-lg object-cover bg-surface-container" />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-secondary-container flex items-center justify-center">
                                <Icon name="article" className="text-secondary text-xl" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-on-surface truncate max-w-[300px]">{a.title}</p>
                              <p className="text-xs text-on-surface-variant truncate max-w-[300px]">
                                {a.content.slice(0, 80)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {a.project_title ? (
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-container text-on-primary-container">
                              {a.project_title}
                            </span>
                          ) : (
                            <span className="text-xs text-on-surface-variant italic">Standalone</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface-variant">
                          {a.author_first_name && a.author_last_name
                            ? `${a.author_first_name} ${a.author_last_name}`
                            : "—"}
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface-variant">
                          {new Date(a.published_at).toLocaleDateString()}
                        </td>
                        {canManage && (
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(a)}
                                className="p-2 hover:bg-secondary/10 rounded-full transition-all"
                                title="Edit article"
                              >
                                <Icon name="edit" className="text-stone-400 group-hover:text-secondary text-lg" />
                              </button>
                              <button
                                onClick={() => handleDelete(a)}
                                className="p-2 hover:bg-error-container/20 rounded-full transition-all"
                                title="Delete article"
                              >
                                <Icon name="delete" className="text-stone-400 group-hover:text-error text-lg" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
