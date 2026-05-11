import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import { useToastStore } from "./toast.store";

export interface ArticleItem {
  id: number;
  project_id: number | null;
  title: string;
  cover_image_url: string | null;
  content: string;
  author_id: number | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  project_title?: string | null;
  author_first_name?: string | null;
  author_last_name?: string | null;
}

interface ArticlesStore {
  articles: ArticleItem[];
  loading: boolean;
  fetchArticles: () => Promise<void>;
  fetchByProject: (projectId: number) => Promise<ArticleItem[]>;
  getArticle: (id: number) => Promise<ArticleItem | null>;
  addArticle: (data: Partial<ArticleItem>) => Promise<boolean>;
  updateArticle: (id: number, data: Partial<ArticleItem>) => Promise<boolean>;
  deleteArticle: (id: number, title: string) => Promise<void>;
}

function authHeaders(json = true): Record<string, string> {
  const token = useAuthStore.getState().token;
  const h: Record<string, string> = {};
  if (token) h["Authorization"] = `Bearer ${token}`;
  if (json) h["Content-Type"] = "application/json";
  return h;
}

export const useArticlesStore = create<ArticlesStore>((set, get) => ({
  articles: [],
  loading: false,

  fetchArticles: async () => {
    const toast = useToastStore.getState();
    set({ loading: true });
    try {
      const res = await fetch("/api/articles?limit=100", { headers: authHeaders(false) });
      const data = await res.json();
      if (data.success) set({ articles: data.data });
      else toast.addToast(data.error?.message || "Failed to load articles", "error");
    } catch {
      toast.addToast("Unable to connect to server", "error");
    } finally {
      set({ loading: false });
    }
  },

  fetchByProject: async (projectId) => {
    try {
      const res = await fetch(`/api/articles?project_id=${projectId}`, { headers: authHeaders(false) });
      const data = await res.json();
      return data.success ? data.data : [];
    } catch {
      return [];
    }
  },

  getArticle: async (id) => {
    try {
      const res = await fetch(`/api/articles/${id}`, { headers: authHeaders(false) });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  addArticle: async (payload) => {
    const toast = useToastStore.getState();
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.addToast(`Article "${payload.title}" published`, "success");
        get().fetchArticles();
        return true;
      }
      toast.addToast(data.error?.message || "Failed to create article", "error");
      return false;
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },

  updateArticle: async (id, payload) => {
    const toast = useToastStore.getState();
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.addToast("Article updated", "success");
        get().fetchArticles();
        return true;
      }
      toast.addToast(data.error?.message || "Failed to update article", "error");
      return false;
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },

  deleteArticle: async (id, title) => {
    const toast = useToastStore.getState();
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      if (res.status === 204) {
        toast.addToast(`Article "${title}" deleted`, "success");
        get().fetchArticles();
      } else {
        const data = await res.json();
        toast.addToast(data.error?.message || "Failed to delete article", "error");
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
    }
  },
}));
