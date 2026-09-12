import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bot,
  BrainCircuit,
  ChevronDown,
  Clock3,
  MessageCircle,
  MessageSquarePlus,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { MbAiLogo } from "@/components/MbAiLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MBAI_MODELS, type MbAiModelId } from "@/lib/mbai-models";

export const Route = createFileRoute("/mb-ai/")({
  head: () => ({
    meta: [
      { title: "MB AI — Mission Board Study Assistant" },
      {
        name: "description",
        content: "Chat with MB AI for clear, step-by-step Class 10, 11 and 12 study help.",
      },
      { property: "og:title", content: "MB AI — Mission Board Study Assistant" },
      { property: "og:description", content: "AI-powered study help from Mission Board." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MbAiHome,
});

const MODEL_ICONS = {
  gemini: Zap,
  chatgpt: BrainCircuit,
  claude: Bot,
} satisfies Record<MbAiModelId, typeof Bot>;

function MbAiHome() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  const { data: threads, isLoading } = useQuery({
    queryKey: ["ai-threads", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_threads")
        .select("id, title, updated_at")
        .order("updated_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const createThread = useMutation({
    mutationFn: async (model: MbAiModelId) => {
      if (!userId) throw new Error("Sign in to chat with MB AI");
      const { data, error } = await supabase
        .from("ai_threads")
        .insert({ user_id: userId, title: "New chat" })
        .select("id")
        .single();
      if (error) throw error;
      return { id: data.id, model };
    },
    onSuccess: ({ id, model }) => {
      queryClient.invalidateQueries({ queryKey: ["ai-threads", userId] });
      navigate({ to: "/mb-ai/$threadId", params: { threadId: id }, search: { model } });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteThread = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ai_threads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai-threads", userId] }),
    onError: (error: Error) => toast.error(error.message),
  });

  const list = useMemo(() => threads ?? [], [threads]);

  return (
    <main className="min-h-screen bg-background pb-28 font-sans">
      <section className="relative overflow-hidden border-b border-primary/20 px-4 pb-10 pt-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_48%)]" />
        <div className="relative mx-auto max-w-4xl">
          <CreditStatus />
          <div className="mx-auto mt-10 max-w-xl text-center sm:mt-8">
            <MbAiLogo className="mx-auto h-24 w-24 sm:h-28 sm:w-28" />
            <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl">MB AI</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              Your Mission Board study assistant for clear explanations, solved questions, study
              plans, and visual learning.
            </p>
            <div className="mt-7 flex justify-center">
              <NewChatMenu
                disabled={!session || createThread.isPending}
                onChoose={(model) => createThread.mutate(model)}
              />
            </div>
            {!session && <p className="mt-3 text-xs text-muted-foreground">Sign in to begin.</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8" aria-labelledby="chat-history-title">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary">CONVERSATIONS</p>
            <h2 id="chat-history-title" className="mt-1 font-display text-xl font-bold">
              Your chats
            </h2>
          </div>
          {session && (
            <NewChatMenu
              compact
              disabled={createThread.isPending}
              onChoose={(model) => createThread.mutate(model)}
            />
          )}
        </div>

        {!session && (
          <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
            Sign in to see your saved conversations.
          </div>
        )}
        {session && isLoading && <p className="text-sm text-muted-foreground">Loading chats…</p>}
        {session && !isLoading && list.length === 0 && (
          <div className="rounded-lg border border-dashed border-primary/35 bg-primary/5 p-8 text-center">
            <MessageCircle className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 font-semibold">No conversations yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Choose a model to start your first chat.</p>
          </div>
        )}
        <ul className="space-y-2">
          {list.map((thread) => (
            <li key={thread.id} className="flex items-center gap-2 rounded-lg border border-border bg-card p-2">
              <Link
                to="/mb-ai/$threadId"
                params={{ threadId: thread.id }}
                search={{ model: "gemini" }}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-primary/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{thread.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {new Date(thread.updated_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </span>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${thread.title}`}
                onClick={() => deleteThread.mutate(thread.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function CreditStatus() {
  return (
    <div className="inline-flex items-center gap-3 rounded-lg border border-primary/30 bg-card/90 px-3 py-2 shadow-sm backdrop-blur-xl">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary">
        <Zap className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-extrabold">0 AI credits remaining</span>
        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock3 className="h-3 w-3" /> Monthly credits refill October 1
        </span>
      </span>
    </div>
  );
}

function NewChatMenu({
  onChoose,
  disabled,
  compact = false,
}: {
  onChoose: (model: MbAiModelId) => void;
  disabled: boolean;
  compact?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} size={compact ? "sm" : "lg"} className="font-bold">
          <MessageSquarePlus /> New Chat <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[min(22rem,calc(100vw-2rem))] rounded-lg p-2">
        <DropdownMenuLabel className="px-2 py-2 text-sm leading-5">
          Choose a MB AI-supported AI Model to chat with…
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.values(MBAI_MODELS) as (typeof MBAI_MODELS)[MbAiModelId][]).map((model) => {
          const Icon = MODEL_ICONS[model.id];
          return (
            <DropdownMenuItem
              key={model.id}
              disabled={!model.available}
              onSelect={() => onChoose(model.id)}
              className="items-start rounded-md px-3 py-3"
            >
              <Icon className="mt-0.5 text-primary" />
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-semibold">
                  {model.name}
                  {!model.available && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      Unavailable
                    </span>
                  )}
                </span>
                <span className="block text-xs leading-5 text-muted-foreground">
                  {model.description}
                </span>
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}