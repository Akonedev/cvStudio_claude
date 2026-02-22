import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/stripe";
import { SubscriptionPlan } from "@/types";

export function getPlanLimits(plan: string) {
  const key = (plan as keyof typeof PLAN_LIMITS) in PLAN_LIMITS ? (plan as keyof typeof PLAN_LIMITS) : "FREE";
  return PLAN_LIMITS[key];
}

export async function getUserPlan(userId: string): Promise<SubscriptionPlan> {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  return (sub?.plan ?? "FREE") as SubscriptionPlan;
}

export async function checkLimit(
  userId: string,
  resource: keyof (typeof PLAN_LIMITS)["FREE"]
): Promise<{ allowed: boolean; limit: number; current: number }> {
  const plan = await getUserPlan(userId);
  const limits = PLAN_LIMITS[plan];
  const limit = limits[resource as keyof typeof limits] as number;

  if (limit === -1) return { allowed: true, limit: -1, current: 0 };

  let current = 0;

  switch (resource) {
    case "cvs":
      current = await prisma.cV.count({ where: { userId } });
      break;
    case "coverLetters":
      current = await prisma.coverLetter.count({ where: { userId } });
      break;
    case "jobMatches":
      current = await prisma.jobMatch.count({ where: { userId } });
      break;
    default:
      break;
  }

  return { allowed: current < limit, limit, current };
}
