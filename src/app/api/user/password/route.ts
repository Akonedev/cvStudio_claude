import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-response";

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return unauthorizedResponse();

    const body = await req.json();
    const { currentPassword, newPassword } = passwordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return errorResponse("Ce compte utilise une connexion OAuth, aucun mot de passe défini", 400);
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return errorResponse("Mot de passe actuel incorrect", 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return successResponse(null, "Mot de passe mis à jour");
  } catch (err) {
    if (err instanceof z.ZodError) return errorResponse("Données invalides: " + err.message);
    console.error("[PATCH /api/user/password]", err);
    return serverErrorResponse();
  }
}
