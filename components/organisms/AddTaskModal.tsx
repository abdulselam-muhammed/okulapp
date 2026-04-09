"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "@/components/atoms";
import { FormField, SelectField, MapPicker } from "@/components/molecules";
import { useTasksStore, useAuthStore, useToastStore } from "@/lib/stores";

const TYPE_OPTIONS = [
  { value: "rescue", label: "Rescue" },
  { value: "feeding", label: "Feeding" },
  { value: "vet_transport", label: "Vet Transport" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

interface Volunteer {
  id: number;
  first_name: string;
  last_name: string;
}

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  initialLat?: number | null;
  initialLng?: number | null;
}

export default function AddTaskModal({ open, onClose, initialLat, initialLng }: AddTaskModalProps) {
  const addTask = useTasksStore((s) => s.addTask);
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);

  const [type, setType] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [lat, setLat] = useState<number | null>(initialLat ?? null);
  const [lng, setLng] = useState<number | null>(initialLng ?? null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);

  // Reset when initial location changes (e.g. from map click)
  useEffect(() => {
    if (initialLat && initialLng) {
      setLat(initialLat);
      setLng(initialLng);
    }
  }, [initialLat, initialLng]);

  // Fetch volunteers and filter out those with active tasks
  useEffect(() => {
    if (!open || !token) return;
    async function fetchAvailableVolunteers() {
      try {
        const [volRes, taskRes] = await Promise.all([
          fetch("/api/users?role=volunteer&limit=100", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/tasks?limit=100", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const volData = await volRes.json();
        const taskData = await taskRes.json();

        if (volData.success) {
          const tasks = taskData.success ? taskData.data : [];
          const busyIds = new Set(
            tasks
              .filter((t: { status: string }) => t.status === "accepted" || t.status === "in_progress")
              .map((t: { assigned_to: number }) => t.assigned_to)
          );
          setVolunteers(volData.data.filter((v: Volunteer) => !busyIds.has(v.id)));
        }
      } catch { /* ignore */ }
    }
    fetchAvailableVolunteers();
  }, [open, token]);

  function reset() {
    setType("");
    setPriority("medium");
    setAssignedTo("");
    setNotes("");
    setDeadline("");
    setLat(null);
    setLng(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!type) { addToast("Please select a task type"); return; }
    if (!assignedTo) { addToast("Please select a volunteer to assign"); return; }

    setLoading(true);
    const success = await addTask({
      type,
      priority,
      assigned_to: Number(assignedTo),
      ...(notes && { notes: lat && lng ? `${notes} [Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}]` : notes }),
      ...(!notes && lat && lng && { notes: `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}` }),
      ...(deadline && { deadline: new Date(deadline).toISOString() }),
    });
    setLoading(false);

    if (success) {
      reset();
      onClose();
    }
  }

  const volunteerOptions = volunteers.map((v) => ({
    value: String(v.id),
    label: `${v.first_name} ${v.last_name}`,
  }));

  return (
    <Modal open={open} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="task_type"
            label="Task Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={TYPE_OPTIONS}
            placeholder="Select type"
            icon="category"
            required
          />
          <SelectField
            id="task_priority"
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={PRIORITY_OPTIONS}
            icon="flag"
          />
        </div>

        <SelectField
          id="task_assigned_to"
          label="Assign to Volunteer"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          options={volunteerOptions}
          placeholder={volunteers.length === 0 ? "No available volunteers" : "Select available volunteer"}
          icon="person"
          required
        />

        <div className="space-y-2">
          <label className="block font-label text-sm font-semibold text-on-surface-variant px-1">Notes (optional)</label>
          <textarea
            className="w-full px-4 py-4 bg-surface-container-low border-none rounded-md font-body text-sm text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
            placeholder="Describe the task..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <FormField
          id="task_deadline"
          label="Deadline (optional)"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          icon="event"
        />

        <MapPicker
          label="Task Location (optional)"
          lat={lat}
          lng={lng}
          onChange={(newLat, newLng) => {
            if (newLat === 0 && newLng === 0) {
              setLat(null);
              setLng(null);
            } else {
              setLat(newLat);
              setLng(newLng);
            }
          }}
        />

        <div className="pt-2">
          <Button type="submit" fullWidth loading={loading} icon="add_task">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
