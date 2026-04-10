"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms";
import { useAuthStore } from "@/lib/stores";

interface TopBarProps {
  userName: string;
  userRole: string;
}

export default function TopBar({ userName, userRole }: TopBarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = userName.split(" ").map((n) => n.charAt(0).toUpperCase()).join("").slice(0, 2);

  return (
    <header className="fixed top-0 right-0 left-64 z-40 bg-white/80 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm shadow-emerald-900/5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all"
            placeholder="Search data..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 hover:bg-emerald-50 rounded-full transition-colors">
          <Icon name="notifications" />
        </button>
        <button className="p-2 text-slate-500 hover:bg-emerald-50 rounded-full transition-colors">
          <Icon name="help_outline" />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-2" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-on-surface leading-none">{userName}</p>
              <p className="text-[10px] text-on-surface-variant capitalize">{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
              {initials}
            </div>
            <Icon name="expand_more" className={`text-on-surface-variant text-lg transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/10">
                <p className="font-bold text-on-surface text-sm">{userName}</p>
                <p className="text-xs text-on-surface-variant">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary uppercase">
                  {userRole}
                </span>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <Icon name="person" className="text-lg text-on-surface-variant" />
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <Icon name="dashboard" className="text-lg text-on-surface-variant" />
                  Dashboard
                </Link>
              </div>
              <div className="py-1 border-t border-outline-variant/10">
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/10 transition-colors"
                >
                  <Icon name="logout" className="text-lg" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
