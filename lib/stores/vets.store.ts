import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import { useToastStore } from "./toast.store";

export interface VetUser {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
}

export interface VetAvailability {
  id: number;
  vet_id: number;
  is_available: boolean;
  workload: string;
  note: string | null;
}

interface VetsStore {
  vets: VetUser[];
  availability: VetAvailability[];
  loading: boolean;
  fetchVets: () => Promise<void>;
  addVet: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
  }) => Promise<boolean>;
  deleteVet: (vetId: number, name: string) => Promise<void>;
  updateAvailability: (vetId: number, data: {
    is_available: boolean;
    workload?: string;
    note?: string;
  }) => Promise<boolean>;
  getAvailability: (vetId: number) => VetAvailability | undefined;
}

function getToken() {
  return useAuthStore.getState().token;
}

function headers() {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
}

export const useVetsStore = create<VetsStore>((set, get) => ({
  vets: [],
  availability: [],
  loading: false,

  fetchVets: async () => {
    const toast = useToastStore.getState();
    set({ loading: true });

    try {
      const [vetsRes, availRes] = await Promise.all([
        fetch("/api/users?role=vet&limit=100&offset=0", {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch("/api/vet/availability", {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);

      const vetsData = await vetsRes.json();
      const availData = await availRes.json();

      if (vetsData.success) set({ vets: vetsData.data });
      else toast.addToast(vetsData.error?.message || "Failed to fetch vets", "error");

      if (availData.success) set({ availability: availData.data });
    } catch {
      toast.addToast("Unable to connect to server", "error");
    } finally {
      set({ loading: false });
    }
  },

  addVet: async (data) => {
    const toast = useToastStore.getState();
    const { latitude, longitude, ...registerData } = data;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ ...registerData, role: "vet" }),
      });
      const result = await res.json();

      if (result.success) {
        // Save location if provided
        if (latitude && longitude && result.data?.user?.id) {
          await fetch(`/api/users/${result.data.user.id}`, {
            method: "PUT",
            headers: headers(),
            body: JSON.stringify({ latitude, longitude }),
          });
        }

        toast.addToast(`Dr. ${data.first_name} ${data.last_name} added successfully`, "success");
        get().fetchVets();
        return true;
      } else {
        if (res.status === 409) toast.addToast("This email is already registered", "error");
        else toast.addToast(result.error?.message || "Failed to add vet", "error");
        return false;
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },

  deleteVet: async (vetId, name) => {
    const toast = useToastStore.getState();

    try {
      const res = await fetch(`/api/users/${vetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.status === 204) {
        toast.addToast(`Dr. ${name} has been removed`, "success");
        get().fetchVets();
      } else {
        const data = await res.json();
        toast.addToast(data.error?.message || "Failed to delete vet", "error");
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
    }
  },

  updateAvailability: async (vetId, data) => {
    const toast = useToastStore.getState();

    try {
      const res = await fetch("/api/vet/availability", {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        toast.addToast("Availability updated", "success");
        get().fetchVets();
        return true;
      } else {
        toast.addToast(result.error?.message || "Failed to update availability", "error");
        return false;
      }
    } catch {
      toast.addToast("Unable to connect to server", "error");
      return false;
    }
  },

  getAvailability: (vetId) => {
    return get().availability.find((a) => a.vet_id === vetId);
  },
}));
