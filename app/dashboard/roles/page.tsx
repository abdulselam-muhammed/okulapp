"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms";
import { useAuthStore, useToastStore } from "@/lib/stores";

interface UserItem {
  id: number;
  role: string;
  first_name: string;
  last_name: string;
}

interface RoleDefinition {
  key: string;
  label: string;
  labelTr: string;
  icon: string;
  bgClass: string;
  iconContainerClass: string;
  description: string;
  permissions: string[];
}

const ROLES: RoleDefinition[] = [
  {
    key: "admin",
    label: "Admin",
    labelTr: "Admin",
    icon: "admin_panel_settings",
    bgClass: "bg-emerald-900",
    iconContainerClass: "bg-emerald-900 text-emerald-100",
    description: "Full system access with financial oversight, user management, and platform configuration capabilities.",
    permissions: ["Financials", "Settings", "Users"],
  },
  {
    key: "advisor",
    label: "Advisor",
    labelTr: "Danisman",
    icon: "support_agent",
    bgClass: "bg-secondary",
    iconContainerClass: "bg-secondary-container text-on-secondary-container",
    description: "Strategic oversight including report prioritization, volunteer coordination, and operational guidance.",
    permissions: ["Reporting", "Strategy"],
  },
  {
    key: "volunteer",
    label: "Volunteer",
    labelTr: "Gonullu",
    icon: "volunteer_activism",
    bgClass: "bg-tertiary",
    iconContainerClass: "bg-tertiary-container text-on-tertiary-container",
    description: "Field operations including animal reporting, feeding point management, and task execution.",
    permissions: ["Daily Logs", "Activities"],
  },
  {
    key: "vet",
    label: "Veterinarian",
    labelTr: "Veteriner",
    icon: "medical_information",
    bgClass: "bg-primary",
    iconContainerClass: "bg-primary-container text-on-primary-container",
    description: "Medical authority over animal health records, diagnosis entry, treatment plans, and medication tracking.",
    permissions: ["Health Records", "Medication"],
  },
  {
    key: "user",
    label: "User",
    labelTr: "Kullanici",
    icon: "person",
    bgClass: "bg-stone-400",
    iconContainerClass: "bg-stone-200 text-stone-600",
    description: "Basic access for reporting injured animals and tracking the status of submitted reports.",
    permissions: ["View Only", "Calendar"],
  },
];

export default function RolesPage() {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const res = await fetch("/api/users?limit=1000&offset=0", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          addToast(data.error?.message || "Failed to fetch users", "error");
        }
      } catch {
        addToast("Unable to connect to server", "error");
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchAllUsers();
  }, [token, addToast]);

  function countByRole(role: string): number {
    return users.filter((u) => u.role === role).length;
  }

  const adminCount = countByRole("admin");
  const volunteerCount = countByRole("volunteer");

  return (
    <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
          Access Control
        </span>
        <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">
          Permissions &amp; Governance
        </h2>
        <p className="text-on-surface-variant max-w-2xl font-body leading-relaxed">
          Define and manage role-based access across the platform. Each role determines
          what actions a user can perform within the animal rescue system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-900 text-emerald-100 rounded-xl">
              <Icon name="shield" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Global Admins
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">
              {loading ? "..." : adminCount}
            </span>
            <span className="text-xs text-on-surface-variant">users</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-tertiary-container text-on-tertiary-container rounded-xl">
              <Icon name="volunteer_activism" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Volunteers
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">
              {loading ? "..." : volunteerCount}
            </span>
            <span className="text-xs text-on-surface-variant">active members</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-secondary-container text-on-secondary-container rounded-xl">
              <Icon name="history" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Recent Changes
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">4</span>
            <span className="text-xs text-on-surface-variant">this week</span>
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,58,40,0.05)]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Description
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-center">
                    Users
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Permissions
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROLES.map((role, i) => (
                  <tr
                    key={role.key}
                    className={`hover:bg-surface-bright transition-colors group ${
                      i % 2 === 1 ? "bg-surface-container-low/10" : ""
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${role.iconContainerClass}`}
                        >
                          <Icon name={role.icon} className="text-xl" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{role.label}</p>
                          <p className="text-xs text-on-surface-variant">
                            {role.labelTr}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
                        {role.description}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-on-surface font-bold text-sm">
                        {countByRole(role.key)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-3 py-1 text-[11px] font-bold rounded-full bg-primary/10 text-primary"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-full transition-colors">
                        Edit Permissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Smart Recommendation Card */}
        <div className="bg-secondary-container/30 p-8 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-secondary-container text-on-secondary-container rounded-xl">
              <Icon name="auto_awesome" />
            </div>
            <h3 className="font-bold text-on-surface text-lg">Smart Recommendations</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
            Based on current activity patterns, we recommend promoting 2 active volunteers to
            advisor roles. Their engagement metrics exceed the advisory threshold by 40%.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="trending_up" className="text-secondary text-lg" />
                <span className="text-sm font-medium text-on-surface">
                  Volunteer-to-Advisor pipeline active
                </span>
              </div>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                2 candidates
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="security" className="text-secondary text-lg" />
                <span className="text-sm font-medium text-on-surface">
                  No orphaned permissions detected
                </span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                Healthy
              </span>
            </div>
          </div>
        </div>

        {/* Permission Analytics Card */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-container text-primary rounded-xl">
              <Icon name="analytics" />
            </div>
            <h3 className="font-bold text-on-surface text-lg">Permission Analytics</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
            Overview of permission utilization across all roles in the system.
          </p>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-on-surface-variant font-bold">ADMIN UTILIZATION</span>
                <span className="text-on-surface-variant">92%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-emerald-700 w-[92%] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-on-surface-variant font-bold">ADVISOR ACTIVITY</span>
                <span className="text-on-surface-variant">78%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[78%] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-on-surface-variant font-bold">VOLUNTEER ENGAGEMENT</span>
                <span className="text-on-surface-variant">85%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary w-[85%] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-on-surface-variant font-bold">VET PORTAL USAGE</span>
                <span className="text-on-surface-variant">67%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[67%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="flex justify-center py-10">
        <div className="max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full mb-4">
            <Icon name="info" className="text-secondary text-sm" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">
              Governance
            </span>
          </div>
          <p className="text-sm text-on-surface-variant italic font-body">
            All role modifications are logged and require admin approval. Changes take
            effect immediately upon confirmation.
          </p>
        </div>
      </div>
    </section>
  );
}
