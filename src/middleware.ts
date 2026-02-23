import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PROTECTED_PAGES = ["/dashboard"];
const PROTECTED_APIS = [
  "/api/cvs", "/api/cover-letters", "/api/job-offers", "/api/job-matches",
  "/api/interview", "/api/history", "/api/subscriptions", "/api/payments",
  "/api/ai", "/api/notifications", "/api/user",
];
const ADMIN_ROUTES = ["/admin", "/api/admin"];

export default auth(function middleware(req) {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;

  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p));
  const isProtectedApi  = PROTECTED_APIS.some((p) => pathname.startsWith(p));
  const isAdminRoute    = ADMIN_ROUTES.some((p) => pathname.startsWith(p));

  if (isAdminRoute) {
    const role = (req.auth?.user as { role?: string } | undefined)?.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (isProtectedApi && !isLoggedIn) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};




