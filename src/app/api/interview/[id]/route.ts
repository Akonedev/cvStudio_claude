import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, withAuth } from "@/lib/api-response";

export const GET = withAuth(async (req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const prep = await prisma.interviewPrep.findFirst({
    where: { id, userId: session.user.id },
    include: { jobOffer: true },
  });
  if (!prep) return notFound("Session d'entretien introuvable");
  return ok(prep);
});

export const DELETE = withAuth(async (_req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const exists = await prisma.interviewPrep.findFirst({ where: { id, userId: session.user.id } });
  if (!exists) return notFound("Session d'entretien introuvable");
  await prisma.interviewPrep.delete({ where: { id } });
  return ok({ deleted: true });
});
