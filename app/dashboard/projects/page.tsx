"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms";
import { ProjectFormModal, ConfirmDialog } from "@/components/organisms";
import { useProjectsStore, type ProjectItem } from "@/lib/stores";
import { useAbility } from "@/lib/hooks/useAbility";

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-secondary-container text-on-secondary-container",
  active: "bg-primary/10 text-primary",
  completed: "bg-surface-container-high text-on-surface-variant",
  cancelled: "bg-error-container/20 text-error",
};

export default function ProjectsAdminPage() {
  const { projects, loading, fetchProjects, deleteProject } = useProjectsStore();
  const ability = useAbility();
  const canManage = ability.can("create", "Project");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function handleDelete(p: ProjectItem) {
    setDeleteTarget(p);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget.id, deleteTarget.title);
    setDeleteTarget(null);
  }

  function handleEdit(p: ProjectItem) {
    setEditing(p);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <>
      <ProjectFormModal open={showForm} onClose={handleClose} project={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Delete project "${deleteTarget?.title}"?`}
        detail="This will permanently delete the project and all its gallery images. Articles linked to this project will become standalone. This cannot be undone."
        confirmLabel="Delete Project"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
              Initiatives
            </span>
            <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">
              Projects
            </h2>
            <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
              Manage charitable initiatives. Each project can have images, donation goals, and related articles.
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10"
            >
              <Icon name="add" className="text-lg" />
              New Project
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Projects</p>
            <span className="text-3xl font-bold text-on-surface">{projects.length}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Active</p>
            <span className="text-3xl font-bold text-primary">{projects.filter((p) => p.status === "active").length}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Completed</p>
            <span className="text-3xl font-bold text-on-surface">{projects.filter((p) => p.status === "completed").length}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Articles</p>
            <span className="text-3xl font-bold text-on-surface">
              {projects.reduce((sum, p) => sum + (p.articles_count ?? 0), 0)}
            </span>
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
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Project</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Donation Progress</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-center">Articles</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Created</th>
                    {canManage && (
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={canManage ? 6 : 5} className="px-8 py-16 text-center text-on-surface-variant">
                        <Icon name="folder_open" className="text-4xl text-on-surface-variant/30 mb-3 inline-block" />
                        <p>No projects yet. Create your first one!</p>
                      </td>
                    </tr>
                  ) : (
                    projects.map((p, i) => {
                      const progress = p.donation_goal && p.donation_goal > 0
                        ? Math.min(100, (Number(p.donation_raised) / Number(p.donation_goal)) * 100)
                        : 0;
                      return (
                        <tr key={p.id} className={`hover:bg-surface-bright transition-colors group ${i % 2 === 1 ? "bg-surface-container-low/10" : ""}`}>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              {p.cover_image_url ? (
                                <img src={p.cover_image_url} alt="" className="w-14 h-14 rounded-lg object-cover bg-surface-container" />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-primary-container flex items-center justify-center">
                                  <Icon name="folder_special" className="text-primary text-xl" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold text-on-surface truncate max-w-[260px]">{p.title}</p>
                                <p className="text-xs text-on-surface-variant truncate max-w-[260px]">
                                  {p.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${STATUS_STYLES[p.status]}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            {p.donation_goal ? (
                              <div className="min-w-[140px]">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-bold text-on-surface">${Number(p.donation_raised).toFixed(0)}</span>
                                  <span className="text-on-surface-variant">of ${Number(p.donation_goal).toFixed(0)}</span>
                                </div>
                                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-on-surface-variant">No goal set</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">
                              {p.articles_count ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-on-surface-variant">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                          {canManage && (
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="p-2 hover:bg-secondary/10 rounded-full transition-all"
                                  title="Edit project"
                                >
                                  <Icon name="edit" className="text-stone-400 group-hover:text-secondary text-lg" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p)}
                                  className="p-2 hover:bg-error-container/20 rounded-full transition-all"
                                  title="Delete project"
                                >
                                  <Icon name="delete" className="text-stone-400 group-hover:text-error text-lg" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
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
