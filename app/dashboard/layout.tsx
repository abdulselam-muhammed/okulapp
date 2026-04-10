"use client";

import { DashboardTemplate } from "@/components/templates";
import { AbilityProvider } from "@/lib/hooks/useAbility";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AbilityProvider>
      <DashboardTemplate>{children}</DashboardTemplate>
    </AbilityProvider>
  );
}
