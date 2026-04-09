"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, TopBar } from "@/components/organisms";
import { useAuthStore } from "@/lib/stores";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-on-surface-variant font-body">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Sidebar onLogout={logout} />
      <TopBar
        userName={`${user.first_name} ${user.last_name}`}
        userRole={user.role}
      />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
