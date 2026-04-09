"use client";

import { useEffect } from "react";
import Icon from "./Icon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative bg-surface-container-lowest rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-2xl font-headline font-bold text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <Icon name="close" className="text-on-surface-variant" />
          </button>
        </div>
        <div className="px-8 pb-8">{children}</div>
      </div>
    </div>
  );
}
