import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that require authentication
const PROTECTED_ROUTES = ["/dashboard"];

// Pages only for guests (redirect to dashboard if logged in)
const GUEST_ONLY_ROUTES = ["/login", "/register"];

// Public API routes (no Bearer token needed)
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/docs",
  "/api/donations",
  "/api/donations/create-payment-intent",
  "/api/notifications/stream",
];

// Role-based access for dashboard sub-pages
const ROLE_ACCESS: Record<string, string[]> = {
  "/dashboard/users": ["admin", "advisor"],
  "/dashboard/roles": ["admin"],
  "/dashboard/donations": ["admin", "advisor"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── API Routes ─────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    if (PUBLIC_API_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Public GET for projects and articles (landing pages need to read without auth)
    const isPublicReadPath =
      pathname === "/api/projects" ||
      pathname.startsWith("/api/projects/") ||
      pathname === "/api/articles" ||
      pathname.startsWith("/api/articles/");
    if (isPublicReadPath && request.method === "GET") {
      return NextResponse.next();
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: { message: "Missing or invalid Authorization header" } },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // ─── Page Routes ────────────────────────────────────────
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  const isAuthenticated = !!token;

  // Guest-only pages: redirect to dashboard if already logged in
  if (GUEST_ONLY_ROUTES.some((route) => pathname === route)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected pages: redirect to login if not authenticated
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based access check
    for (const [route, allowedRoles] of Object.entries(ROLE_ACCESS)) {
      if (pathname.startsWith(route) && userRole && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
