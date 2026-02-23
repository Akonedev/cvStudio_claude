import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, err, withAuth } from "@/lib/api-response";
import { z } from "zod";
import { logHistory } from "@/lib/history";

const CreateCVSchema = z.object({
  title: z.string().min(1).max(100),
  template: z.string().optional().default("modern"),
  data: z.record(z.string(), z.unknown()).optional().default({}),});

export const GET = withAuth(async (req: NextRequest, session) => {
  const cvs = await prisma.cV.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      template: true,
      status: true,
      atsScore: true,
      isActive: true,
      hasSidebar: true,
      sidebarPos: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return ok(cvs);
});

export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = CreateCVSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const cv = await prisma.cV.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      template: parsed.data.template,
      data: parsed.data.data as any,
    },
  });

  await logHistory(session.user.id, "CREATE", "CV", cv.id, { title: cv.title });
  return ok(cv, 201);
});
