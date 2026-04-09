"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms";
import { AddVetModal, EditAvailabilityModal } from "@/components/organisms";
import { useVetsStore } from "@/lib/stores";
import type { VetUser } from "@/lib/stores";

export default function VetsPage() {
  const { vets, loading, fetchVets, deleteVet, getAvailability } = useVetsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editVet, setEditVet] = useState<VetUser | null>(null);

  useEffect(() => {
    fetchVets();
  }, [fetchVets]);

  function handleDelete(vet: VetUser) {
    if (!confirm(`Are you sure you want to remove Dr. ${vet.first_name} ${vet.last_name}?`)) return;
    deleteVet(vet.id, `${vet.first_name} ${vet.last_name}`);
  }

  const activeVets = vets.filter((v) => v.is_active).length;

  return (
    <>
      <AddVetModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      <EditAvailabilityModal open={!!editVet} onClose={() => setEditVet(null)} vet={editVet} />

      <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Medical Staff Directory</span>
            <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">Veterinarians</h2>
            <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
              Manage veterinary staff, update availability, and coordinate medical responses.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10"
          >
            <Icon name="person_add" className="text-lg" />
            Add New Vet
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary-container text-primary rounded-xl"><Icon name="medical_information" /></div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Specialists</p>
            </div>
            <span className="text-3xl font-bold text-on-surface">{loading ? "..." : activeVets}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-secondary-container text-on-secondary-container rounded-xl"><Icon name="event_available" /></div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Vets</p>
            </div>
            <span className="text-3xl font-bold text-on-surface">{loading ? "..." : vets.length}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-tertiary-container text-on-tertiary-container rounded-xl"><Icon name="pending_actions" /></div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Available Now</p>
            </div>
            <span className="text-3xl font-bold text-on-surface">
              {loading ? "..." : vets.filter((v) => getAvailability(v.id)?.is_available).length}
            </span>
          </div>
        </div>

        {/* Table */}
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
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Name</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-center">Availability</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-center">Workload</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center text-on-surface-variant">No veterinarians found.</td>
                    </tr>
                  ) : (
                    vets.map((vet, i) => {
                      const avail = getAvailability(vet.id);
                      const isAvailable = avail?.is_available ?? false;
                      const workloadColors: Record<string, string> = {
                        light: "bg-primary/10 text-primary",
                        moderate: "bg-tertiary-container/30 text-tertiary",
                        heavy: "bg-error-container/20 text-error",
                      };

                      return (
                        <tr key={vet.id} className={`hover:bg-surface-bright transition-colors group ${i % 2 === 1 ? "bg-surface-container-low/10" : ""}`}>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
                                {vet.first_name.charAt(0)}{vet.last_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-on-surface">Dr. {vet.first_name} {vet.last_name}</p>
                                <p className="text-xs text-on-surface-variant">{vet.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm text-on-surface-variant">{vet.phone || "—"}</td>
                          <td className="px-8 py-5">
                            <div className="flex justify-center">
                              {vet.is_active ? (
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
                          <td className="px-8 py-5">
                            <div className="flex justify-center">
                              {avail ? (
                                isAvailable ? (
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">
                                    <Icon name="check_circle" className="text-sm" />Available
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-error-container/20 text-error text-[10px] font-bold rounded-full">
                                    <Icon name="cancel" className="text-sm" />Unavailable
                                  </span>
                                )
                              ) : (
                                <span className="text-xs text-on-surface-variant italic">Not set</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex justify-center">
                              {avail ? (
                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${workloadColors[avail.workload] || workloadColors.light}`}>
                                  {avail.workload}
                                </span>
                              ) : (
                                <span className="text-xs text-on-surface-variant">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditVet(vet)}
                                className="p-2 hover:bg-secondary/10 rounded-full transition-all"
                                title="Edit availability"
                              >
                                <Icon name="edit_calendar" className="text-stone-400 group-hover:text-secondary text-lg" />
                              </button>
                              <button
                                onClick={() => handleDelete(vet)}
                                className="p-2 hover:bg-error-container/20 rounded-full transition-all"
                                title="Remove vet"
                              >
                                <Icon name="delete" className="text-stone-400 group-hover:text-error text-lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-primary to-primary-dim text-on-primary p-10 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 font-headline">On-Call Emergency Protocol</h3>
            <p className="text-on-primary/80 leading-relaxed max-w-lg mb-6">
              Our emergency rotation ensures 24/7 care for campus residents. Specialists marked as &quot;Available&quot; must remain within a 20-minute response radius.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-lg text-center">
                <p className="text-2xl font-bold">{vets.filter((v) => getAvailability(v.id)?.is_available).length}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-70">On Call</p>
              </div>
              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-lg text-center">
                <p className="text-2xl font-bold">15m</p>
                <p className="text-[10px] uppercase tracking-wider opacity-70">Response Time</p>
              </div>
              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-lg text-center">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-[10px] uppercase tracking-wider opacity-70">Coverage</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <div className="h-48 relative bg-primary-container/30 flex items-center justify-center">
              <div className="text-center">
                <div className="p-4 bg-primary-container text-primary rounded-full inline-flex mb-3">
                  <Icon name="local_hospital" className="text-4xl" />
                </div>
                <p className="text-sm font-bold text-on-surface">Campus Veterinary Clinic</p>
                <p className="text-xs text-on-surface-variant mt-1">Building C, Ground Floor</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-container p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-on-surface">{vets.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Total Vets</p>
                </div>
                <div className="bg-surface-container p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-on-surface">3</p>
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Exam Rooms</p>
                </div>
                <div className="bg-surface-container p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-on-surface">1</p>
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Surgery Suite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
