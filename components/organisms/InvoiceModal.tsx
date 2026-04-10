"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Icon } from "@/components/atoms";
import { downloadInvoice, previewInvoiceURL, type InvoiceData } from "@/lib/helpers/invoice";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  data: InvoiceData | null;
}

export default function InvoiceModal({ open, onClose, data }: InvoiceModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open && data) {
      setPdfUrl(previewInvoiceURL(data));
    } else {
      setPdfUrl(null);
    }
  }, [open, data]);

  if (!data) return null;

  function handleDownload() {
    if (data) downloadInvoice(data);
  }

  function handleOpenInTab() {
    if (pdfUrl) window.open(pdfUrl, "_blank");
  }

  return (
    <Modal open={open} onClose={onClose} title={`Invoice #DON-${String(data.id).padStart(6, "0")}`}>
      <div className="space-y-4">
        {/* PDF Preview */}
        <div className="bg-stone-100 rounded-lg overflow-hidden border border-outline-variant/10">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full"
              style={{ height: "500px" }}
              title="Invoice Preview"
            />
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="bg-surface-container-low p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Donor</span>
            <span className="font-bold text-on-surface">{data.donor_name}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Amount</span>
            <span className="font-bold text-primary text-lg">
              ${Number(data.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Date</span>
            <span className="font-bold text-on-surface">
              {new Date(data.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleOpenInTab}
            className="flex-1 py-3 bg-surface-container-high text-on-surface rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all"
          >
            <Icon name="open_in_new" className="text-lg" />
            Open in New Tab
          </button>
          <div className="flex-1">
            <Button type="button" fullWidth icon="download" onClick={handleDownload}>
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
