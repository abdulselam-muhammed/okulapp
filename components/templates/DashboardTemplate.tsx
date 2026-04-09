"use client";

import { Sidebar, TopBar } from "@/components/organisms";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();

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
