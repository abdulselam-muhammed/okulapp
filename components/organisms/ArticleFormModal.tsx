"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "@/components/atoms";
import { FormField, SelectField, ImageUpload } from "@/components/molecules";
import { useArticlesStore, useProjectsStore, useToastStore, type ArticleItem } from "@/lib/stores";

interface ArticleFormModalProps {
  open: boolean;
  onClose: () => void;
  article?: ArticleItem | null; // null = create mode
}

export default function ArticleFormModal({ open, onClose, article }: ArticleFormModalProps) {
  const addArticle = useArticlesStore((s) => s.addArticle);
  const updateArticle = useArticlesStore((s) => s.updateArticle);
  const { projects, fetchProjects } = useProjectsStore();
  const addToast = useToastStore((s) => s.addToast);

  const isEdit = !!article;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [projectId, setProjectId] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchProjects();
  }, [open, fetchProjects]);

  useEffect(() => {
    if (open && article) {
      setTitle(article.title);
      setContent(article.content);
      setCoverUrl(article.cover_image_url);
      setProjectId(article.project_id ? String(article.project_id) : "");
      setPublishedAt(article.published_at ? article.published_at.slice(0, 16) : "");
    } else if (open && !article) {
      setTitle("");
      setContent("");
      setCoverUrl(null);
      setProjectId("");
      setPublishedAt("");
    }
  }, [open, article]);

  const projectOptions = projects.map((p) => ({ value: String(p.id), label: p.title }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) { addToast("Please enter a title"); return; }
    if (!content.trim()) { addToast("Please enter content"); return; }

    const payload: Record<string, unknown> = {
      title,
      content,
    };
    if (coverUrl) payload.cover_image_url = coverUrl;
    if (projectId) payload.project_id = Number(projectId);
    if (publishedAt) payload.published_at = new Date(publishedAt).toISOString();

    setLoading(true);
    const success = isEdit && article
      ? await updateArticle(article.id, payload as Partial<ArticleItem>)
      : await addArticle(payload as Partial<ArticleItem>);
    setLoading(false);

    if (success) onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Article" : "New Article"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          id="article_title"
          label="Title"
          placeholder="Our winter rescue story"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon="article"
        />

        <ImageUpload label="Cover Image" value={coverUrl} onChange={setCoverUrl} />

        <SelectField
          id="article_project"
          label="Related Project (optional)"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={projectOptions}
          placeholder="-- No project --"
          icon="folder_special"
        />

        <div className="space-y-2">
          <label className="block font-label text-sm font-semibold text-on-surface-variant px-1">
            Content
          </label>
          <textarea
            className="w-full px-4 py-4 bg-surface-container-low border-none rounded-md font-body text-sm text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
            placeholder="Write the article content..."
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <FormField
          id="article_published"
          label="Publish Date (optional)"
          type="datetime-local"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          icon="event"
        />

        <div className="pt-2">
          <Button type="submit" fullWidth loading={loading} icon={isEdit ? "save" : "publish"}>
            {isEdit ? "Save Changes" : "Publish Article"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
