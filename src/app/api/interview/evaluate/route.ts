import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, notFound, withAuth } from "@/lib/api-response";
import { createCompletion } from "@/lib/ai-service";
import { z } from "zod";

const EvaluateSchema = z.object({
  prepId: z.string(),
  questionId: z.string(),
  question: z.string(),
  userAnswer: z.string().min(1),
  modelAnswer: z.string().optional(),
});

/**
 * POST /api/interview/evaluate
 * AI-evaluates a user's answer to an interview question.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = EvaluateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const messages = [
    {
      role: "system" as const,
      content: `Tu es un expert recruteur senior. Évalue cette réponse d'entretien de manière bienveillante mais honnête.
Retourne un JSON avec:
- score: number (0-100)
- feedback: string (retour détaillé en français)
- strengths: string[] (points forts de la réponse)
- improvements: string[] (axes d'amélioration)
- betterVersion: string (version améliorée de la réponse)
- starMethod: boolean (la réponse suit-elle la méthode STAR?)`,
    },
    {
      role: "user" as const,
      content: `Question: ${parsed.data.question}\n\nRéponse du candidat: ${parsed.data.userAnswer}${parsed.data.modelAnswer ? `\n\nRéponse modèle attendue: ${parsed.data.modelAnswer}` : ""}`,
    },
  ];

  const response = await createCompletion({ messages, maxTokens: 1000, temperature: 0.4 }, session.user.id);
  const jsonMatch = response.content.match(/\{[\s\S]*\}/);
  const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 50, feedback: response.content };

  return ok({ evaluation, questionId: parsed.data.questionId });
});
