"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/atoms";
import { useAuthStore } from "@/lib/stores";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/activities", label: "Activities" },
  { href: "/projects", label: "Projects" },
  { href: "/articles", label: "Articles" },
  { href: "/support", label: "Support Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, loading, hydrate, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-on-surface font-headline">
          Campus Care
        </Link>

        <div className="hidden md:flex items-center space-x-8 font-headline text-sm tracking-tight">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/donate"
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-dim transition-all shadow-lg shadow-primary/10"
          >
            Donate Now
          </Link>

          {!loading && (
            <>
              {user ? (
                /* Authenticated — show profile dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full hover:bg-surface-container-low transition-colors"
                  >
                    <span className="text-sm font-bold text-on-surface hidden sm:block">
                      {user.first_name || user.email || "User"}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
                      {(user.first_name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()}
                      {user.last_name?.charAt(0)?.toUpperCase() || ""}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-outline-variant/10">
                        <p className="font-bold text-on-surface text-sm">
                          {user.first_name || ""} {user.last_name || ""}
                          {!user.first_name && !user.last_name && (user.email || "User")}
                        </p>
                        <p className="text-xs text-on-surface-variant">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary uppercase">
                          {user.role}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <Icon name="dashboard" className="text-lg text-on-surface-variant" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <Icon name="person" className="text-lg text-on-surface-variant" />
                          Profile
                        </Link>
                      </div>
                      <div className="py-1 border-t border-outline-variant/10">
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                            window.location.href = "/";
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
              ) : (
                /* Guest — show login/register */
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-5 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-full transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-bold text-on-primary bg-secondary rounded-full hover:bg-secondary-dim transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
