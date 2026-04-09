"use client";

import { useState } from "react";
import { Icon } from "@/components/atoms";
import { useAuthStore, useToastStore } from "@/lib/stores";

const ROLES = [
  { key: "admin", label: "Admin", icon: "shield_person", description: "Full system access" },
  { key: "advisor", label: "Danisman", icon: "school", description: "Advisory oversight" },
  { key: "volunteer", label: "Gonullu", icon: "volunteer_activism", description: "Field operations" },
  { key: "vet", label: "Veteriner", icon: "medical_services", description: "Medical care" },
  { key: "user", label: "Kullanici", icon: "person", description: "Basic access" },
];

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const login = useAuthStore((s) => s.login);
  const addToast = useToastStore((s) => s.addToast);

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    healthAlerts: true,
    volunteerShifts: true,
    weeklyNewsletter: false,
  });

  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : "??";

  const fullName = user ? `${user.first_name} ${user.last_name}` : "User";

  async function handleSave() {
    if (!user || !token) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to update profile");
      }

      // Update the auth store with new data
      login(
        { ...user, first_name: firstName, last_name: lastName, phone: phone || null },
        token
      );

      addToast("Profile updated successfully", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
          Account Settings
        </span>
        <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">
          Your Profile
        </h2>
        <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
          Manage your personal information, role settings, and notification preferences.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Avatar Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            {/* Initials Avatar */}
            <div className="w-24 h-24 mx-auto rounded-full bg-primary-container flex items-center justify-center mb-5">
              <span className="text-3xl font-headline font-bold text-primary">{initials}</span>
            </div>

            <h3 className="text-xl font-headline font-bold text-on-surface">{fullName}</h3>

            {/* Role Badge */}
            <span className="inline-flex items-center gap-1.5 mt-2 px-4 py-1.5 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full capitalize">
              <Icon name="verified" className="text-sm" />
              {user?.role || "user"}
            </span>

            <p className="text-xs text-on-surface-variant mt-4">
              <Icon name="calendar_today" className="text-sm align-middle mr-1" />
              Active since January 2025
            </p>

            {/* Divider */}
            <div className="my-6 border-t border-surface-container" />

            {/* Contact Info */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Icon name="mail" className="text-on-surface-variant text-base" />
                <span className="text-on-surface-variant truncate">{email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icon name="phone" className="text-on-surface-variant text-base" />
                <span className="text-on-surface-variant">{phone || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-on-surface">Profile Completeness</span>
              <span className="text-sm font-bold text-primary">85%</span>
            </div>
            <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000"
                style={{ width: "85%" }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-3">
              Add a phone number and profile photo to reach 100%.
            </p>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-8 space-y-8">
          {/* Personal Details */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-container rounded-xl">
                <Icon name="person" className="text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Personal Details</h3>
                <p className="text-xs text-on-surface-variant">Update your personal information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  First Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                    <Icon name="badge" className="text-lg" />
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-md font-body text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
                    placeholder="First name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                    <Icon name="badge" className="text-lg" />
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-md font-body text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50">
                    <Icon name="mail" className="text-lg" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-low/50 border-none rounded-md font-body text-on-surface-variant cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1.5 ml-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Phone
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                    <Icon name="phone" className="text-lg" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-md font-body text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
                    placeholder="+90 555 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Display */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary-container rounded-xl">
                <Icon name="shield_person" className="text-secondary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">System Role</h3>
                <p className="text-xs text-on-surface-variant">Your role is assigned by an administrator</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {ROLES.map((role) => {
                const isActive = user?.role === role.key;
                return (
                  <div
                    key={role.key}
                    className={`relative p-4 rounded-xl text-center transition-all ${
                      isActive
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]"
                        : "bg-surface-container-low text-on-surface-variant opacity-60"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                        <Icon name="check" className="text-primary text-xs" />
                      </div>
                    )}
                    <Icon
                      name={role.icon}
                      className={`text-2xl ${isActive ? "text-on-primary" : "text-on-surface-variant"}`}
                    />
                    <p className={`text-xs font-bold mt-2 ${isActive ? "text-on-primary" : "text-on-surface"}`}>
                      {role.label}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isActive ? "text-on-primary/70" : "text-on-surface-variant"}`}>
                      {role.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-tertiary-container rounded-xl">
                <Icon name="notifications" className="text-on-tertiary-container" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Notification Preferences</h3>
                <p className="text-xs text-on-surface-variant">Choose what updates you want to receive</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Health Alerts */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-error-container/20 rounded-lg">
                    <Icon name="health_and_safety" className="text-error text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Health Alerts</p>
                    <p className="text-xs text-on-surface-variant">Critical animal health notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications((n) => ({ ...n, healthAlerts: !n.healthAlerts }))}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                    notifications.healthAlerts ? "bg-primary" : "bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                      notifications.healthAlerts ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Volunteer Shifts */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-container rounded-lg">
                    <Icon name="schedule" className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Volunteer Shifts</p>
                    <p className="text-xs text-on-surface-variant">Shift assignments and schedule changes</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications((n) => ({ ...n, volunteerShifts: !n.volunteerShifts }))}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                    notifications.volunteerShifts ? "bg-primary" : "bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                      notifications.volunteerShifts ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Weekly Newsletter */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary-container rounded-lg">
                    <Icon name="newspaper" className="text-secondary text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Weekly Newsletter</p>
                    <p className="text-xs text-on-surface-variant">Summary of campus animal welfare activities</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications((n) => ({ ...n, weeklyNewsletter: !n.weeklyNewsletter }))}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                    notifications.weeklyNewsletter ? "bg-primary" : "bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                      notifications.weeklyNewsletter ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-on-surface-variant italic">
              <Icon name="info" className="text-sm align-middle mr-1" />
              Changes to your name and phone will be reflected across the system.
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-10 py-3.5 bg-primary text-on-primary rounded-full font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="save" className="text-lg" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
