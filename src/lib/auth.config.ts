/**
 * Edge-compatible NextAuth config (no Node.js-only imports)
 * Used by middleware — does NOT import Prisma, bcrypt, or pg
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error role is added by custom user
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error role is added by custom token
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const protectedRoutes = [
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

      const adminRoutes = ["/admin", "/api/admin"];

      const isProtected = protectedRoutes.some((p) =>
        pathname.startsWith(p)
      );
      const isAdminRoute = adminRoutes.some((p) => pathname.startsWith(p));

      if (isAdminRoute) {
        const role = (auth as unknown as { user?: { role?: string } })?.user?.role;
        return role === "ADMIN" || role === "SUPER_ADMIN";
      }

      if (isProtected) return isLoggedIn;

      return true;
    },
  },
} satisfies NextAuthConfig;
