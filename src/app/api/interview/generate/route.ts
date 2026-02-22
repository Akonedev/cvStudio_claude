import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, notFound, withAuth } from "@/lib/api-response";
import { createCompletion } from "@/lib/ai-service";
import { logHistory } from "@/lib/history";
import { z } from "zod";

const GenerateSchema = z.object({
  cvId: z.string(),
  jobOfferId: z.string(),
  count: z.number().int().min(1).max(20).default(10),
  focusArea: z.string().optional(),
});

/**
 * POST /api/interview/generate
 * Generates tailored interview Q&A for a given CV + job offer.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = GenerateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const [cv, jobOffer] = await Promise.all([
    prisma.cV.findFirst({ where: { id: parsed.data.cvId, userId: session.user.id } }),
    prisma.jobOffer.findFirst({ where: { id: parsed.data.jobOfferId, userId: session.user.id } }),
  ]);
  if (!cv) return notFound("CV introuvable");
  if (!jobOffer) return notFound("Offre d'emploi introuvable");

  const messages = [
    {
      role: "system" as const,
      content: `Tu es un expert senior en recrutement RH avec 20 ans d'expérience.
Génère ${parsed.data.count} questions d'entretien pertinentes pour ce poste et ce candidat.
Retourne un JSON avec:
- questions: Array<{
    id: string,
    category: "BEHAVIORAL"|"TECHNICAL"|"SITUATIONAL"|"MOTIVATIONAL"|"COMPETENCY",
    difficulty: "EASY"|"MEDIUM"|"HARD",
    question: string,
    tips: string[],
    modelAnswer: string,
    followUps: string[]
  }>
- preparationAdvice: string[] (conseils généraux pour l'entretien)
- evaluation: { strengths: string[], risks: string[], preparation: string }`,
    },
    {
      role: "user" as const,
      content: `CV:\n${JSON.stringify(cv.data)}\n\nPoste:\n${jobOffer.title} chez ${jobOffer.company || "N/A"}\n\n${jobOffer.description || ""}${parsed.data.focusArea ? `\n\nFocus: ${parsed.data.focusArea}` : ""}`,
    },
  ];

  const response = await createCompletion({ messages, maxTokens: 3000, temperature: 0.6 }, session.user.id);
  const jsonMatch = response.content.match(/\{[\s\S]*\}/);
  const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { questions: [], preparationAdvice: [] };

  // Save interview prep session
  const prep = await prisma.interviewPrep.create({
    data: {
      userId: session.user.id,
      cvId: cv.id,
      jobOfferId: jobOffer.id,
      questions: result.questions || [],
      preparationScore: 0,
    },
  });

  await logHistory(session.user.id, "GENERATE", "INTERVIEW", prep.id, { cvId: cv.id, jobOfferId: jobOffer.id });

  return ok({ prep, questions: result.questions, preparationAdvice: result.preparationAdvice, evaluation: result.evaluation });
});
