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
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan,
          status: "ACTIVE",
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          stripePriceId: sub.items.data[0]?.price.id,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
        update: {
          plan,
          status: "ACTIVE",
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          stripePriceId: sub.items.data[0]?.price.id,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
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
          amount: inv.amount_paid / 100,
          currency: inv.currency.toUpperCase(),
          status: "PAID",
          invoiceUrl: inv.hosted_invoice_url ?? undefined,
          pdfUrl: inv.invoice_pdf ?? undefined,
          period: `${new Date(inv.period_start * 1000).toLocaleDateString("fr-FR")} - ${new Date(inv.period_end * 1000).toLocaleDateString("fr-FR")}`,
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
          currentPeriodEnd: new Date(subscription_.current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const customerId = subscription_.customer as string;
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId },
        data: { status: "CANCELED", plan: "STARTER" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
};
