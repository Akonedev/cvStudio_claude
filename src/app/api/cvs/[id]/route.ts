import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, notFound, withAuth } from "@/lib/api-response";
import { z } from "zod";
import { logHistory } from "@/lib/history";

const UpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  template: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  data: z.record(z.unknown()).optional(),
  sidebarEnabled: z.boolean().optional(),
  sidebarPosition: z.enum(["LEFT", "RIGHT"]).optional(),
  sidebarStyle: z.string().optional(),
  headerTemplate: z.string().optional(),
  atsScore: z.number().int().min(0).max(100).optional(),
});

export const GET = withAuth(async (_req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const cv = await prisma.cV.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!cv) return notFound("CV introuvable");
  return ok(cv);
});

export const PATCH = withAuth(async (req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const existing = await prisma.cV.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return notFound("CV introuvable");

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const cv = await prisma.cV.update({ where: { id }, data: parsed.data });
  await logHistory(session.user.id, "UPDATE", "CV", cv.id, { title: cv.title });
  return ok(cv);
});

export const DELETE = withAuth(async (_req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const existing = await prisma.cV.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return notFound("CV introuvable");

  await prisma.cV.delete({ where: { id } });
  await logHistory(session.user.id, "DELETE", "CV", id, { title: existing.title });
  return ok({ deleted: true });
});
