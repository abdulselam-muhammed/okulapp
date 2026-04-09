"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/atoms";
import { FormField, PasswordField, SelectField } from "@/components/molecules";
import { useUsersStore, useToastStore } from "@/lib/stores";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "volunteer", label: "Volunteer" },
  { value: "advisor", label: "Advisor" },
  { value: "vet", label: "Veterinarian" },
  { value: "admin", label: "Admin" },
];

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddUserModal({ open, onClose }: AddUserModalProps) {
  const addUser = useUsersStore((s) => s.addUser);
  const addToast = useToastStore((s) => s.addToast);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRole("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim()) { addToast("Please enter first name"); return; }
    if (!lastName.trim()) { addToast("Please enter last name"); return; }
    if (!email.trim()) { addToast("Please enter email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { addToast("Please enter a valid email"); return; }
    if (!password || password.length < 6) { addToast("Password must be at least 6 characters"); return; }
    if (!role) { addToast("Please select a role"); return; }

    setLoading(true);
    const success = await addUser({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
      ...(phone && { phone }),
    });
    setLoading(false);

    if (success) {
      reset();
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New User">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="add_first_name"
            label="First Name"
            placeholder="Ali"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            icon="person"
          />
          <FormField
            id="add_last_name"
            label="Last Name"
            placeholder="Yilmaz"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <FormField
          id="add_email"
          label="Email Address"
          type="email"
          placeholder="user@campus.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="mail"
        />

        <FormField
          id="add_phone"
          label="Phone (optional)"
          type="tel"
          placeholder="05551234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          icon="phone"
          maxLength={20}
        />

        <PasswordField
          id="add_password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <SelectField
          id="add_role"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLE_OPTIONS}
          placeholder="Select a role"
          icon="badge"
          required
        />

        <div className="pt-4 flex gap-3">
          <Button type="submit" fullWidth loading={loading} icon="person_add">
            Add User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
