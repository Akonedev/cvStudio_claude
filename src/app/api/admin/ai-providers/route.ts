import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, withAdmin } from "@/lib/api-response";
import { encrypt } from "@/lib/encryption";
import { z } from "zod";

const CreateProviderSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["OPENAI", "ANTHROPIC", "GOOGLE", "MISTRAL", "OLLAMA", "LMSTUDIO", "VLLM", "OPENROUTER", "DEEPSEEK", "CUSTOM"]),
  baseUrl: z.string().url(),
  apiKey: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
  priority: z.number().int().min(0).default(0),
});

export const GET = withAdmin(async () => {
  const providers = await prisma.aIProvider.findMany({
    orderBy: [{ isDefault: "desc" }, { priority: "desc" }],
    include: { models: { orderBy: { isDefault: "desc" } } },
  });
  // Mask API keys
  const safe = providers.map((p) => ({ ...p, apiKey: p.apiKey ? "***" : null }));
  return ok(safe);
});

export const POST = withAdmin(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = CreateProviderSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const encryptedKey = parsed.data.apiKey ? encrypt(parsed.data.apiKey) : null;

  // If setting as default, unset others
  if (parsed.data.isDefault) {
    await prisma.aIProvider.updateMany({ data: { isDefault: false } });
  }

  const provider = await prisma.aIProvider.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      baseUrl: parsed.data.baseUrl,
      apiKey: encryptedKey,
      isDefault: parsed.data.isDefault,
      priority: parsed.data.priority,
    },
  });

  return ok({ ...provider, apiKey: provider.apiKey ? "***" : null }, 201);
});
