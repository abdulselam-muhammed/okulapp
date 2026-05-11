import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { ApiError } from "./api-error";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const EXT_FROM_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Saves an uploaded File (Web API) under `public/uploads/`.
 * Returns the public URL path (e.g. `/uploads/abc123.jpg`).
 */
export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw ApiError.badRequest(
      `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(", ")}`
    );
  }
  if (file.size > MAX_BYTES) {
    throw ApiError.badRequest(`File too large. Max size: ${MAX_BYTES / 1024 / 1024} MB`);
  }

  const ext = EXT_FROM_MIME[file.type] || "bin";
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}
