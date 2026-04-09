"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Icon } from "@/components/atoms";
import { SelectField } from "@/components/molecules";
import { useVetsStore, useToastStore } from "@/lib/stores";
import type { VetUser } from "@/lib/stores";

const WORKLOAD_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "heavy", label: "Heavy" },
];

interface EditAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  vet: VetUser | null;
}

export default function EditAvailabilityModal({ open, onClose, vet }: EditAvailabilityModalProps) {
  const updateAvailability = useVetsStore((s) => s.updateAvailability);
  const getAvailability = useVetsStore((s) => s.getAvailability);
  const addToast = useToastStore((s) => s.addToast);

  const [isAvailable, setIsAvailable] = useState(true);
  const [workload, setWorkload] = useState("light");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vet) {
      const existing = getAvailability(vet.id);
      if (existing) {
        setIsAvailable(existing.is_available);
        setWorkload(existing.workload || "light");
        setNote(existing.note || "");
      } else {
        setIsAvailable(true);
        setWorkload("light");
        setNote("");
      }
    }
  }, [vet, getAvailability]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vet) return;

    setLoading(true);
    const success = await updateAvailability(vet.id, {
      is_available: isAvailable,
      workload,
      ...(note && { note }),
    });
    setLoading(false);

    if (success) onClose();
  }

  if (!vet) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit Availability — Dr. ${vet.first_name} ${vet.last_name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
          <div className="flex items-center gap-3">
            <Icon name={isAvailable ? "check_circle" : "cancel"} className={isAvailable ? "text-primary text-xl" : "text-error text-xl"} filled />
            <div>
              <p className="font-bold text-on-surface">{isAvailable ? "Available" : "Unavailable"}</p>
              <p className="text-xs text-on-surface-variant">Toggle availability status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative w-14 h-7 rounded-full transition-colors ${isAvailable ? "bg-primary" : "bg-stone-300"}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${isAvailable ? "translate-x-7" : "translate-x-0.5"}`} />
          </button>
        </div>

        {/* Workload */}
        <SelectField
          id="vet_workload"
          label="Current Workload"
          value={workload}
          onChange={(e) => setWorkload(e.target.value)}
          options={WORKLOAD_OPTIONS}
          icon="speed"
        />

        {/* Note */}
        <div className="space-y-2">
          <label className="block font-label text-sm font-semibold text-on-surface-variant px-1">Note (optional)</label>
          <textarea
            className="w-full px-4 py-4 bg-surface-container-low border-none rounded-md font-body text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
            placeholder="e.g. On leave until Friday..."
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="pt-2 flex gap-3">
          <Button type="submit" fullWidth loading={loading} icon="save">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
