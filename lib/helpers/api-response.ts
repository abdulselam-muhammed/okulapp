import { ApiError } from "./api-error";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function success<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return Response.json(body, { status });
}

export function created<T>(data: T) {
  return success(data, undefined, 201);
}

export function noContent() {
  return new Response(null, { status: 204 });
}

export function error(err: unknown) {
  if (err instanceof ApiError) {
    const body: ApiErrorResponse = {
      success: false,
      error: { message: err.message, details: err.details },
    };
    return Response.json(body, { status: err.statusCode });
  }

  console.error("Unhandled error:", err);
  const body: ApiErrorResponse = {
    success: false,
    error: { message: "Internal server error" },
  };
  return Response.json(body, { status: 500 });
}
