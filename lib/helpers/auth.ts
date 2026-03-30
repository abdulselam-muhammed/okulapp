import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "./api-error";
import type { UserRole } from "@/lib/types/db";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
}

/**
 * Extracts JWT payload from the Authorization header.
 * Use in route handlers to get the current user.
 */
export function getAuth(req: Request): JwtPayload {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing or invalid Authorization header");
  }
  const token = header.slice(7);
  return verifyToken(token);
}

/**
 * Extracts JWT payload and enforces that the user has one of the allowed roles.
 */
export function requireRole(req: Request, ...roles: UserRole[]): JwtPayload {
  const auth = getAuth(req);
  if (!roles.includes(auth.role)) {
    throw ApiError.forbidden("You do not have permission for this action");
  }
  return auth;
}
