"use client";

import { Icon } from "@/components/atoms";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="pt-24 px-10 pb-20 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="mb-12">
        <span className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em] mb-2 block">
          System Overview
        </span>
        <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">
          Welcome back, {user?.first_name || "Curator"}
        </h2>
        <p className="text-on-surface-variant mt-2 max-w-2xl">
          Monitor the health and welfare of our campus residents. All systems
          are operating normally across all four quadrants.
        </p>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
        {/* Stat 1: Animals */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm shadow-emerald-900/5 group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container text-primary rounded-2xl">
              <Icon name="pets" />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-label uppercase tracking-wider">Total Animals</h3>
          <p className="text-4xl font-headline font-bold text-on-surface mt-1">450+</p>
        </div>

        {/* Stat 2: Feeding Stations */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm shadow-emerald-900/5 group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container text-secondary rounded-2xl">
              <Icon name="restaurant" />
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">Stable</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-label uppercase tracking-wider">Stations</h3>
          <p className="text-4xl font-headline font-bold text-on-surface mt-1">24</p>
        </div>

        {/* Stat 3: Volunteers */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm shadow-emerald-900/5 group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-container text-on-tertiary-container rounded-2xl">
              <Icon name="groups" />
            </div>
            <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full">+5 today</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-label uppercase tracking-wider">Volunteers</h3>
          <p className="text-4xl font-headline font-bold text-on-surface mt-1">120</p>
        </div>

        {/* Stat 4: Daily Meals */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm shadow-emerald-900/5 group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-variant text-on-surface-variant rounded-2xl">
              <Icon name="calendar_today" />
            </div>
            <span className="text-xs font-bold text-on-surface-variant bg-surface-variant/20 px-2 py-1 rounded-full">98% Goal</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-label uppercase tracking-wider">Daily Meals</h3>
          <p className="text-4xl font-headline font-bold text-on-surface mt-1">1,240</p>
        </div>
      </div>

      {/* Asymmetric Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity Column (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-headline font-bold text-on-surface">Recent Activity Summary</h3>
            <button className="text-sm font-bold text-primary hover:underline">View all history</button>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
            {/* Activity Item 1 */}
            <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between group hover:translate-x-1 transition-transform">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    alt="Cat profile"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQu8YoZ9DfxWlB5vuuFEihdAEwat3QmgYfR74gGuuYqwNCV7HE-THJC9Ca_Ro_hhZ09XH02VtjhewZxgGTQKCB6k8PTRsu2ITgn9zJewXjSBUvazK32h_-5pfP3eNqoDLO8GhsAhP08KXoye5pi8p6h2Tv6pv8XEh2EycjMvIec3VeWHVbNacTgsg3o0wAQU3YgxYSBer00xwowmUvFrU47dAbq1jaIpBCizl1Y7Fj8VbLiou2v6Y35zf3wf8S7qUt9Y-0T6f5j-k"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Feeding at Station #4</h4>
                  <p className="text-sm text-on-surface-variant">Completed by Sarah Miller - 15 mins ago</p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">Completed</span>
            </div>

            {/* Activity Item 2 */}
            <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between group hover:translate-x-1 transition-transform">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary-container flex items-center justify-center text-secondary">
                  <Icon name="medical_services" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Medical Checkup - &quot;Buddy&quot;</h4>
                  <p className="text-sm text-on-surface-variant">Assigned to Dr. Aris - Scheduled for 2:00 PM</p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-tertiary-container/30 text-tertiary text-xs font-bold">Pending</span>
            </div>

            {/* Activity Item 3 */}
            <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between group hover:translate-x-1 transition-transform">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    alt="Campus building"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTsc9TiOpOeJrMWBNURyM2-I9g5s4hs9sgNBBMgovUrwu2f-8svERmj-_ZPgcXhlmYQ8PBLiYEc5lV12sbeG_QBFptE-gE6bJUr9m39d69U5ghdX1_RzFsaKpaL4F_Nfz5rjCtK6QKtLMKu4G7534ey6_sNReTmX8TCKDDKyUQQofam0TWPC30h-PPDNwfJuOYxcPO6rmBREckaJKpJDdYmveI6vYJqg9zEx9Xhe8f7FocRjS3mel5IDxoids9NLwDaHim6kGezOY"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">New Donation Received</h4>
                  <p className="text-sm text-on-surface-variant">External Alumnus Fund - 2 hours ago</p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">Completed</span>
            </div>

            {/* Activity Item 4 */}
            <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between group hover:translate-x-1 transition-transform">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-error-container/20 flex items-center justify-center text-error">
                  <Icon name="report_problem" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Low Supply Alert - Quad B</h4>
                  <p className="text-sm text-on-surface-variant">Automated System Alert - 4 hours ago</p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-error-container/20 text-error text-xs font-bold">Priority</span>
            </div>
          </div>
        </div>

        {/* Side Panel: Campus Map & Quick Actions */}
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-6">Activity Hotspots</h3>
            <div className="rounded-lg overflow-hidden h-64 relative shadow-lg">
              <img
                alt="Campus Map Visualization"
                className="w-full h-full object-cover grayscale opacity-50 bg-secondary-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmJkAYpHgHb1FduR8fNFNDIrGqGhwRoZI6Izq7YbDdrvXBiDlOuW13v_kkk-peoOaYtHXcCJdIGSPZ_L1VoZzLLDjfrylyt8-UIggnvL3t1Kqsp6seQ_dWfYl4VtUslK2612BoFG0f6W6rQKRTAGSztz9qlUh-hup2pRPexk1On-6-kP5GglQbCKGZ_39SxF5VJRCTtHTl-8SJNFdwMVybzwdnKFCNFmvurNiq04sIfcjjhkqnCk0piD2zNHARNG5wRNpOlaY9jgU"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full border-2 border-white animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-primary rounded-full border-2 border-white animate-pulse" />
              <div className="absolute top-1/2 right-1/2 w-4 h-4 bg-tertiary rounded-full border-2 border-white" />
            </div>
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-on-surface-variant font-medium">Feeding Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-tertiary" />
                <span className="text-on-surface-variant font-medium">Alert Zone</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-secondary-container/30 p-8 rounded-lg">
            <h4 className="text-secondary font-bold mb-4">Quick Stats</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-secondary-dim font-bold">VOLUNTEER CAPACITY</span>
                  <span className="text-secondary-dim">84%</span>
                </div>
                <div className="h-2 bg-secondary-fixed-dim rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[84%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-secondary-dim font-bold">SUPPLY LEVELS</span>
                  <span className="text-secondary-dim">62%</span>
                </div>
                <div className="h-2 bg-secondary-fixed-dim rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[62%] rounded-full" />
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-secondary text-on-secondary rounded-full font-bold text-sm hover:bg-secondary-dim transition-colors">
              Generate Weekly Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
