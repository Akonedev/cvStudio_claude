import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, withAdmin } from "@/lib/api-response";

/**
 * GET /api/admin/users
 * Returns paginated list of all users for admin panel.
 */
export const GET = withAdmin(async (req: NextRequest) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "20");
  const search = url.searchParams.get("search") ?? "";
  const role = url.searchParams.get("role") ?? undefined;

  const where = {
    ...(search ? {
      OR: [
        { email: { contains: search, mode: "insensitive" as const } },
        { name: { contains: search, mode: "insensitive" as const } },
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName: { contains: search, mode: "insensitive" as const } },
      ],
    } : {}),
    ...(role ? { role: role as never } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, email: true, name: true, firstName: true, lastName: true,
        role: true, isActive: true, createdAt: true, image: true,
        subscription: { select: { plan: true, status: true, currentPeriodEnd: true } },
        _count: { select: { cvs: true, coverLetters: true, jobOffers: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return ok({ users, total, page, pages: Math.ceil(total / limit) });
});
