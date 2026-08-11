import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { authenticateRequest } from "@/lib/mbai-auth.server";


const SYSTEM_PROMPT = `You are MB AI (Mission Board AI), the study assistant of the Mission Board family —
Mission Board Class 10 2027, Mission Board Class 11 & 12, and the Class 10 Discussion Group.

Your job is to help Indian school students (mainly CBSE Class 10, 11 and 12) with:
- Doubt solving in Maths, Science (Physics, Chemistry, Biology), Social Science, English and Computer.
- Step-by-step solutions, derivations, numericals and formula explanations.
- Exam strategy, revision plans, timetables, PYQ guidance and sample-paper tips.
- Explaining concepts simply, with examples, and in the language the student uses (English, Hindi or Hinglish).

Style rules:
- Be warm, encouraging and motivating — students should feel supported.
- Use clean markdown: short paragraphs, bold key terms, numbered steps for solutions.
- Show working for numericals, and state the final answer clearly with units.
- If a question is outside studies, answer briefly and politely steer back to learning.
- If you are unsure, say so instead of inventing facts.
- Students can attach images, videos and documents (PDF) — read them carefully and answer from what you see.
- You can create images with the generate_image tool (diagrams, labelled figures, posters, revision charts).
  Use it whenever a visual would help or when the student asks for an image. Write a rich, detailed prompt,
  and after the tool runs, briefly explain the image. Never claim you cannot make images.
- For book PDFs or batch links, tell students to check the Books, Notifications or Batches tabs of the website.`;


type ChatRequestBody = { messages?: unknown; threadId?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await authenticateRequest(request);
        if (!auth) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        const threadId = typeof body.threadId === "string" ? body.threadId : null;
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

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const uiMessages = messages as UIMessage[];
        const lastUser = [...uiMessages].reverse().find((m) => m.role === "user");
        if (lastUser) {
          const { error: insertError } = await auth.supabase.from("ai_messages").insert({
            thread_id: threadId,
            user_id: auth.userId,
            role: "user",
            parts: lastUser.parts as unknown as never,
            client_message_id: lastUser.id ?? null,
          });
          if (insertError) console.error("[MB AI] failed saving user message", insertError);
        }

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(uiMessages),
            stopWhen: stepCountIs(50),
            tools: {
              generate_image: tool({
                description:
                  "Generate an image (diagram, labelled figure, chart, poster or illustration) for the student.",
                inputSchema: z.object({
                  prompt: z
                    .string()
                    .describe("Detailed description of the image to generate, in English."),
                }),
                execute: async ({ prompt }) => {
                  const { generateAndStoreImage } = await import("@/lib/mbai-image.server");
                  try {
                    const { url } = await generateAndStoreImage(prompt, key);
                    return { url, prompt };
                  } catch (error) {
                    console.error("[MB AI] image generation failed", error);
                    return {
                      error: error instanceof Error ? error.message : "Image generation failed",
                    };
                  }
                },
              }),
            },
          });


          return result.toUIMessageStreamResponse({
            originalMessages: uiMessages,
            onFinish: async ({ responseMessage }) => {
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
            },
          });
        } catch (error) {
          console.error("[MB AI] gateway error", error);
          const message = error instanceof Error ? error.message : "AI request failed";
          const status = /429|rate limit/i.test(message)
            ? 429
            : /402|credit/i.test(message)
              ? 402
              : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
