"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextLink, Icon, ToastContainer } from "@/components/atoms";
import { FormField, PasswordField, SelectField } from "@/components/molecules";
import { useToast } from "@/lib/hooks/useToast";

const ROLE_OPTIONS = [
  { value: "user", label: "User — Report injured animals" },
  { value: "volunteer", label: "Volunteer — Help with rescue tasks" },
  { value: "vet", label: "Veterinarian — Treat animals" },
];

export default function RegisterForm() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim()) {
      addToast("Please enter your first name", "error");
      return;
    }
    if (!lastName.trim()) {
      addToast("Please enter your last name", "error");
      return;
    }
    if (!email.trim()) {
      addToast("Please enter your email address", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast("Please enter a valid email address (e.g. name@campus.edu)", "error");
      return;
    }
    if (phone && !/^\d+$/.test(phone)) {
      addToast("Phone number must contain only digits", "error");
      return;
    }
    if (!password) {
      addToast("Please enter a password", "error");
      return;
    }
    if (password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    if (!confirmPassword) {
      addToast("Please confirm your password", "error");
      return;
    }
    if (password !== confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }
    if (!role) {
      addToast("Please select a role", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          first_name: firstName,
          last_name: lastName,
          ...(phone && { phone }),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        const msg = data.error?.message || "";

        if (res.status === 409) {
          addToast("This email is already registered. Try signing in instead.", "error");
        } else if (res.status === 400) {
          if (msg.toLowerCase().includes("email")) {
            addToast("Please enter a valid email address", "error");
          } else if (msg.toLowerCase().includes("password")) {
            addToast("Password must be at least 6 characters", "error");
          } else {
            addToast(msg || "Please check your input and try again.", "error");
          }
        } else {
          addToast(msg || "Something went wrong. Please try again.", "error");
        }
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      addToast("Account created successfully! Redirecting...", "success");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch {
      addToast("Unable to connect to server. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="bg-surface-container-lowest rounded-lg p-10 editorial-shadow ghost-border">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-on-surface font-headline mb-2">
            Create Account
          </h2>
          <p className="text-on-surface-variant font-body">
            Sign up to start your journey with us.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name fields side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="first_name"
              label="First Name"
              placeholder="Ali"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              icon="person"
            />
            <FormField
              id="last_name"
              label="Last Name"
              placeholder="Yilmaz"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <FormField
            id="email"
            label="Email Address"
            type="email"
            placeholder="example@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="mail"
          />

          <FormField
            id="phone"
            label="Phone (optional)"
            type="tel"
            placeholder="05551234567"
            value={phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPhone(val);
            }}
            icon="phone"
          />

          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordField
            id="confirm_password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <SelectField
            id="role"
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={ROLE_OPTIONS}
            placeholder="Select your role"
            icon="badge"
            required
          />

          <div className="pt-4">
            <Button
              type="submit"
              fullWidth
              loading={loading}
              icon="arrow_forward"
            >
              Register Account
            </Button>
          </div>

          <p className="text-center text-on-surface-variant text-sm pt-4">
            Already have an account?{" "}
            <TextLink href="/login" className="font-bold">
              Sign In
            </TextLink>
          </p>
        </form>
      </div>
    </>
  );
}
