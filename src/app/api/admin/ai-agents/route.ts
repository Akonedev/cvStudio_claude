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

const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  systemPrompt: z.string().min(10),
  context: AgentContextEnum.default("GENERAL"),
  icon: z.string().max(50).optional().default("bot"),
  color: z.string().max(20).optional().default("#f59e0b"),
  isActive: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().int().min(100).max(16384).optional().default(2048),
  providerId: z.string().optional(),
  modelName: z.string().optional(),
  greeting: z.string().optional(),
  capabilities: z.array(z.string()).optional(),
  priority: z.number().int().min(0).optional().default(0),
});

/**
 * GET /api/admin/ai-agents — List all agents (admin only)
 */
export const GET = withAdmin(async () => {
  const agents = await prisma.aIAgent.findMany({
    orderBy: [{ priority: "desc" }, { name: "asc" }],
    include: { provider: { select: { id: true, name: true, type: true } } },
  });
  return ok(agents);
});

/**
 * POST /api/admin/ai-agents — Create a new agent (admin only)
 */
export const POST = withAdmin(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = CreateAgentSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  // Check slug uniqueness
  const existing = await prisma.aIAgent.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return err(`Un agent avec le slug "${parsed.data.slug}" existe déjà`, 409);

  // If setting as default for this context, unset others
  if (parsed.data.isDefault) {
    await prisma.aIAgent.updateMany({
      where: { context: parsed.data.context, isDefault: true },
      data: { isDefault: false },
    });
  }

  const agent = await prisma.aIAgent.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      systemPrompt: parsed.data.systemPrompt,
      context: parsed.data.context,
      icon: parsed.data.icon,
      color: parsed.data.color,
      isActive: parsed.data.isActive,
      isDefault: parsed.data.isDefault,
      temperature: parsed.data.temperature,
      maxTokens: parsed.data.maxTokens,
      providerId: parsed.data.providerId || null,
      modelName: parsed.data.modelName || null,
      greeting: parsed.data.greeting || null,
      capabilities: parsed.data.capabilities ?? undefined,
      priority: parsed.data.priority,
    },
    include: { provider: { select: { id: true, name: true, type: true } } },
  });

  return ok(agent, 201);
});
