import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

type Session = { user: { id: string; email?: string | null; role?: string } };
type RouteContext = { params?: Promise<Record<string, string>> };
type AuthHandler = (req: NextRequest, session: Session, ctx: RouteContext) => Promise<NextResponse>;

// ─── Response helpers ────────────────────────────────────────────────────────

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(error: string, status = 400, code?: string): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error, code }, { status });
}

export function notFound(msg = "Ressource introuvable"): NextResponse<ApiError> {
  return err(msg, 404, "NOT_FOUND");
}

/** @deprecated Use ok() */
export function successResponse<T>(data: T, message?: string, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data, message }, { status });
}

/** @deprecated Use err() */
export function errorResponse(error: string, status = 400, code?: string): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error, code }, { status });
}

export function unauthorizedResponse(msg = "Non autorisé"): NextResponse<ApiError> {
  return err(msg, 401, "UNAUTHORIZED");
}

export function forbiddenResponse(msg = "Accès refusé"): NextResponse<ApiError> {
  return err(msg, 403, "FORBIDDEN");
}

export function notFoundResponse(msg = "Ressource introuvable"): NextResponse<ApiError> {
  return err(msg, 404, "NOT_FOUND");
}

export function serverErrorResponse(msg = "Erreur serveur interne"): NextResponse<ApiError> {
  return err(msg, 500, "SERVER_ERROR");
}

// ─── Route wrappers ──────────────────────────────────────────────────────────

/**
 * Wraps a route handler with authentication check.
 * The handler receives the validated session.
 */
export function withAuth(handler: AuthHandler) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    try {
      const session = await auth() as Session | null;
      if (!session?.user?.id) {
        return err("Non autorisé", 401, "UNAUTHORIZED");
      }
      return await handler(req, session, ctx);
    } catch (e) {
      console.error("[withAuth] Error:", e);
      return err("Erreur serveur interne", 500, "SERVER_ERROR");
    }
  };
}

/**
 * Wraps a route handler requiring ADMIN or SUPER_ADMIN role.
 */
export function withAdmin(handler: AuthHandler) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    try {
      const session = await auth() as Session | null;
      if (!session?.user?.id) {
        return err("Non autorisé", 401, "UNAUTHORIZED");
      }
      if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role ?? "")) {
        return err("Accès refusé", 403, "FORBIDDEN");
      }
      return await handler(req, session, ctx);
    } catch (e) {
      console.error("[withAdmin] Error:", e);
      return err("Erreur serveur interne", 500, "SERVER_ERROR");
    }
  };
}
