import { prisma } from "@/lib/prisma";
import { ok, withAuth } from "@/lib/api-response";

/**
 * GET /api/ai/agents — List active agents for the current user.
 * Returns only active agents sorted by priority.
 */
export const GET = withAuth(async () => {
  const agents = await prisma.aIAgent.findMany({
    where: { isActive: true },
    orderBy: [{ priority: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      context: true,
      icon: true,
      color: true,
      isDefault: true,
      greeting: true,
      capabilities: true,
      priority: true,
    },
  });
  return ok(agents);
});
