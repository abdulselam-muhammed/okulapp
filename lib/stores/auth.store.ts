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

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
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
        const user = JSON.parse(storedUser);
        // Sync cookies for middleware
        setCookie("token", storedToken);
        setCookie("user_role", user.role);
        set({ user, token: storedToken, loading: false });
        return;
      } catch {
        // invalid stored data
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    deleteCookie("token");
    deleteCookie("user_role");
    set({ user: null, token: null, loading: false });
  },

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCookie("token", token);
    setCookie("user_role", user.role);
    set({ user, token, loading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    deleteCookie("token");
    deleteCookie("user_role");
    set({ user: null, token: null });
  },
}));
