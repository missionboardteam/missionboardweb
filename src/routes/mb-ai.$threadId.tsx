import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type FileUIPart, type UIMessage } from "ai";
import { ArrowLeft, Bot, BrainCircuit, ChevronDown, FileText, MessageSquarePlus, Paperclip, X, Zap } from "lucide-react";

import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { takeMbAiHandoff } from "@/lib/mbai-handoff";
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
  usePromptInputAttachments,

} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_MBAI_MODEL, isMbAiModelId, MBAI_MODELS, type MbAiModelId } from "@/lib/mbai-models";

type Search = { q?: string; model?: MbAiModelId };

export const Route = createFileRoute("/mb-ai/$threadId")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
    model: isMbAiModelId(search.model) ? search.model : DEFAULT_MBAI_MODEL,
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
  const { q, model } = Route.useSearch();
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
      initialModel={model ?? DEFAULT_MBAI_MODEL}
    />
  );
}

function ChatWindow({
  threadId,
  title,
  history,
  autoPrompt,
  initialModel,
}: {
  threadId: string;
  title: string;
  history: UIMessage[];
  autoPrompt?: string;
  initialModel: MbAiModelId;
}) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<MbAiModelId>(initialModel);
  const [showExternalConsent, setShowExternalConsent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sentAuto = useRef(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: "/api/chat",
        body: { threadId, model: selectedModel },
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },

      }),
    [selectedModel, threadId],
  );

  const { messages, sendMessage, regenerate, clearError, status } = useChat({
    id: threadId,
    messages: history,
    transport,
    onError: (error) => {
      const msg = error.message || "";
      if (msg.includes("MBAI_CREDITS_EXHAUSTED") || msg.includes("402")) setShowExternalConsent(true);
      else if (msg.includes("429")) toast.error("MB AI is busy right now. Please try again shortly.");
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
    if (sentAuto.current) return;
    const handoff = takeMbAiHandoff(threadId);
    if (!handoff) return;
    sentAuto.current = true;
    void sendMessage({ text: handoff.text, files: handoff.files });
  }, [sendMessage, threadId]);

  useEffect(() => {
    if (!autoPrompt || sentAuto.current) return;
    sentAuto.current = true;
    void sendMessage({ text: autoPrompt });
    navigate({ to: "/mb-ai/$threadId", params: { threadId }, search: { model: selectedModel }, replace: true });
  }, [autoPrompt, navigate, selectedModel, sendMessage, threadId]);

  function chooseModel(model: MbAiModelId) {
    setSelectedModel(model);
    navigate({ to: "/mb-ai/$threadId", params: { threadId }, search: { model }, replace: true });
  }

  async function confirmExternalProcessing() {
    setShowExternalConsent(false);
    clearError();
    await regenerate({ body: { threadId, model: "gemini", externalFallback: true } });
  }

  async function submit(text: string, files: FileUIPart[]) {
    const value = text.trim();
    if ((!value && files.length === 0) || busy) return;
    setInput("");
    if (title === "New chat" && value) {
      const nextTitle = value.length > 60 ? `${value.slice(0, 57)}…` : value;
      await supabase.from("ai_threads").update({ title: nextTitle }).eq("id", threadId);
      queryClient.invalidateQueries({ queryKey: ["ai-threads"] });
    }
    await sendMessage({ text: value || "Please analyse the attached file(s).", files });
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
        <ModelMenu selected={selectedModel} onChoose={chooseModel} />
        <Link
          to="/mb-ai"
          aria-label="New chat"
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:text-accent"
        >
          <MessageSquarePlus className="h-5 w-5" />
        </Link>
      </header>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-2xl pb-44">
          {messages.length === 0 && (
            <div className="py-16 text-center">
              <MbAiLogo className="mx-auto h-16 w-16" />
              <p className="mt-4 font-display text-lg font-bold">Ask MB AI anything</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Doubts, derivations, numericals, images, revision plans — all in one place.
              </p>
            </div>
          )}
          {messages.map((message) => {
            const text = message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join("")
              // the generated image is rendered separately, so drop any inline copy
              .replace(/!\[[^\]]*\]\(\/api\/public\/ai-image\/[^)]+\)/g, "")
              .trim();

            const files = message.parts.filter(
              (part): part is FileUIPart => part.type === "file",
            );
            const images = message.parts.flatMap((part) =>
              part.type === "tool-generate_image" &&
              part.state === "output-available" &&
              (part.output as { url?: string } | undefined)?.url
                ? [(part.output as { url: string }).url]
                : [],
            );
            const generating = message.parts.some(
              (part) =>
                part.type === "tool-generate_image" &&
                (part.state === "input-available" || part.state === "input-streaming"),
            );
            return (
              <Message from={message.role} key={message.id}>
                {message.role === "assistant" ? (
                  <div className="w-full space-y-3 text-sm leading-relaxed text-foreground">
                    {generating && images.length === 0 && (
                      <Shimmer>Creating your image…</Shimmer>
                    )}
                    {images.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt="Image generated by MB AI"
                        loading="lazy"
                        className="w-full max-w-sm rounded-2xl border border-border/60"
                      />
                    ))}
                    {text && <MessageResponse>{text}</MessageResponse>}
                  </div>
                ) : (
                  <div className="flex max-w-[85%] flex-col items-end gap-2">
                    {files.length > 0 && (
                      <div className="flex flex-wrap justify-end gap-2">
                        {files.map((file, index) => (
                          <AttachmentPreview file={file} key={`${file.url}-${index}`} />
                        ))}
                      </div>
                    )}
                    {text && (
                      <MessageContent className="bg-primary text-primary-foreground">
                        {text}
                      </MessageContent>
                    )}
                  </div>
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

      <div className="pointer-events-none sticky bottom-24 z-20 mx-auto w-full max-w-2xl px-3">
        <div className="pointer-events-auto relative overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.07] shadow-[0_18px_50px_-16px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.22)] backdrop-blur-2xl backdrop-saturate-150">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/12 to-transparent"
          />
          <PromptInput
            accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
            multiple
            maxFiles={5}
            maxFileSize={20 * 1024 * 1024}
            onError={(error) => toast.error(error.message)}
            className="relative bg-transparent"
            onSubmit={(message, event) => {
              event.preventDefault();
              void submit(message.text ?? input, message.files ?? []);
            }}
          >
            <ComposerAttachments />
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Ask MB AI a doubt…"
              className="bg-transparent"
            />
            <PromptInputFooter className="justify-between border-none bg-transparent">
              <AttachButton />
              <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
      <AlertDialog open={showExternalConsent} onOpenChange={setShowExternalConsent}>
        <AlertDialogContent className="max-w-md rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>MB AI credits are exhausted</AlertDialogTitle>
            <AlertDialogDescription className="leading-6">
              Would you like to send your data to third-party servers to process your request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmExternalProcessing()}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const MODEL_ICONS = { gemini: Zap, chatgpt: BrainCircuit, claude: Bot } satisfies Record<
  MbAiModelId,
  typeof Bot
>;

function ModelMenu({ selected, onChoose }: { selected: MbAiModelId; onChoose: (model: MbAiModelId) => void }) {
  const current = MBAI_MODELS[selected];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-32 gap-1.5">
          <span className="truncate">{current.name}</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-lg p-2">
        <DropdownMenuLabel>Choose a MB AI-supported AI Model to chat with…</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.values(MBAI_MODELS) as (typeof MBAI_MODELS)[MbAiModelId][]).map((model) => {
          const Icon = MODEL_ICONS[model.id];
          return (
            <DropdownMenuItem
              key={model.id}
              disabled={!model.available}
              onSelect={() => onChoose(model.id)}
              className="items-start rounded-md py-3"
            >
              <Icon className="mt-0.5 text-primary" />
              <span>
                <span className="block font-semibold">{model.name}</span>
                <span className="block text-xs text-muted-foreground">{model.description}</span>
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AttachButton() {
  const attachments = usePromptInputAttachments();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Attach image, video or document"
      onClick={() => attachments.openFileDialog()}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Paperclip className="h-4 w-4" />
    </Button>
  );
}

function ComposerAttachments() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 px-3 pt-3">
      {attachments.files.map((file) => (
        <div key={file.id} className="relative">
          <AttachmentPreview file={file} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${file.filename ?? "attachment"}`}
            onClick={() => attachments.remove(file.id)}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-background/90 text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function AttachmentPreview({ file }: { file: FileUIPart }) {
  const type = file.mediaType ?? "";
  if (type.startsWith("image/")) {
    return (
      <img
        src={file.url}
        alt={file.filename ?? "Attached image"}
        className="h-20 w-20 rounded-2xl border border-white/15 object-cover"
      />
    );
  }
  if (type.startsWith("video/")) {
    return (
      <video
        src={file.url}
        controls
        className="h-20 w-32 rounded-2xl border border-white/15 object-cover"
      />
    );
  }
  return (
    <div className="flex h-20 max-w-[10rem] flex-col justify-center gap-1 rounded-2xl border border-white/15 bg-white/10 px-3 text-xs">
      <FileText className="h-4 w-4 text-accent" />
      <span className="truncate">{file.filename ?? "Document"}</span>
    </div>
  );
}

