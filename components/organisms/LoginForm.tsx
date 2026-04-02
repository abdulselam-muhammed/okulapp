"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextLink, Icon, ToastContainer } from "@/components/atoms";
import { FormField, PasswordField, CheckboxField } from "@/components/molecules";
import { useToast } from "@/lib/hooks/useToast";

export default function LoginForm() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    if (!email.trim()) {
      addToast("Please enter your email address", "error");
      return;
    }

    if (!password) {
      addToast("Please enter your password", "error");
      return;
    }

    if (password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        const msg = data.error?.message || "";

        if (res.status === 401) {
          addToast("Incorrect email or password. Please try again.", "error");
        } else if (res.status === 400) {
          addToast(msg || "Please check your input and try again.", "error");
        } else if (res.status === 404) {
          addToast("No account found with this email address.", "error");
        } else {
          addToast(msg || "Something went wrong. Please try again.", "error");
        }
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      addToast(`Welcome back, ${data.data.user.first_name}!`, "success");

      // Redirect after short delay so user sees the toast
      setTimeout(() => {
        const role = data.data.user.role;
        if (role === "admin") router.push("/admin");
        else if (role === "advisor") router.push("/advisor");
        else if (role === "volunteer") router.push("/volunteer");
        else if (role === "vet") router.push("/vet");
        else router.push("/dashboard");
      }, 800);
    } catch {
      addToast("Unable to connect to server. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="max-w-md mx-auto w-full space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-semibold">
            Login to Portal
          </span>
          <h3 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">
            Welcome Back
          </h3>
          <p className="text-on-surface-variant/70 font-body">
            Sign in to continue managing our campus residents.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="mail"
            />
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between">
            <CheckboxField
              label="Remember Me"
              checked={remember}
              onChange={setRemember}
            />
            <TextLink href="#">Forgot Password?</TextLink>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            loading={loading}
            icon="arrow_forward"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <footer className="pt-8 text-center space-y-4">
          <p className="text-on-surface-variant/60 text-sm font-body">
            Don&apos;t have access yet?{" "}
            <TextLink href="/register" className="font-bold">
              Contact Administrator
            </TextLink>
          </p>
          <div className="flex items-center justify-center space-x-4 opacity-50">
            <Icon name="shield" className="text-sm" />
            <span className="text-[10px] font-label uppercase tracking-widest">
              Secure Campus Authentication
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
