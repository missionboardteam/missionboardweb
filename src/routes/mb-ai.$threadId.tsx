import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MbAiLogo } from "@/components/MbAiLogo";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

type Search = { q?: string };

export const Route = createFileRoute("/mb-ai/$threadId")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Chat with MB AI — Mission Board AI" },
      {
        name: "description",
        content: "Ask MB AI your Class 10, 11 and 12 doubts and get step-by-step explanations.",
      },
      { property: "og:title", content: "Chat with MB AI" },
      {
        property: "og:description",
        content: "Mission Board AI answers student doubts instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MbAiThreadPage,
});

function MbAiThreadPage() {
  const { threadId } = Route.useParams();
  const { q } = Route.useSearch();
  const { session } = useAuth();
  const userId = session?.user.id;

  const { data, isLoading } = useQuery({
    queryKey: ["ai-thread", threadId, userId],
    enabled: !!userId,
    queryFn: async () => {
      const [thread, messages] = await Promise.all([
        supabase.from("ai_threads").select("id, title").eq("id", threadId).maybeSingle(),
        supabase
          .from("ai_messages")
          .select("id, role, parts, created_at")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: true }),
      ]);
      if (thread.error) throw thread.error;
      if (messages.error) throw messages.error;
      const history: UIMessage[] = (messages.data ?? []).map((m) => ({
        id: m.id,
        role: m.role === "assistant" ? "assistant" : "user",
        parts: (m.parts as UIMessage["parts"]) ?? [],
      }));
      return { thread: thread.data, history };
    },
  });

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-28">
        <p className="text-sm text-muted-foreground">Sign in to chat with MB AI.</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-28">
        <Shimmer>Opening your chat…</Shimmer>
      </div>
    );
  }

  if (!data.thread) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pb-28">
        <p className="text-sm text-muted-foreground">This chat no longer exists.</p>
        <Link to="/mb-ai" className="text-sm font-semibold text-primary hover:underline">
          Back to MB AI
        </Link>
      </div>
    );
  }

  return (
    <ChatWindow
      key={threadId}
      threadId={threadId}
      title={data.thread.title}
      history={data.history}
      autoPrompt={data.history.length === 0 ? q : undefined}
    />
  );
}

function ChatWindow({
  threadId,
  title,
  history,
  autoPrompt,
}: {
  threadId: string;
  title: string;
  history: UIMessage[];
  autoPrompt?: string;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sentAuto = useRef(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: "/api/chat",
        body: { threadId },
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },

      }),
    [threadId],
  );

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: history,
    transport,
    onError: (error) => {
      const msg = error.message || "";
      if (msg.includes("429")) toast.error("MB AI is busy right now. Please try again shortly.");
      else if (msg.includes("402")) toast.error("MB AI credits are exhausted. Please try later.");
      else toast.error("MB AI couldn't answer that. Please try again.");
    },
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-threads"] });
      textareaRef.current?.focus();
    },
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    if (!autoPrompt || sentAuto.current) return;
    sentAuto.current = true;
    void sendMessage({ text: autoPrompt });
    navigate({ to: "/mb-ai/$threadId", params: { threadId }, search: {}, replace: true });
  }, [autoPrompt, navigate, sendMessage, threadId]);

  async function submit(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    if (title === "New chat") {
      const nextTitle = value.length > 60 ? `${value.slice(0, 57)}…` : value;
      await supabase.from("ai_threads").update({ title: nextTitle }).eq("id", threadId);
      queryClient.invalidateQueries({ queryKey: ["ai-threads"] });
    }
    await sendMessage({ text: value });
    textareaRef.current?.focus();
  }

  return (
    <div className="flex min-h-screen flex-col pb-28 font-sans">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/70 bg-background/85 px-3 py-3 backdrop-blur-xl">
        <Link
          to="/mb-ai"
          aria-label="Back to MB AI"
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <MbAiLogo className="h-8 w-8" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold">{title}</p>
          <p className="text-[11px] text-muted-foreground">Mission Board AI</p>
        </div>
        <Link
          to="/mb-ai"
          aria-label="New chat"
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:text-accent"
        >
          <MessageSquarePlus className="h-5 w-5" />
        </Link>
      </header>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-2xl">
          {messages.length === 0 && (
            <div className="py-16 text-center">
              <MbAiLogo className="mx-auto h-16 w-16" />
              <p className="mt-4 font-display text-lg font-bold">Ask MB AI anything</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Doubts, derivations, numericals, revision plans — all in one place.
              </p>
            </div>
          )}
          {messages.map((message) => {
            const text = message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join("");
            return (
              <Message from={message.role} key={message.id}>
                {message.role === "assistant" ? (
                  <div className="w-full text-sm leading-relaxed text-foreground">
                    <MessageResponse>{text}</MessageResponse>
                  </div>
                ) : (
                  <MessageContent className="bg-primary text-primary-foreground">
                    {text}
                  </MessageContent>
                )}
              </Message>
            );
          })}
          {status === "submitted" && (
            <div className="px-1 py-2">
              <Shimmer>MB AI is thinking…</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="sticky bottom-24 z-20 mx-auto w-full max-w-2xl px-3">
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            void submit(message.text ?? input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            placeholder="Ask MB AI a doubt…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
