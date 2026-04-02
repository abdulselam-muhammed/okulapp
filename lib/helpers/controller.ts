import { type ZodSchema, ZodError } from "zod";
import { ApiError } from "./api-error";
import * as res from "./api-response";

/**
 * Wraps a route handler with error handling.
 * Catches ApiError and ZodError, returns standardized responses.
 * Supports both simple handlers (req) and dynamic route handlers (req, ctx).
 */
export function handler(fn: (req: Request, ctx?: any) => Promise<Response>) {
  return async (req: Request, ctx?: any) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.error(
          ApiError.badRequest("Validation failed", err.flatten().fieldErrors)
        );
      }
      return res.error(err);
    }
  };
}

/**
 * Parses and validates request JSON body against a Zod schema.
 * Throws ApiError.badRequest with field details on failure.
 */
export async function validate<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  const body = await req.json().catch(() => {
    throw ApiError.badRequest("Invalid JSON body");
  });
  return schema.parse(body);
}

/**
 * Extracts pagination params from URL search params.
 */
export function pagination(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  return { limit, offset };
}

/**
 * Extracts a single search param value.
 */
export function param(req: Request, key: string): string | null {
  const url = new URL(req.url);
  return url.searchParams.get(key);
}
