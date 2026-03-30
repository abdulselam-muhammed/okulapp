import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/docs",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-API routes (pages, static files, etc.)
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Allow public auth routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for Authorization header on all other API routes
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: { message: "Missing or invalid Authorization header" } },
      { status: 401 }
    );
  }

  // Token verification is done in route handlers via getAuth() / requireRole()
  // Proxy only checks that a token is present
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
