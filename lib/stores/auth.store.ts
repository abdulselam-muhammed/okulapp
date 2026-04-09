import { create } from "zustand";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  hydrate: () => void;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loading: true,

  hydrate: () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        set({ user: JSON.parse(storedUser), token: storedToken, loading: false });
        return;
      } catch {
        // invalid stored data
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, loading: false });
  },

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, loading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));
