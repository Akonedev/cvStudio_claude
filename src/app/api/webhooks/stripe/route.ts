import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
  }

  const session_ = event.data.object as Stripe.Checkout.Session;
  const subscription_ = event.data.object as Stripe.Subscription;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = session_.metadata?.userId;
      const plan = session_.metadata?.plan as "PRO" | "ELITE";
      if (!userId || !plan) break;

      const sub = await stripe.subscriptions.retrieve(session_.subscription as string);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subAny = sub as any;
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan,
          status: "ACTIVE",
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          stripePriceId: sub.items.data[0]?.price.id,
          currentPeriodStart: new Date(subAny.current_period_start * 1000),
          currentPeriodEnd: new Date(subAny.current_period_end * 1000),
        },
        update: {
          plan,
          status: "ACTIVE",
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          stripePriceId: sub.items.data[0]?.price.id,
          currentPeriodStart: new Date(subAny.current_period_start * 1000),
          currentPeriodEnd: new Date(subAny.current_period_end * 1000),
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      const customerId = inv.customer as string;
      const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
      if (!sub) break;

      await prisma.invoice.create({
        data: {
          userId: sub.userId,
          subscriptionId: sub.id,
          stripeInvoiceId: inv.id,
          amount: inv.amount_paid,
          currency: inv.currency.toUpperCase(),
          status: "PAID",
          pdfUrl: inv.invoice_pdf ?? undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          periodStart: new Date((inv as any).period_start * 1000),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          periodEnd: new Date((inv as any).period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const customerId = subscription_.customer as string;
      const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
      if (!sub) break;

      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          status: subscription_.status === "active" ? "ACTIVE" : subscription_.status === "trialing" ? "TRIALING" : "CANCELED",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          currentPeriodEnd: new Date((subscription_ as any).current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const customerId = subscription_.customer as string;
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId },
        data: { status: "CANCELED", plan: "FREE" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
};
