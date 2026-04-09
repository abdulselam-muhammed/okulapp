import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import { useToastStore } from "./toast.store";

export interface UserItem {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UsersStore {
  users: UserItem[];
  loading: boolean;
  roleFilter: string;
  search: string;
  page: number;
  limit: number;
  setRoleFilter: (role: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: number, userName: string) => Promise<void>;
  addUser: (data: {
    email: string;
    password: string;
    role: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<boolean>;
}

function getToken() {
  return useAuthStore.getState().token;
}

function headers() {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
  loading: false,
  roleFilter: "",
  search: "",
  page: 0,
  limit: 10,

  setRoleFilter: (roleFilter) => set({ roleFilter, page: 0 }),
  setSearch: (search) => set({ search }),
  setPage: (page) => set({ page }),

  fetchUsers: async () => {
    const { limit, page, roleFilter } = get();
    const toast = useToastStore.getState();

    set({ loading: true });
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(page * limit),
      });
      if (roleFilter) params.set("role", roleFilter);

      const res = await fetch(`/api/users?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();

      if (data.success) {
        set({ users: data.data });
      } else {
        toast.addToast(data.error?.message || "Failed to fetch users", "error");
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (userId, userName) => {
    const toast = useToastStore.getState();

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.status === 204) {
        toast.addToast(`${userName} has been deleted`, "success");
        get().fetchUsers();
      } else {
        const data = await res.json();
        toast.addToast(data.error?.message || "Failed to delete user", "error");
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
    }
  },

  addUser: async (userData) => {
    const toast = useToastStore.getState();

    // Sanitize phone: digits only, max 20 chars
    const phone = userData.phone?.replace(/\D/g, "").slice(0, 20);
    const payload = { ...userData };
    if (phone) {
      payload.phone = phone;
    } else {
      delete payload.phone;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.addToast(`${userData.first_name} ${userData.last_name} has been added as ${userData.role}`, "success");
        get().fetchUsers();
        return true;
      } else {
        if (res.status === 409) {
          toast.addToast("This email is already registered", "error");
        } else {
          toast.addToast(data.error?.message || "Failed to add user", "error");
        }
        return false;
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },
}));
