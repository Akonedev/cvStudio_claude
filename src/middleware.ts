import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATTERNS = [
  "/dashboard",
  "/api/cvs",
  "/api/cover-letters",
  "/api/job-offers",
  "/api/job-matches",
  "/api/interview",
  "/api/history",
  "/api/subscriptions",
  "/api/payments",
  "/api/ai",
  "/api/notifications",
  "/api/user",
];

const ADMIN_PATTERNS = ["/admin", "/api/admin"];

const PUBLIC_PATTERNS = [
  "/",
  "/login",
  "/signup",
  "/api/auth",
  "/api/webhooks",
];

export default auth((req: NextRequest & { auth?: unknown }) => {
  const { pathname } = req.nextUrl;
  const session = (req as unknown as { auth: { user?: { id: string; role?: string } } | null }).auth;

  // Allow public routes
  if (PUBLIC_PATTERNS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Require auth for protected routes
  const isProtected = PROTECTED_PATTERNS.some((p) => pathname.startsWith(p));
  const isAdmin = ADMIN_PATTERNS.some((p) => pathname.startsWith(p));

  if ((isProtected || isAdmin) && !session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Non autorisé", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes
  if (isAdmin && session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Accès refusé", code: "FORBIDDEN" },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
