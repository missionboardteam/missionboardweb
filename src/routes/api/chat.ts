import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayProvider,
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { authenticateRequest } from "@/lib/mbai-auth.server";
import { DEFAULT_MBAI_MODEL, isMbAiModelId, MBAI_MODELS } from "@/lib/mbai-models";

const SYSTEM_PROMPT = `You are MB AI (Mission Board AI), the study assistant of the Mission Board family.
Help Indian school students, mainly CBSE Classes 10, 11 and 12, solve doubts across Maths, Science, Social Science, English and Computer Science. Give clear step-by-step solutions, derivations, revision plans and exam guidance. Match the student's language: English, Hindi or Hinglish.

Be warm, accurate and concise. Use clean markdown, show working for numericals, include units, and clearly state final answers. If uncertain, say so. Read attached images, videos and documents carefully. Use the image tool when a diagram or visual would materially help. For book PDFs or batch links, direct students to the Books, Notifications or Batches tabs.`;

type ChatRequestBody = {
  messages?: unknown;
  threadId?: unknown;
  model?: unknown;
  externalFallback?: unknown;
};

function errorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const status = Number((error as { statusCode?: unknown }).statusCode);
    if (Number.isFinite(status)) return status;
  }
  const message = error instanceof Error ? error.message : String(error);
  if (/402|credit|payment_required/i.test(message)) return 402;
  if (/403|forbidden|policy/i.test(message)) return 403;
  if (/429|rate.?limit/i.test(message)) return 429;
  return 500;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await authenticateRequest(request);
        if (!auth) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        const threadId = typeof body.threadId === "string" ? body.threadId : null;
        const selectedModel = isMbAiModelId(body.model) ? body.model : DEFAULT_MBAI_MODEL;
        const useExternalFallback = body.externalFallback === true;
        if (!Array.isArray(messages) || !threadId) {
          return new Response("messages and threadId are required", { status: 400 });
        }

        const { data: thread, error: threadError } = await auth.supabase
          .from("ai_threads")
          .select("id")
          .eq("id", threadId)
          .eq("user_id", auth.userId)
          .maybeSingle();
        if (threadError || !thread) return new Response("Thread not found", { status: 404 });

        const uiMessages = messages as UIMessage[];
        const modelMessages = await convertToModelMessages(uiMessages);
        const lastUser = [...uiMessages].reverse().find((message) => message.role === "user");
        if (lastUser) {
          const { error: insertError } = await auth.supabase.from("ai_messages").upsert(
            {
              thread_id: threadId,
              user_id: auth.userId,
              role: "user",
              parts: lastUser.parts as unknown as never,
              client_message_id: lastUser.id ?? null,
            },
            { onConflict: "thread_id,client_message_id", ignoreDuplicates: true },
          );
          if (insertError) console.error("[MB AI] failed saving user message", insertError);
        }

        const onFinish = async ({ responseMessage }: { responseMessage: UIMessage }) => {
          const { error } = await auth.supabase.from("ai_messages").insert({
            thread_id: threadId,
            user_id: auth.userId,
            role: "assistant",
            parts: responseMessage.parts as unknown as never,
            client_message_id: responseMessage.id ?? null,
          });
          if (error) console.error("[MB AI] failed saving assistant message", error);
          await auth.supabase
            .from("ai_threads")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", threadId);
        };

        if (useExternalFallback) {
          const googleKey = process.env["GOOGLE_GEMINI_API_KEY"];
          if (!googleKey) {
            return new Response("External Gemini processing is not configured.", { status: 503 });
          }
          const google = createGoogleGenerativeAI({ apiKey: googleKey });
          const result = streamText({
            model: google("gemini-2.5-flash"),
            system: SYSTEM_PROMPT,
            messages: modelMessages,
            abortSignal: request.signal,
            maxRetries: 0,
          });
          return result.toUIMessageStreamResponse({ originalMessages: uiMessages, onFinish });
        }

        const lovableKey = process.env["LOVABLE_API_KEY"];
        if (!lovableKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const modelConfig = MBAI_MODELS[selectedModel];
        if (!modelConfig.available || !modelConfig.modelId) {
          return new Response(`${modelConfig.name} is not available right now.`, { status: 400 });
        }

        try {
          const initialRunId = getLovableAiGatewayRunId(request);
          const imageTool = tool({
            description: "Generate a helpful study diagram, labelled figure, chart or illustration.",
            inputSchema: z.object({
              prompt: z.string().describe("A detailed English description of the requested image."),
            }),
            execute: async ({ prompt }) => {
              const { generateAndStoreImage } = await import("@/lib/mbai-image.server");
              const { url } = await generateAndStoreImage(prompt, lovableKey);
              return { url, prompt };
            },
          });

          if (selectedModel === "chatgpt") {
            const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
            const openai = createOpenAI({
              baseURL: "https://ai.gateway.lovable.dev/v1",
              apiKey: lovableKey,
              headers: {
                "Lovable-API-Key": lovableKey,
                "X-Lovable-AIG-SDK": "vercel-ai-sdk",
              },
              fetch: runIdFetch.fetch,
            });
            const result = streamText({
              model: openai.responses(modelConfig.modelId),
              system: SYSTEM_PROMPT,
              messages: modelMessages,
              tools: { generate_image: imageTool },
              stopWhen: stepCountIs(50),
              abortSignal: request.signal,
              maxRetries: 0,
              providerOptions: {
                openai: {
                  store: false,
                  forceReasoning: true,
                  reasoningEffort: "medium",
                  reasoningSummary: "auto",
                  include: ["reasoning.encrypted_content"],
                },
              },
            });
            return withLovableAiGatewayRunIdHeader(
              result.toUIMessageStreamResponse({
                originalMessages: uiMessages,
                sendReasoning: true,
                onFinish,
                onError: formatStreamError,
              }),
              runIdFetch,
            );
          }

          if (selectedModel === "claude") {
            const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
            const anthropic = createAnthropic({
              baseURL: "https://ai.gateway.lovable.dev/v1",
              apiKey: lovableKey,
              headers: { "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
              fetch: runIdFetch.fetch,
            });
            const result = streamText({
              model: anthropic(modelConfig.modelId),
              system: SYSTEM_PROMPT,
              messages: modelMessages,
              tools: { generate_image: imageTool },
              stopWhen: stepCountIs(50),
              abortSignal: request.signal,
              maxRetries: 0,
            });
            return withLovableAiGatewayRunIdHeader(
              result.toUIMessageStreamResponse({
                originalMessages: uiMessages,
                onFinish,
                onError: formatStreamError,
              }),
              runIdFetch,
            );
          }

          const gateway = createLovableAiGatewayProvider(lovableKey, initialRunId);
          const result = streamText({
            model: gateway(modelConfig.modelId),
            system: SYSTEM_PROMPT,
            messages: modelMessages,
            tools: { generate_image: imageTool },
            stopWhen: stepCountIs(50),
            abortSignal: request.signal,
            maxRetries: 0,
          });
          return withLovableAiGatewayRunIdHeader(
            result.toUIMessageStreamResponse({
              originalMessages: uiMessages,
              onFinish,
              onError: formatStreamError,
            }),
            gateway,
          );
        } catch (error) {
          const status = errorStatus(error);
          const message = error instanceof Error ? error.message : "AI request failed";
          console.error("[MB AI] gateway error", status, message);
          return new Response(status === 402 ? "MBAI_CREDITS_EXHAUSTED" : message, { status });
        }
      },
    },
  },
});

function formatStreamError(error: unknown) {
  const status = errorStatus(error);
  const raw = error instanceof Error ? error.message : String(error);
  console.error("[MB AI] stream error", status, raw);
  if (status === 402) return "MBAI_CREDITS_EXHAUSTED";
  if (status === 403) return raw || "This AI model is blocked by workspace policy.";
  if (status === 429) return "MB AI is busy right now. Please try again shortly.";
  return raw || "MB AI could not answer that request.";
}