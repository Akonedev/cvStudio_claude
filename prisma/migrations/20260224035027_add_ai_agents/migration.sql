-- CreateEnum
CREATE TYPE "AIAgentContext" AS ENUM ('CV', 'COVER_LETTER', 'INTERVIEW', 'JOB_MATCHER', 'ATS', 'CAREER', 'GENERAL');

-- CreateTable
CREATE TABLE "ai_agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "context" "AIAgentContext" NOT NULL DEFAULT 'GENERAL',
    "icon" TEXT DEFAULT 'bot',
    "color" TEXT DEFAULT '#f59e0b',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 2048,
    "providerId" TEXT,
    "modelName" TEXT,
    "greeting" TEXT,
    "capabilities" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_agents_slug_key" ON "ai_agents"("slug");

-- AddForeignKey
ALTER TABLE "ai_agents" ADD CONSTRAINT "ai_agents_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ai_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
