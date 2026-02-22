import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, err, withAdmin } from "@/lib/api-response";
import { z } from "zod";

const UpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
  jobTitle: z.string().optional(),
});

export const GET = withAdmin(async (_req: NextRequest, _session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      _count: { select: { cvs: true, coverLetters: true, jobOffers: true, interviewPreps: true } },
    },
  });
  if (!user) return notFound("Utilisateur introuvable");
  const { password: _pw, ...safe } = user;
  return ok(safe);
});

export const PATCH = withAdmin(async (req: NextRequest, _session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) return notFound("Utilisateur introuvable");

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const user = await prisma.user.update({ where: { id }, data: parsed.data });
  const { password: _pw, ...safe } = user;
  return ok(safe);
});
