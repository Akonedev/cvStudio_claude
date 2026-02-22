import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, withAuth } from "@/lib/api-response";
import { logHistory } from "@/lib/history";

export const POST = withAuth(async (_req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const cv = await prisma.cV.findFirst({ where: { id, userId: session.user.id } });
  if (!cv) return notFound("CV introuvable");

  // Unset all active CVs for this user, then set the chosen one
  await prisma.$transaction([
    prisma.cV.updateMany({ where: { userId: session.user.id }, data: { isActive: false } }),
    prisma.cV.update({ where: { id }, data: { isActive: true } }),
  ]);

  await logHistory(session.user.id, "UPDATE", "CV", id, { action: "set_active" });
  return ok({ id, isActive: true });
});
