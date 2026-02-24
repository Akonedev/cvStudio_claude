import { prisma } from "@/lib/prisma";
import { ok, err, withAdmin } from "@/lib/api-response";
import { AGENT_TEMPLATES } from "@/types/ai-agents";

/**
 * POST /api/admin/ai-agents/seed — Seed default agents
 * Only creates agents whose slugs don't already exist.
 */
export const POST = withAdmin(async () => {
  const results: { name: string; status: string }[] = [];

  for (const tpl of AGENT_TEMPLATES) {
    const slug = tpl.name
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ç]/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await prisma.aIAgent.findUnique({ where: { slug } });
    if (existing) {
      results.push({ name: tpl.name, status: "exists" });
      continue;
    }

    // Map context string to Prisma enum
    const contextMap: Record<string, string> = {
      cv: "CV",
      "cover-letter": "COVER_LETTER",
      interview: "INTERVIEW",
      "job-matcher": "JOB_MATCHER",
      ats: "ATS",
      career: "CAREER",
      general: "GENERAL",
    };

    try {
      await prisma.aIAgent.create({
        data: {
          name: tpl.name,
          slug,
          description: tpl.description,
          systemPrompt: tpl.systemPrompt,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          context: (contextMap[tpl.context] || "GENERAL") as any,
          icon: tpl.icon ?? "bot",
          color: tpl.color ?? "#f59e0b",
          isActive: true,
          isDefault: tpl.isDefault ?? false,
          temperature: tpl.temperature ?? 0.7,
          maxTokens: tpl.maxTokens ?? 2048,
          greeting: tpl.greeting ?? null,
          capabilities: tpl.capabilities ?? undefined,
          priority: tpl.priority ?? 0,
        },
      });
      results.push({ name: tpl.name, status: "created" });
    } catch (e) {
      results.push({ name: tpl.name, status: `error: ${(e as Error).message}` });
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  const skipped = results.filter((r) => r.status === "exists").length;
  const errors = results.filter((r) => r.status.startsWith("error")).length;

  if (errors > 0) return err(`Seed partiel: ${created} créés, ${skipped} existants, ${errors} erreurs`, 500);
  return ok({ message: `${created} agents créés, ${skipped} déjà existants`, results });
});
