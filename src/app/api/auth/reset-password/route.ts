import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const { token, password } = schema.parse(await req.json());

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return errorResponse("Lien invalide ou expiré", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return successResponse(null, "Mot de passe mis à jour avec succès.");
  } catch (err) {
    console.error("[reset-password]", err);
    return errorResponse("Erreur lors de la réinitialisation", 500);
  }
}
