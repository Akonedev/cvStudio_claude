import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, withAuth } from "@/lib/api-response";
import { z } from "zod";
import { logHistory } from "@/lib/history";

const CreateSchema = z.object({
  url: z.string().url().optional(),
  title: z.string().min(1).max(200),
  company: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  source: z.string().optional(),
  salary: z.string().optional(),
  contractType: z.string().optional(),
});

export const GET = withAuth(async (_req: NextRequest, session) => {
  const offers = await prisma.jobOffer.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { matches: { select: { id: true, matchScore: true, status: true } } },
  });
  return ok(offers);
});

export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const offer = await prisma.jobOffer.create({
    data: { userId: session.user.id, ...parsed.data },
  });
  await logHistory(session.user.id, "CREATE", "JOB_OFFER", offer.id, { title: offer.title });
  return ok(offer, 201);
});
