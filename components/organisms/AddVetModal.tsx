"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/atoms";
import { FormField, PasswordField, AddressPicker } from "@/components/molecules";
import { useVetsStore, useToastStore } from "@/lib/stores";

interface AddVetModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddVetModal({ open, onClose }: AddVetModalProps) {
  const addVet = useVetsStore((s) => s.addVet);
  const addToast = useToastStore((s) => s.addToast);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  function reset() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setAddress("");
    setLat(null);
    setLng(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim()) { addToast("Please enter first name"); return; }
    if (!lastName.trim()) { addToast("Please enter last name"); return; }
    if (!email.trim()) { addToast("Please enter email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { addToast("Please enter a valid email"); return; }
    if (!password || password.length < 6) { addToast("Password must be at least 6 characters"); return; }

    setLoading(true);
    const success = await addVet({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      ...(phone && { phone: phone.slice(0, 20) }),
      ...(lat && lng && { latitude: lat, longitude: lng }),
    });
    setLoading(false);

    if (success) {
      reset();
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Veterinarian">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField id="vet_first_name" label="First Name" placeholder="Mehmet" value={firstName} onChange={(e) => setFirstName(e.target.value)} icon="person" />
          <FormField id="vet_last_name" label="Last Name" placeholder="Kaya" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <FormField id="vet_email" label="Email Address" type="email" placeholder="vet@campus.edu" value={email} onChange={(e) => setEmail(e.target.value)} icon="mail" />
        <FormField id="vet_phone" label="Phone (optional)" type="tel" placeholder="05551234567" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} icon="phone" maxLength={20} />
        <PasswordField id="vet_password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <AddressPicker
          label="Clinic / Office Address"
          value={address}
          onChange={(addr, latitude, longitude) => {
            setAddress(addr);
            setLat(latitude);
            setLng(longitude);
          }}
        />

        {lat && lng && (
          <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-lg border border-primary/10">
            <span className="material-symbols-outlined text-primary text-lg">pin_drop</span>
            <div className="text-xs">
              <p className="font-bold text-on-surface">{address}</p>
              <p className="text-on-surface-variant">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-on-surface-variant italic">This user will be registered with the <strong>vet</strong> role. The address will be saved as their location on the map.</p>

        <div className="pt-2">
          <Button type="submit" fullWidth loading={loading} icon="person_add">Add Veterinarian</Button>
        </div>
      </form>
    </Modal>
  );
}
