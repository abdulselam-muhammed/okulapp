"use client";

import { Icon } from "@/components/atoms";

interface TopBarProps {
  userName: string;
  userRole: string;
}

export default function TopBar({ userName, userRole }: TopBarProps) {
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
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface leading-none">{userName}</p>
            <p className="text-[10px] text-on-surface-variant capitalize">{userRole}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
