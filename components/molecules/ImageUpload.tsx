"use client";

import { useRef, useState } from "react";
import { Icon, Label } from "@/components/atoms";
import { useAuthStore, useToastStore } from "@/lib/stores";

interface SingleImageUploadProps {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
}

/**
 * Single-image upload field. Posts to /api/upload, stores the returned URL.
 */
export function ImageUpload({ label = "Image", value, onChange }: SingleImageUploadProps) {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        onChange(data.data.url);
        addToast("Image uploaded", "success");
      } else {
        addToast(data.error?.message || "Upload failed", "error");
      }
    } catch {
      addToast("Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>

      {value ? (
        <div className="relative group">
          <img src={value} alt="" className="w-full h-48 object-cover rounded-md border border-outline-variant/20" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-8 h-8 bg-error text-on-error rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Icon name="close" className="text-sm" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-48 border-2 border-dashed border-outline-variant/40 rounded-md flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <>
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Icon name="cloud_upload" className="text-3xl" />
              <span className="text-sm font-medium">Click to upload image</span>
              <span className="text-xs">JPEG / PNG / WebP / GIF, max 5MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

interface MultiImageUploadProps {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
}

/**
 * Multi-image upload field for galleries.
 */
export function MultiImageUpload({ label = "Gallery", values, onChange }: MultiImageUploadProps) {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          uploaded.push(data.data.url);
        } else {
          addToast(`${file.name}: ${data.error?.message || "upload failed"}`, "error");
        }
      } catch {
        addToast(`${file.name}: network error`, "error");
      }
    }

    if (uploaded.length > 0) {
      onChange([...values, ...uploaded]);
      addToast(`${uploaded.length} image(s) uploaded`, "success");
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="multi-image-upload">{label}</Label>

      <div className="grid grid-cols-3 gap-3">
        {values.map((url, idx) => (
          <div key={idx} className="relative group">
            <img src={url} alt="" className="w-full h-24 object-cover rounded-md border border-outline-variant/20" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute top-1 right-1 w-6 h-6 bg-error text-on-error rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="close" className="text-xs" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="h-24 border-2 border-dashed border-outline-variant/40 rounded-md flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Icon name="add_photo_alternate" className="text-xl" />
              <span className="text-[10px] font-medium">Add</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
