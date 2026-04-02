"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextLink, Icon } from "@/components/atoms";
import { FormField, PasswordField, CheckboxField, AlertMessage } from "@/components/molecules";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message || "Giris basarisiz");
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      const role = data.data.user.role;
      if (role === "admin") router.push("/admin");
      else if (role === "advisor") router.push("/advisor");
      else if (role === "volunteer") router.push("/volunteer");
      else if (role === "vet") router.push("/vet");
      else router.push("/dashboard");
    } catch {
      setError("Sunucuya baglanilamadi");
    } finally {
      setLoading(false);
    }
  }

  return (
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

      <AlertMessage message={error} type="error" />

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
            required
          />
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
  );
}
