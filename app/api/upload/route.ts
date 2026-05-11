import { handler } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import { ApiError } from "@/lib/helpers/api-error";
import * as res from "@/lib/helpers/api-response";
import { saveUploadedFile } from "@/lib/helpers/upload";

export const POST = handler(async (req) => {
  // Require authentication — only logged-in users can upload
  getAuth(req);

  const formData = await req.formData().catch(() => {
    throw ApiError.badRequest("Invalid multipart form data");
  });

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw ApiError.badRequest("No file provided");
  }

  const url = await saveUploadedFile(file);
  return res.created({ url });
});
