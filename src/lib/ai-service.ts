import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRequestOptions {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface AIResponse {
  content: string;
  inputTokens?: number;
  outputTokens?: number;
  model: string;
  provider: string;
}

// ─── Fetch active default provider + model ─────────────────────────────────

export async function getDefaultProvider() {
  const provider = await prisma.aIProvider.findFirst({
    where: { isActive: true, isDefault: true },
    include: {
      models: { where: { isActive: true, isDefault: true }, take: 1 },
    },
    orderBy: { priority: "desc" },
  });

  if (!provider) {
    const fallback = await prisma.aIProvider.findFirst({
      where: { isActive: true },
      include: {
        models: { where: { isActive: true }, take: 1 },
      },
      orderBy: { priority: "desc" },
    });
    return fallback;
  }
  return provider;
}

// ─── Core completion function ───────────────────────────────────────────────

export async function createCompletion(
  options: AIRequestOptions,
  userId?: string
): Promise<AIResponse> {
  const provider = await getDefaultProvider();

  if (!provider) {
    throw new Error(
      "Aucun provider IA configuré. Contactez l'administrateur."
    );
  }

  const apiKey = provider.apiKey ? decrypt(provider.apiKey) : "";
  const modelId =
    options.model ??
    provider.models[0]?.modelId ??
    getDefaultModelId(provider.type);

  const start = Date.now();
  let result: AIResponse;

  try {
    result = await callProvider({
      type: provider.type,
      baseUrl: provider.baseUrl,
      apiKey,
      modelId,
      options,
    });

    // Log usage
    await prisma.aIUsageLog.create({
      data: {
        providerId: provider.id,
        modelId: provider.models[0]?.id,
        userId,
        action: "chat",
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: Date.now() - start,
        success: true,
      },
    });
  } catch (error) {
    await prisma.aIUsageLog.create({
      data: {
        providerId: provider.id,
        userId,
        action: "chat",
        latencyMs: Date.now() - start,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }

  return result;
}

// ─── Provider dispatcher ────────────────────────────────────────────────────

interface CallProviderParams {
  type: string;
  baseUrl: string;
  apiKey: string;
  modelId: string;
  options: AIRequestOptions;
}

async function callProvider(params: CallProviderParams): Promise<AIResponse> {
  const { type, baseUrl, apiKey, modelId, options } = params;

  switch (type) {
    case "OPENAI":
    case "DEEPSEEK":
    case "OPENROUTER":
    case "MISTRAL":
    case "MOONSHOT":
    case "MINIMAX":
    case "CUSTOM":
      return callOpenAICompatible(baseUrl, apiKey, modelId, options);

    case "ANTHROPIC":
      return callAnthropic(baseUrl, apiKey, modelId, options);

    case "GOOGLE":
      return callGemini(baseUrl, apiKey, modelId, options);

    case "OLLAMA":
    case "LMSTUDIO":
    case "VLLM":
      return callOpenAICompatible(baseUrl, apiKey, modelId, options);

    default:
      return callOpenAICompatible(baseUrl, apiKey, modelId, options);
  }
}

// ─── OpenAI-compatible (works for OpenAI, Ollama, LMStudio, DeepSeek, etc.) ─

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  modelId: string,
  options: AIRequestOptions
): Promise<AIResponse> {
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: modelId,
      messages: options.messages,
      max_tokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Provider error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content ?? "",
    inputTokens: data.usage?.prompt_tokens,
    outputTokens: data.usage?.completion_tokens,
    model: modelId,
    provider: "openai-compat",
  };
}

// ─── Anthropic ──────────────────────────────────────────────────────────────

async function callAnthropic(
  baseUrl: string,
  apiKey: string,
  modelId: string,
  options: AIRequestOptions
): Promise<AIResponse> {
  const url = `${baseUrl.replace(/\/$/, "")}/messages`;
  const system = options.messages.find((m) => m.role === "system")?.content;
  const messages = options.messages.filter((m) => m.role !== "system");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: options.maxTokens ?? 4096,
      ...(system ? { system } : {}),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return {
    content: data.content[0]?.text ?? "",
    inputTokens: data.usage?.input_tokens,
    outputTokens: data.usage?.output_tokens,
    model: modelId,
    provider: "anthropic",
  };
}

// ─── Google Gemini ───────────────────────────────────────────────────────────

async function callGemini(
  baseUrl: string,
  apiKey: string,
  modelId: string,
  options: AIRequestOptions
): Promise<AIResponse> {
  const url = `${baseUrl.replace(/\/$/, "")}/models/${modelId}:generateContent?key=${apiKey}`;
  const contents = options.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return {
    content: data.candidates[0]?.content?.parts[0]?.text ?? "",
    model: modelId,
    provider: "google",
  };
}

// ─── Load models from provider API ──────────────────────────────────────────

export async function fetchProviderModels(
  providerId: string
): Promise<{ id: string; name: string }[]> {
  const provider = await prisma.aIProvider.findUnique({
    where: { id: providerId },
  });
  if (!provider) throw new Error("Provider introuvable");

  const apiKey = provider.apiKey ? decrypt(provider.apiKey) : "";

  switch (provider.type) {
    case "ANTHROPIC":
      return fetchAnthropicModels(provider.baseUrl, apiKey);
    case "GOOGLE":
      return fetchGeminiModels(provider.baseUrl, apiKey);
    default:
      return fetchOpenAICompatibleModels(provider.baseUrl, apiKey);
  }
}

async function fetchOpenAICompatibleModels(
  baseUrl: string,
  apiKey: string
): Promise<{ id: string; name: string }[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/models`;
  const response = await fetch(url, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return (data.data ?? []).map((m: { id: string }) => ({
    id: m.id,
    name: m.id,
  }));
}

async function fetchAnthropicModels(
  baseUrl: string,
  apiKey: string
): Promise<{ id: string; name: string }[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/models`;
  const response = await fetch(url, {
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return (data.data ?? []).map((m: { id: string; display_name?: string }) => ({
    id: m.id,
    name: m.display_name ?? m.id,
  }));
}

async function fetchGeminiModels(
  baseUrl: string,
  apiKey: string
): Promise<{ id: string; name: string }[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/models?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return (data.models ?? [])
    .filter((m: { name: string }) => m.name.includes("gemini"))
    .map((m: { name: string; displayName?: string }) => ({
      id: m.name.replace("models/", ""),
      name: m.displayName ?? m.name,
    }));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDefaultModelId(type: string): string {
  const defaults: Record<string, string> = {
    OPENAI: "gpt-4o",
    ANTHROPIC: "claude-3-5-sonnet-20241022",
    GOOGLE: "gemini-1.5-pro",
    MISTRAL: "mistral-large-latest",
    DEEPSEEK: "deepseek-chat",
    OPENROUTER: "openai/gpt-4o",
    OLLAMA: "llama3",
    LMSTUDIO: "local-model",
    VLLM: "local-model",
    MOONSHOT: "moonshot-v1-8k",
    MINIMAX: "abab6.5s-chat",
  };
  return defaults[type] ?? "gpt-4o";
}
