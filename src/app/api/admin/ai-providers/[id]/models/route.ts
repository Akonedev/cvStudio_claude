import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, notFound, withAdmin } from "@/lib/api-response";
import { decrypt } from "@/lib/encryption";

/**
 * GET /api/admin/ai-providers/[id]/models
 * Fetches available models from a provider dynamically.
 */
export const GET = withAdmin(async (_req: NextRequest, _session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const provider = await prisma.aIProvider.findUnique({ where: { id } });
  if (!provider) return notFound("Provider introuvable");

  const apiKey = provider.apiKey ? decrypt(provider.apiKey) : "";
  const baseUrl = provider.baseUrl.replace(/\/$/, "");

  try {
    let models: { id: string; name: string }[] = [];

    // Different providers have different model list endpoints
    if (provider.type === "OPENAI" || provider.type === "OPENROUTER" || provider.type === "DEEPSEEK" ||
        provider.type === "MISTRAL" || provider.type === "CUSTOM" || provider.type === "OLLAMA" ||
        provider.type === "LMSTUDIO" || provider.type === "VLLM") {
      const res = await fetch(`${baseUrl}/models`, {
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      models = (data.data || data.models || []).map((m: { id: string; name?: string }) => ({
        id: m.id,
        name: m.name || m.id,
      }));
    } else if (provider.type === "ANTHROPIC") {
      const res = await fetch("https://api.anthropic.com/v1/models", {
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      });
      const data = await res.json();
      models = (data.data || []).map((m: { id: string; display_name?: string }) => ({
        id: m.id,
        name: m.display_name || m.id,
      }));
    } else if (provider.type === "GOOGLE") {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await res.json();
      models = (data.models || []).map((m: { name: string; displayName?: string }) => ({
        id: m.name,
        name: m.displayName || m.name,
      }));
    }

    // Sync models to DB
    if (models.length > 0) {
      for (const m of models) {
        await prisma.aIModel.upsert({
          where: { providerId_modelId: { providerId: id, modelId: m.id } },
          create: { providerId: id, modelId: m.id, name: m.name },
          update: { name: m.name },
        });
      }
      // Update provider health check timestamp
      await prisma.aIProvider.update({ where: { id }, data: { healthCheck: new Date() } });
    }

    return ok({ models, synced: models.length });
  } catch (e) {
    return err(`Impossible de récupérer les modèles: ${(e as Error).message}`, 502);
  }
});
