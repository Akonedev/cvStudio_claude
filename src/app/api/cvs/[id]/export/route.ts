import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, err, withAuth } from "@/lib/api-response";
import { createCompletion } from "@/lib/ai-service";
import { logHistory } from "@/lib/history";

/**
 * POST /api/cvs/[id]/export
 * Body: { format: "PDF" | "DOCX" | "ODT" | "TXT" }
 * Returns a download URL or binary depending on format.
 */
export const POST = withAuth(async (req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const cv = await prisma.cV.findFirst({ where: { id, userId: session.user.id } });
  if (!cv) return notFound("CV introuvable");

  const { format = "PDF" } = await req.json().catch(() => ({}));
  const validFormats = ["PDF", "DOCX", "ODT", "TXT"];
  if (!validFormats.includes(format)) return err(`Format invalide. Utilisez: ${validFormats.join(", ")}`, 400);

  // Log export action
  await logHistory(session.user.id, "EXPORT", "CV", id, { format });

  // Return the CV data and format so the client can build the file
  // (actual PDF/DOCX generation is done client-side via @react-pdf/renderer or docx)
  return ok({
    cvId: id,
    format,
    data: cv.data,
    title: cv.title,
    template: cv.template,
    exportedAt: new Date().toISOString(),
  });
});
