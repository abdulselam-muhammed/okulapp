"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextLink, Icon } from "@/components/atoms";
import { FormField, PasswordField, CheckboxField } from "@/components/molecules";
import { useAuthStore, useToastStore } from "@/lib/stores";

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const addToast = useToastStore((s) => s.addToast);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) { addToast("Please enter your email address"); return; }
    if (!password) { addToast("Please enter your password"); return; }
    if (password.length < 6) { addToast("Password must be at least 6 characters"); return; }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        if (res.status === 401) addToast("Incorrect email or password. Please try again.");
        else if (res.status === 404) addToast("No account found with this email address.");
        else addToast(data.error?.message || "Something went wrong. Please try again.");
        return;
      }

      login(data.data.user, data.data.token);
      addToast(`Welcome back, ${data.data.user.first_name}!`, "success");

      setTimeout(() => router.push("/dashboard"), 800);
    } catch {
      addToast("Unable to connect to server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto w-full space-y-10">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormField id="email" label="Email Address" type="email" placeholder="name@campus.edu" value={email} onChange={(e) => setEmail(e.target.value)} icon="mail" />
          <PasswordField id="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="flex items-center justify-between">
          <CheckboxField label="Remember Me" checked={remember} onChange={setRemember} />
          <TextLink href="#">Forgot Password?</TextLink>
        </div>

        <Button type="submit" fullWidth loading={loading} icon="arrow_forward">
          Sign In
        </Button>
      </form>

      <footer className="pt-8 text-center space-y-4">
        <p className="text-on-surface-variant/60 text-sm font-body">
          Don&apos;t have access yet?{" "}
          <TextLink href="/register" className="font-bold">Contact Administrator</TextLink>
        </p>
        <div className="flex items-center justify-center space-x-4 opacity-50">
          <Icon name="shield" className="text-sm" />
          <span className="text-[10px] font-label uppercase tracking-widest">Secure Campus Authentication</span>
        </div>
      </footer>
    </div>
  );
}
