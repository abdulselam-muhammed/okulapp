"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/atoms";
import { useAbility } from "@/lib/hooks/useAbility";
import { useAuthStore } from "@/lib/stores";
import type { Actions, Subjects } from "@/lib/helpers/ability";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  filledIcon?: boolean;
  requiredAction?: Actions;
  requiredSubject?: Subjects;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/dashboard/users", icon: "group", label: "Users", requiredAction: "read", requiredSubject: "User" },
  { href: "/dashboard/roles", icon: "security", label: "Roles", requiredAction: "read", requiredSubject: "Role" },
  { href: "/dashboard/vets", icon: "medical_services", label: "Veterinarians", requiredAction: "read", requiredSubject: "Vet" },
  { href: "/dashboard/donations", icon: "volunteer_activism", label: "Donations", filledIcon: true, requiredAction: "read", requiredSubject: "Donation" },
  { href: "/dashboard/projects", icon: "folder_special", label: "Projects", requiredAction: "create", requiredSubject: "Project" },
  { href: "/dashboard/articles", icon: "article", label: "Articles", requiredAction: "create", requiredSubject: "Article" },
  { href: "/dashboard/tasks", icon: "task_alt", label: "Tasks", requiredAction: "read", requiredSubject: "Task" },
  { href: "/dashboard/logs", icon: "list_alt", label: "Activity Logs", requiredAction: "read", requiredSubject: "ActivityLog" },
  { href: "/dashboard/map", icon: "map", label: "Activity Map", requiredAction: "read", requiredSubject: "FeedingPoint" },
  { href: "/dashboard/notifications", icon: "notifications", label: "Notifications" },
  { href: "/dashboard/profile", icon: "person", label: "Profile" },
];

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const ability = useAbility();
  const role = useAuthStore((s) => s.user?.role);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.requiredAction || !item.requiredSubject) return true;
    return ability.can(item.requiredAction, item.requiredSubject);
  });

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-50 flex flex-col py-6 space-y-2 z-50">
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
            <Icon name="pets" className="text-white text-sm" filled />
          </div>
          <div>
            <h2 className="text-lg font-black text-emerald-800 leading-none">Campus Care</h2>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1 capitalize">
              {role ? `${role} Terminal` : "Terminal"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-2 px-4 py-3 mb-1 flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive
                  ? "bg-emerald-100/50 text-emerald-900"
                  : "text-slate-600 hover:bg-slate-200/50"
              }`}
            >
              <Icon name={item.icon} filled={item.filledIcon && isActive} />
              <span className={isActive ? "font-semibold" : "font-medium"}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 mt-auto space-y-1">
        <button
          onClick={onLogout}
          className="w-full text-slate-600 mx-2 px-4 py-3 mb-1 flex items-center gap-3 hover:bg-slate-200/50 rounded-xl transition-all text-left"
        >
          <Icon name="logout" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
