import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, withAuth } from "@/lib/api-response";

export const GET = withAuth(async (req: NextRequest, session) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "20");
  const entity = url.searchParams.get("entity") ?? undefined;
  const action = url.searchParams.get("action") ?? undefined;

  const where = {
    userId: session.user.id,
    ...(entity ? { entityType: entity as never } : {}),
    ...(action ? { action: action as never } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.historyEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.historyEntry.count({ where }),
  ]);

  return ok({ items, total, page, pages: Math.ceil(total / limit) });
});

export const DELETE = withAuth(async (_req: NextRequest, session) => {
  await prisma.historyEntry.deleteMany({ where: { userId: session.user.id } });
  return ok({ deleted: true });
});
