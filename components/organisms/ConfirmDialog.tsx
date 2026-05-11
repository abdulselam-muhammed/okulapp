"use client";

import { useState } from "react";
import { Modal, Icon } from "@/components/atoms";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const VARIANT_STYLES = {
  danger: {
    iconBg: "bg-error-container/20",
    iconColor: "text-error",
    icon: "delete_forever",
    button: "bg-error text-on-error hover:bg-error-dim",
  },
  warning: {
    iconBg: "bg-tertiary-container/30",
    iconColor: "text-tertiary",
    icon: "warning",
    button: "bg-tertiary text-on-tertiary hover:bg-tertiary-dim",
  },
  info: {
    iconBg: "bg-primary-container",
    iconColor: "text-primary",
    icon: "info",
    button: "bg-primary text-on-primary hover:bg-primary-dim",
  },
} as const;

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message,
  detail,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const styles = VARIANT_STYLES[variant];

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-6">
        {/* Icon + message */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center shrink-0`}>
            <Icon name={styles.icon} className={`${styles.iconColor} text-2xl`} filled />
          </div>
          <div className="flex-1 pt-1">
            <p className="text-on-surface font-medium leading-relaxed">{message}</p>
            {detail && (
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{detail}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 bg-surface-container-high text-on-surface rounded-full font-bold text-sm hover:bg-surface-container-highest transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-full font-bold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${styles.button}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Working...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
