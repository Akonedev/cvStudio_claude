import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, withAdmin } from "@/lib/api-response";

/**
 * GET /api/admin/stats
 * Returns platform-wide statistics for admin dashboard.
 */
export const GET = withAdmin(async () => {
  const [
    totalUsers,
    activeUsers,
    totalCVs,
    totalLetters,
    totalMatches,
    subscriptions,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.cV.count(),
    prisma.coverLetter.count(),
    prisma.jobMatch.count(),
    prisma.subscription.groupBy({ by: ["plan", "status"], _count: true }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, email: true, name: true, createdAt: true, role: true },
    }),
  ]);

  // Revenue estimate from active subscriptions
  const planPrices: Record<string, number> = { FREE: 0, PRO: 19, ELITE: 49, ENTERPRISE: 99 };
  const revenue = subscriptions
    .filter((s) => s.status === "ACTIVE")
    .reduce((sum, s) => sum + planPrices[s.plan] * s._count, 0);

  return ok({
    users: { total: totalUsers, active: activeUsers },
    content: { cvs: totalCVs, coverLetters: totalLetters, jobMatches: totalMatches },
    subscriptions,
    estimatedMonthlyRevenue: revenue,
    recentSignups,
  });
});
