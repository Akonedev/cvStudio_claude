import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, err, withAuth } from "@/lib/api-response";
import { logHistory } from "@/lib/history";

// ─── Validation schema ─────────────────────────────────────────────────────────

const ImportSchema = z.object({
  title: z.string().min(1).max(100).default("CV importé"),
  template: z.string().max(50).default("modern"),
  hasSidebar: z.boolean().default(false),
  sidebarPos: z.enum(["LEFT", "RIGHT"]).default("LEFT"),
  sidebarTheme: z.string().max(50).optional(),
  data: z.record(z.string(), z.unknown()).optional().default({}),
});

// ─── POST /api/cvs/import ─────────────────────────────────────────────────────

export const POST = withAuth(async (req: NextRequest, session) => {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return err("Corps de requête JSON invalide", 400);
  }

  const parsed = ImportSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.message, 400, "VALIDATION_ERROR");
  }

  const {
    title,
    template,
    hasSidebar,
    sidebarPos,
    sidebarTheme,
    data,
  } = parsed.data;

  // Inject import metadata into the data blob
  const enrichedData = {
    ...data,
    _import: {
      importedAt: new Date().toISOString(),
      originalTemplate: template,
      source: "user-import",
    },
  };

  const cv = await prisma.cV.create({
    data: {
      userId: session.user.id,
      title,
      template,
      hasSidebar,
      sidebarPos,
      ...(sidebarTheme ? { sidebarTheme } : {}),
      data: enrichedData as never,
      status: "DRAFT",
    },
    select: {
      id: true,
      title: true,
      template: true,
      hasSidebar: true,
      sidebarPos: true,
      status: true,
      createdAt: true,
    },
  });

  await logHistory(session.user.id, "CREATE", "CV", cv.id, {
    title: cv.title,
    source: "import",
    template,
  });

  return ok(cv, 201);
});
