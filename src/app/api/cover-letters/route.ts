import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, notFound, withAuth } from "@/lib/api-response";
import { z } from "zod";
import { logHistory } from "@/lib/history";

const CreateSchema = z.object({
  title: z.string().min(1).max(150),
  jobOfferId: z.string().optional(),
  content: z.string().optional().default(""),
});

const UpdateSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  content: z.string().optional(),
  status: z.enum(["DRAFT", "FINAL", "SENT"]).optional(),
});

export const GET = withAuth(async (_req: NextRequest, session) => {
  const letters = await prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { jobOffer: { select: { id: true, title: true, company: true } } },
  });
  return ok(letters);
});

export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const letter = await prisma.coverLetter.create({
    data: { userId: session.user.id, ...parsed.data },
  });
  await logHistory(session.user.id, "CREATE", "COVER_LETTER", letter.id, { title: letter.title });
  return ok(letter, 201);
});
