"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms";
import { AddUserModal } from "@/components/organisms";
import { useUsersStore } from "@/lib/stores";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-secondary-container text-on-secondary-container",
  advisor: "bg-primary-container text-on-primary-container",
  volunteer: "bg-secondary-fixed text-on-secondary-fixed",
  vet: "bg-tertiary-container text-on-tertiary-container",
  user: "bg-surface-container-high text-on-surface-variant",
};

export default function UsersPage() {
  const {
    users, loading, roleFilter, search, page, limit,
    setRoleFilter, setSearch, setPage, fetchUsers, deleteUser,
  } = useUsersStore();

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, page, roleFilter]);

  const filteredUsers = search
    ? users.filter(
        (u) =>
          u.first_name.toLowerCase().includes(search.toLowerCase()) ||
          u.last_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const stats = {
    total: users.length,
    active: users.filter((u) => u.is_active).length,
    admins: users.filter((u) => u.role === "admin").length,
    vets: users.filter((u) => u.role === "vet").length,
  };

  function handleDelete(userId: number, userName: string) {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return;
    deleteUser(userId, userName);
  }

  return (
    <>
      <AddUserModal open={showAddModal} onClose={() => setShowAddModal(false)} />

      <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Management</span>
            <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">Active Users</h2>
            <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
              Oversee and manage university pet care coordinators, veterinarians, and administrative staff members.
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="advisor">Advisor</option>
              <option value="volunteer">Volunteer</option>
              <option value="vet">Veterinarian</option>
              <option value="user">User</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10"
            >
              <Icon name="person_add" className="text-lg" />
              Add New User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Users</p>
            <span className="text-3xl font-bold text-on-surface">{stats.total}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Active Now</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{stats.active}</span>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Admins</p>
            <span className="text-3xl font-bold text-on-surface">{stats.admins}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Veterinarians</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{stats.vets}</span>
              <Icon name="verified" className="text-primary text-sm" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">search</span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            placeholder="Search by name or email..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,58,40,0.05)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container text-on-surface-variant">
                    <tr>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Name</th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Role</th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Email</th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Phone</th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-16 text-center text-on-surface-variant">No users found.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, i) => (
                        <tr key={user.id} className={`hover:bg-surface-bright transition-colors group ${i % 2 === 1 ? "bg-surface-container-low/10" : ""}`}>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-on-surface">{user.first_name} {user.last_name}</p>
                                <p className="text-xs text-on-surface-variant capitalize">{user.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${ROLE_STYLES[user.role] || ROLE_STYLES.user}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm text-on-surface-variant">{user.email}</td>
                          <td className="px-8 py-5">
                            <div className="flex justify-center">
                              {user.is_active ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-400 text-[10px] font-bold rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />Inactive
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm text-on-surface-variant">{user.phone || "—"}</td>
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() => handleDelete(user.id, `${user.first_name} ${user.last_name}`)}
                              className="p-2 hover:bg-error-container/20 rounded-full transition-all"
                              title="Delete user"
                            >
                              <Icon name="delete" className="text-stone-400 group-hover:text-error" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 flex items-center justify-between border-t border-stone-50 bg-stone-50/30">
                <p className="text-xs text-on-surface-variant font-medium italic">
                  Showing {filteredUsers.length} users (page {page + 1})
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors disabled:opacity-30">
                    <Icon name="chevron_left" className="text-stone-400 text-sm" />
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-md shadow-primary/20">{page + 1}</span>
                  <button onClick={() => setPage(page + 1)} disabled={users.length < limit} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors disabled:opacity-30">
                    <Icon name="chevron_right" className="text-stone-400 text-sm" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Note */}
        <div className="flex justify-center py-10">
          <div className="max-w-xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full mb-4">
              <Icon name="info" className="text-secondary text-sm" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Data Integrity</span>
            </div>
            <p className="text-sm text-on-surface-variant italic font-body">
              Changes made to user statuses or roles will be logged for security auditing.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
