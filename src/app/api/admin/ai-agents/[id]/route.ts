import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, withAdmin } from "@/lib/api-response";
import { z } from "zod";

const AgentContextEnum = z.enum([
  "CV",
  "COVER_LETTER",
  "INTERVIEW",
  "JOB_MATCHER",
  "ATS",
  "CAREER",
  "GENERAL",
]);

const UpdateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(1).optional(),
  systemPrompt: z.string().min(10).optional(),
  context: AgentContextEnum.optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(100).max(16384).optional(),
  providerId: z.string().nullable().optional(),
  modelName: z.string().nullable().optional(),
  greeting: z.string().nullable().optional(),
  capabilities: z.array(z.string()).nullable().optional(),
  priority: z.number().int().min(0).optional(),
});

/**
 * GET /api/admin/ai-agents/[id] — Get single agent
 */
export const GET = withAdmin(async (_req, _session, ctx) => {
  const { id } = await ctx.params;
  const agent = await prisma.aIAgent.findUnique({
    where: { id },
    include: { provider: { select: { id: true, name: true, type: true } } },
  });
  if (!agent) return err("Agent introuvable", 404);
  return ok(agent);
});

/**
 * PATCH /api/admin/ai-agents/[id] — Update agent
 */
export const PATCH = withAdmin(async (req: NextRequest, _session, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = UpdateAgentSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const existing = await prisma.aIAgent.findUnique({ where: { id } });
  if (!existing) return err("Agent introuvable", 404);

  // Check slug uniqueness if changing
  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const dupe = await prisma.aIAgent.findUnique({ where: { slug: parsed.data.slug } });
    if (dupe) return err(`Le slug "${parsed.data.slug}" est déjà utilisé`, 409);
  }

  // If setting as default, unset others in same context
  if (parsed.data.isDefault) {
    const agentCtx = parsed.data.context || existing.context;
    await prisma.aIAgent.updateMany({
      where: { context: agentCtx, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agent = await prisma.aIAgent.update({
    where: { id },
    data: parsed.data as any,
    include: { provider: { select: { id: true, name: true, type: true } } },
  });

  return ok(agent);
});

/**
 * DELETE /api/admin/ai-agents/[id] — Delete agent
 */
export const DELETE = withAdmin(async (_req, _session, ctx) => {
  const { id } = await ctx.params;
  const existing = await prisma.aIAgent.findUnique({ where: { id } });
  if (!existing) return err("Agent introuvable", 404);

  await prisma.aIAgent.delete({ where: { id } });
  return ok({ deleted: true });
});
