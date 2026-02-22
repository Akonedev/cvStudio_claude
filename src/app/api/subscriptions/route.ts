import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, withAuth } from "@/lib/api-response";
import { stripe } from "@/lib/stripe";
import { getPlanLimits } from "@/lib/subscription";
import { z } from "zod";

const CheckoutSchema = z.object({
  plan: z.enum(["PRO", "ELITE"]),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const GET = withAuth(async (_req: NextRequest, session) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    include: { invoices: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  const plan = subscription?.plan ?? "STARTER";
  const limits = getPlanLimits(plan);

  return ok({ subscription, limits });
});

export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return err("Utilisateur introuvable", 404);

  const priceMap: Record<string, string> = {
    "PRO:monthly": process.env.STRIPE_PRICE_PRO_MONTHLY!,
    "PRO:yearly": process.env.STRIPE_PRICE_PRO_YEARLY!,
    "ELITE:monthly": process.env.STRIPE_PRICE_ELITE_MONTHLY!,
    "ELITE:yearly": process.env.STRIPE_PRICE_ELITE_YEARLY!,
  };
  const priceId = priceMap[`${parsed.data.plan}:${parsed.data.interval}`];
  if (!priceId) return err("Plan invalide", 400);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session2 = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: session.user.id, plan: parsed.data.plan },
    success_url: parsed.data.successUrl ?? `${appUrl}/dashboard/subscription?success=1`,
    cancel_url: parsed.data.cancelUrl ?? `${appUrl}/dashboard/subscription?canceled=1`,
  });

  return ok({ url: session2.url, sessionId: session2.id });
});
