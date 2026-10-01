export const MBAI_MODELS = {
  gemini: {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    description: "Fast, multimodal help for everyday study questions",
    modelId: "google/gemini-3.8-flash",
    available: true,
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    description: "Deep reasoning for complex problems and explanations",
    modelId: "openai/gpt-6-astra",
    available: true,
  },
  claude: {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    description: "Long-form reading and careful writing support",
    modelId: "anthropic/claude-sonnet-5",
    available: true,
  },
} as const;

export type MbAiModelId = keyof typeof MBAI_MODELS;

export const DEFAULT_MBAI_MODEL: MbAiModelId = "gemini";

export function isMbAiModelId(value: unknown): value is MbAiModelId {
  return typeof value === "string" && value in MBAI_MODELS;
}
