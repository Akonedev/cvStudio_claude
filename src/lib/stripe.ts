import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
  typescript: true,
});

export const STRIPE_PLANS = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY!,
  ELITE_MONTHLY: process.env.STRIPE_PRICE_ELITE_MONTHLY!,
  ELITE_YEARLY: process.env.STRIPE_PRICE_ELITE_YEARLY!,
} as const;

export const PLAN_LIMITS = {
  FREE: {
    cvs: 2,
    coverLetters: 3,
    jobMatches: 5,
    aiRequests: 10,
    export: ["PDF"],
    atsCheck: false,
    interviewPrep: false,
  },
  PRO: {
    cvs: 10,
    coverLetters: 30,
    jobMatches: 50,
    aiRequests: 200,
    export: ["PDF", "DOCX", "ODT"],
    atsCheck: true,
    interviewPrep: true,
  },
  ELITE: {
    cvs: -1, // unlimited
    coverLetters: -1,
    jobMatches: -1,
    aiRequests: -1,
    export: ["PDF", "DOCX", "ODT", "TXT"],
    atsCheck: true,
    interviewPrep: true,
  },
  ENTERPRISE: {
    cvs: -1,
    coverLetters: -1,
    jobMatches: -1,
    aiRequests: -1,
    export: ["PDF", "DOCX", "ODT", "TXT", "JSON"],
    atsCheck: true,
    interviewPrep: true,
  },
} as const;
