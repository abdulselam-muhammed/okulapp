import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import { useToastStore } from "./toast.store";

export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  cover_image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "upcoming" | "active" | "completed" | "cancelled";
  donation_goal: number | null;
  donation_raised: number;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  articles_count?: number;
  images_count?: number;
  images?: ProjectImage[];
}

interface ProjectsStore {
  projects: ProjectItem[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  getProject: (id: number) => Promise<ProjectItem | null>;
  addProject: (data: Partial<ProjectItem> & { image_urls?: string[] }) => Promise<boolean>;
  updateProject: (id: number, data: Partial<ProjectItem> & { image_urls?: string[] }) => Promise<boolean>;
  deleteProject: (id: number, title: string) => Promise<void>;
}

function authHeaders(json = true): Record<string, string> {
  const token = useAuthStore.getState().token;
  const h: Record<string, string> = {};
  if (token) h["Authorization"] = `Bearer ${token}`;
  if (json) h["Content-Type"] = "application/json";
  return h;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async () => {
    const toast = useToastStore.getState();
    set({ loading: true });
    try {
      const res = await fetch("/api/projects?limit=100", { headers: authHeaders(false) });
      const data = await res.json();
      if (data.success) set({ projects: data.data });
      else toast.addToast(data.error?.message || "Failed to load projects", "error");
    } catch {
      toast.addToast("Unable to connect to server", "error");
    } finally {
      set({ loading: false });
    }
  },

  getProject: async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { headers: authHeaders(false) });
      const data = await res.json();
      if (data.success) return data.data;
      return null;
    } catch {
      return null;
    }
  },

  addProject: async (payload) => {
    const toast = useToastStore.getState();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.addToast(`Project "${payload.title}" created`, "success");
        get().fetchProjects();
        return true;
      }
      toast.addToast(data.error?.message || "Failed to create project", "error");
      return false;
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },

  updateProject: async (id, payload) => {
    const toast = useToastStore.getState();
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.addToast("Project updated", "success");
        get().fetchProjects();
        return true;
      }
      toast.addToast(data.error?.message || "Failed to update project", "error");
      return false;
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },

  deleteProject: async (id, title) => {
    const toast = useToastStore.getState();
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      if (res.status === 204) {
        toast.addToast(`Project "${title}" deleted`, "success");
        get().fetchProjects();
      } else {
        const data = await res.json();
        toast.addToast(data.error?.message || "Failed to delete project", "error");
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
    }
  },
}));
