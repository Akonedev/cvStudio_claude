import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, withAuth } from "@/lib/api-response";

export const GET = withAuth(async (_req: NextRequest, session) => {
  const userId = session.user.id;

  const [
    cvCount,
    atsAggregate,
    jobMatchCount,
    coverLetterCount,
    interviewPrepCount,
    subscription,
  ] = await Promise.all([
    prisma.cV.count({ where: { userId } }),
    prisma.cV.aggregate({
      where: { userId, atsScore: { not: null } },
      _avg: { atsScore: true },
    }),
    prisma.jobMatch.count({ where: { userId } }),
    prisma.coverLetter.count({ where: { userId } }),
    prisma.interviewPrep.count({ where: { userId } }),
    prisma.subscription.findUnique({
      where: { userId },
      select: { plan: true, status: true },
    }),
  ]);

  return ok({
    cvCount,
    avgAtsScore: Math.round(atsAggregate._avg.atsScore ?? 0),
    jobMatchCount,
    coverLetterCount,
    interviewPrepCount,
    plan: subscription?.plan ?? "FREE",
    subscriptionStatus: subscription?.status ?? "ACTIVE",
  });
});
