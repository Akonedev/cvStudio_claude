import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, withAuth } from "@/lib/api-response";
import { createCompletion } from "@/lib/ai-service";
import { z } from "zod";

const ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).min(1),
  context: z.enum(["cv", "cover-letter", "job-matcher", "interview", "general"]).default("general"),
  cvId: z.string().optional(),
  jobOfferId: z.string().optional(),
});

/**
 * POST /api/ai/chat
 * Universal AI chat endpoint used by all panels.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = ChatSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  // Build context-aware system prompt
  const contextPrompts: Record<string, string> = {
    "cv": "Tu es un expert senior RH et créateur de CV. Tu aides à optimiser les CV pour maximiser les chances d'être retenu. Tu connais les meilleures pratiques ATS, les normes européennes et françaises de rédaction de CV.",
    "cover-letter": "Tu es un expert senior en rédaction de lettres de motivation professionnelles en français. Tu rédiges des lettres percutantes, personnalisées et conformes aux standards RH français.",
    "job-matcher": "Tu es un expert en analyse d'offres d'emploi et en matching RH. Tu analyses les correspondances entre profils et postes, identifies les forces et lacunes.",
    "interview": "Tu es un coach expert en préparation aux entretiens d'embauche avec 20 ans d'expérience en recrutement. Tu prépares les candidats avec des questions, conseils et feedbacks constructifs.",
    "general": "Tu es un assistant expert polyvalent en recherche d'emploi, carrière et développement professionnel en France. Tu donnes des conseils précis, actionnables et adaptés au marché du travail français.",
  };

  const systemContent = contextPrompts[parsed.data.context] || contextPrompts.general;

  // Fetch context data if provided
  let contextData = "";
  if (parsed.data.cvId) {
    const cv = await prisma.cV.findFirst({ where: { id: parsed.data.cvId, userId: session.user.id } });
    if (cv) contextData += `\nCV actif: ${JSON.stringify(cv.data)}`;
  }
  if (parsed.data.jobOfferId) {
    const job = await prisma.jobOffer.findFirst({ where: { id: parsed.data.jobOfferId, userId: session.user.id } });
    if (job) contextData += `\nOffre d'emploi: ${job.title} - ${job.description?.substring(0, 500)}`;
  }

  const messages = [
    {
      role: "system" as const,
      content: systemContent + (contextData ? `\n\nContexte disponible:${contextData}` : ""),
    },
    ...parsed.data.messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];

  const response = await createCompletion({ messages, maxTokens: 2000, temperature: 0.7 }, session.user.id);

  return ok({ content: response.content, model: response.model, provider: response.provider });
});
