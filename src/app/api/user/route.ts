import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/api-response";

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  sector: z.string().optional(),
  locale: z.string().optional(),
  image: z.string().url().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return unauthorizedResponse();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
      omit: { password: true },
    });

    if (!user) return notFoundResponse("Utilisateur introuvable");
    return successResponse(user);
  } catch (err) {
    console.error("[GET /api/user]", err);
    return serverErrorResponse();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return unauthorizedResponse();

    const body = await req.json();
    const data = updateSchema.parse(body);

    const name =
      data.firstName || data.lastName
        ? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()
        : undefined;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { ...data, ...(name ? { name } : {}) },
      omit: { password: true },
    });

    return successResponse(user, "Profil mis à jour");
  } catch (err) {
    if (err instanceof z.ZodError) return errorResponse("Données invalides: " + err.message);
    console.error("[PATCH /api/user]", err);
    return serverErrorResponse();
  }
}
