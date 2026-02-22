import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, withAuth } from "@/lib/api-response";
import { z } from "zod";
import { logHistory } from "@/lib/history";

const PrepListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const GET = withAuth(async (req: NextRequest, session) => {
  const url = new URL(req.url);
  const { page, limit } = PrepListSchema.parse({
    page: url.searchParams.get("page") ?? "1",
    limit: url.searchParams.get("limit") ?? "10",
  });

  const [items, total] = await Promise.all([
    prisma.interviewPrep.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { jobOffer: { select: { id: true, title: true, company: true } } },
    }),
    prisma.interviewPrep.count({ where: { userId: session.user.id } }),
  ]);

  return ok({ items, total, page, pages: Math.ceil(total / limit) });
});
