"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    setLoading(false);
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  return { user, token, loading, logout };
}
