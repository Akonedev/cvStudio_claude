import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/api-response";

const settingsSchema = z.object({
  preferredLanguage: z.string().optional(),
  writingTone: z.string().optional(),
  targetSector: z.string().optional(),
  proactiveSuggestions: z.boolean().optional(),
  realtimeAts: z.boolean().optional(),
  preferredModel: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return unauthorizedResponse();

    const settings = await prisma.userAISettings.upsert({
      where: { userId: session.user.id! },
      create: { userId: session.user.id! },
      update: {},
    });

    return successResponse(settings);
  } catch (err) {
    console.error("[GET /api/user/ai-settings]", err);
    return serverErrorResponse();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return unauthorizedResponse();

    const body = await req.json();
    const data = settingsSchema.parse(body);

    const settings = await prisma.userAISettings.upsert({
      where: { userId: session.user.id! },
      create: { userId: session.user.id!, ...data },
      update: data,
    });

    return successResponse(settings, "Paramètres IA mis à jour");
  } catch (err) {
    if (err instanceof z.ZodError) return errorResponse("Données invalides: " + err.message);
    console.error("[PATCH /api/user/ai-settings]", err);
    return serverErrorResponse();
  }
}
