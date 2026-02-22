import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, notFound, withAdmin } from "@/lib/api-response";
import { encrypt } from "@/lib/encryption";
import { z } from "zod";

const UpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  baseUrl: z.string().url().optional(),
  apiKey: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  priority: z.number().int().min(0).optional(),
});

export const PATCH = withAdmin(async (req: NextRequest, _session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const exists = await prisma.aIProvider.findUnique({ where: { id } });
  if (!exists) return notFound("Provider introuvable");

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.apiKey) data.apiKey = encrypt(parsed.data.apiKey);
  if (parsed.data.isDefault) {
    await prisma.aIProvider.updateMany({ where: { id: { not: id } }, data: { isDefault: false } });
  }

  const provider = await prisma.aIProvider.update({ where: { id }, data });
  return ok({ ...provider, apiKey: provider.apiKey ? "***" : null });
});

export const DELETE = withAdmin(async (_req: NextRequest, _session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const exists = await prisma.aIProvider.findUnique({ where: { id } });
  if (!exists) return notFound("Provider introuvable");
  await prisma.aIProvider.delete({ where: { id } });
  return ok({ deleted: true });
});
