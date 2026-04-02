"use client";

import { useEffect } from "react";
import Icon from "./Icon";

export interface ToastData {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const styles = {
    error: {
      bg: "bg-error-container/90 border-error/40",
      text: "text-on-error-container",
      icon: "error",
    },
    success: {
      bg: "bg-primary-container/90 border-primary/40",
      text: "text-on-primary-container",
      icon: "check_circle",
    },
    info: {
      bg: "bg-secondary-container/90 border-secondary/40",
      text: "text-on-secondary-container",
      icon: "info",
    },
  };

  const s = styles[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-lg border backdrop-blur-md shadow-lg ${s.bg} ${s.text} animate-slide-in`}
    >
      <Icon name={s.icon} className="text-xl shrink-0" filled />
      <p className="font-body text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <Icon name="close" className="text-lg" />
      </button>
    </div>
  );
}
