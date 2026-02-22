import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Données invalides: " + parsed.error.message);
    }

    const { firstName, lastName, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse("Un compte avec cet email existe déjà", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        subscription: {
          create: { plan: "FREE", status: "ACTIVE" },
        },
        aiSettings: {
          create: {},
        },
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return successResponse(user, "Compte créé avec succès", 201);
  } catch (err) {
    console.error("[register]", err);
    return errorResponse("Erreur lors de la création du compte", 500);
  }
}
