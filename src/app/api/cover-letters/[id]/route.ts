import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, err, withAuth } from "@/lib/api-response";
import { z } from "zod";
import { logHistory } from "@/lib/history";

const UpdateSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  content: z.string().optional(),
  status: z.enum(["DRAFT", "FINAL", "SENT"]).optional(),
});

export const GET = withAuth(async (_req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: session.user.id },
    include: { jobOffer: true },
  });
  if (!letter) return notFound("Lettre introuvable");
  return ok(letter);
});

export const PATCH = withAuth(async (req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const exists = await prisma.coverLetter.findFirst({ where: { id, userId: session.user.id } });
  if (!exists) return notFound("Lettre introuvable");

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const letter = await prisma.coverLetter.update({ where: { id }, data: parsed.data });
  await logHistory(session.user.id, "UPDATE", "COVER_LETTER", id, {});
  return ok(letter);
});

export const DELETE = withAuth(async (_req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const exists = await prisma.coverLetter.findFirst({ where: { id, userId: session.user.id } });
  if (!exists) return notFound("Lettre introuvable");

  await prisma.coverLetter.delete({ where: { id } });
  await logHistory(session.user.id, "DELETE", "COVER_LETTER", id, {});
  return ok({ deleted: true });
});
