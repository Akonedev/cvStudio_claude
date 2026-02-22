import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, withAuth } from "@/lib/api-response";
import { createCompletion } from "@/lib/ai-service";
import { logHistory } from "@/lib/history";
import { z } from "zod";

const GenerateSchema = z.object({
  cvId: z.string(),
  jobDescription: z.string().optional(),
  jobUrl: z.string().url().optional(),
  tone: z.enum(["formal", "enthusiastic", "concise"]).default("formal"),
  language: z.string().default("fr"),
  instructions: z.string().optional(),
});

/**
 * POST /api/cover-letters/generate
 * Generates a new cover letter using AI based on CV data + job description.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = GenerateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const cv = await prisma.cV.findFirst({ where: { id: parsed.data.cvId, userId: session.user.id } });
  if (!cv) return err("CV introuvable", 404);

  const toneMap = { formal: "professionnel et courtois", enthusiastic: "enthousiaste et dynamique", concise: "concis et direct" };

  const messages = [
    {
      role: "system" as const,
      content: `Tu es un expert RH senior spécialisé dans la rédaction de lettres de motivation percutantes.
Rédige une lettre de motivation en français, au ton ${toneMap[parsed.data.tone]}.
La lettre doit: 
- Être personnalisée pour le poste
- Mettre en valeur les compétences clés du candidat
- Montrer la motivation et l'adéquation culturelle
- Respecter le format professionnel français (3-4 paragraphes, ~350-400 mots)
- Ne jamais répéter le CV mot pour mot
Retourne UNIQUEMENT le texte de la lettre, sans JSON ni balises.`,
    },
    {
      role: "user" as const,
      content: `CV du candidat:\n${JSON.stringify(cv.data)}\n\nOffre d'emploi:\n${parsed.data.jobDescription || "Non spécifiée"}\n${parsed.data.instructions ? `\nInstructions supplémentaires: ${parsed.data.instructions}` : ""}`,
    },
  ];

  const response = await createCompletion({ messages, maxTokens: 1500, temperature: 0.7 }, session.user.id);

  // Auto-save the generated letter
  const letter = await prisma.coverLetter.create({
    data: {
      userId: session.user.id,
      title: `Lettre - ${cv.title} - ${new Date().toLocaleDateString("fr-FR")}`,
      content: response.content,
      status: "DRAFT",
    },
  });

  await logHistory(session.user.id, "GENERATE", "COVER_LETTER", letter.id, { cvId: cv.id });

  return ok({ letter, tokensUsed: response.outputTokens });
});
