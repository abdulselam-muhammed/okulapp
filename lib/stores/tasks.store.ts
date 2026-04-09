import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import { useToastStore } from "./toast.store";

export interface TaskItem {
  id: number;
  report_id: number | null;
  assigned_by: number | null;
  assigned_to: number | null;
  type: string;
  status: string;
  priority: string;
  notes: string | null;
  deadline: string | null;
  created_at: string;
}

interface TasksStore {
  tasks: TaskItem[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (data: {
    assigned_to: number;
    type: string;
    priority?: string;
    notes?: string;
    deadline?: string;
  }) => Promise<boolean>;
  updateTaskStatus: (taskId: number, status: string, rejectionReason?: string) => Promise<boolean>;
}

function getToken() {
  return useAuthStore.getState().token;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    const toast = useToastStore.getState();
    set({ loading: true });

    try {
      const res = await fetch("/api/tasks?limit=100", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();

      if (data.success) set({ tasks: data.data });
      else toast.addToast(data.error?.message || "Failed to fetch tasks", "error");
    } catch {
      toast.addToast("Unable to connect to server", "error");
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (taskData) => {
    const toast = useToastStore.getState();

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();

      if (data.success) {
        toast.addToast("Task created successfully", "success");
        get().fetchTasks();
        return true;
      } else {
        if (res.status === 409) toast.addToast("Volunteer already has an active task", "error");
        else toast.addToast(data.error?.message || "Failed to create task", "error");
        return false;
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },

  updateTaskStatus: async (taskId, status, rejectionReason) => {
    const toast = useToastStore.getState();

    try {
      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, ...(rejectionReason && { rejection_reason: rejectionReason }) }),
      });
      const data = await res.json();

      if (data.success) {
        toast.addToast(`Task #${taskId} status updated to ${status}`, "success");
        get().fetchTasks();
        return true;
      } else {
        toast.addToast(data.error?.message || "Failed to update task", "error");
        return false;
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },
}));
