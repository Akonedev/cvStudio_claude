import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return successResponse(null, "Si ce compte existe, un email vous a été envoyé.");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({ data: { email, token, expires } });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Réinitialisation de votre mot de passe — CV Studio",
      html: `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Réinitialisation du mot de passe</h2>
          <p>Bonjour ${user.firstName ?? user.name ?? ""},</p>
          <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans 1 heure.</p>
          <a href="${resetUrl}" style="background: #F59E0B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 16px 0;">
            Réinitialiser mon mot de passe
          </a>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
      `,
    });

    return successResponse(null, "Email de réinitialisation envoyé.");
  } catch (err) {
    console.error("[forgot-password]", err);
    return errorResponse("Erreur lors de l'envoi de l'email", 500);
  }
}
