import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquarePlus, MessageCircle, Trash2, Sparkle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MbAiLogo } from "@/components/MbAiLogo";
import { toast } from "sonner";

export const Route = createFileRoute("/mb-ai/")({
  head: () => ({
    meta: [
      { title: "MB AI — Mission Board AI Study Assistant" },
      {
        name: "description",
        content:
          "Ask MB AI, the Mission Board AI tutor, any Class 10, 11 or 12 doubt and get step-by-step answers instantly.",
      },
      { property: "og:title", content: "MB AI — Mission Board AI" },
      {
        property: "og:description",
        content: "Your 24x7 AI study buddy for CBSE Class 10, 11 and 12 doubts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MbAiHome,
});

const SUGGESTIONS = [
  "Explain Newton's second law with an example",
  "Solve: quadratic equation x² - 5x + 6 = 0",
  "Give me a 30-day Class 10 board revision plan",
  "Summarise Nationalism in India in 10 points",
];

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
    mutationFn: async (title?: string) => {
      if (!userId) throw new Error("Sign in to chat with MB AI");
      const { data, error } = await supabase
        .from("ai_threads")
        .insert({ user_id: userId, title: title ?? "New chat" })
        .select("id")
        .single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: (id, title) => {
      queryClient.invalidateQueries({ queryKey: ["ai-threads", userId] });
      navigate({
        to: "/mb-ai/$threadId",
        params: { threadId: id },
        search: title ? { q: title } : undefined,
      });
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

  const busy = createThread.isPending;
  const list = useMemo(() => threads ?? [], [threads]);

  return (
    <div className="min-h-screen pb-28 font-sans">
      <div className="hero-surface border-b border-border/70 px-4 py-12 text-center">
        <MbAiLogo className="mx-auto h-20 w-20" />
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-gold">MB AI</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Mission Board AI — your 24x7 study buddy. Ask any doubt from Class 10, 11 or 12 and get
          clear, step-by-step answers.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => createThread.mutate(undefined)}
          className="glow mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          <MessageSquarePlus className="h-4 w-4" />
          Start a new chat
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {!session && (
          <p className="text-sm text-muted-foreground">Sign in to start chatting with MB AI.</p>
        )}

        {session && (
          <>
            <h2 className="font-display text-sm font-bold tracking-wide text-muted-foreground uppercase">
              Try asking
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  onClick={() => createThread.mutate(s)}
                  className="card-elevated flex items-start gap-2 rounded-2xl border border-border bg-card p-3 text-left text-sm transition-colors hover:border-accent/60 disabled:opacity-60"
                >
                  <Sparkle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{s}</span>
                </button>
              ))}
            </div>

            <h2 className="mt-8 font-display text-sm font-bold tracking-wide text-muted-foreground uppercase">
              Your chats
            </h2>
            {isLoading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
            {!isLoading && list.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                No chats yet — start one above and MB AI will remember it here.
              </p>
            )}
            <ul className="mt-3 space-y-2">
              {list.map((t) => (
                <li
                  key={t.id}
                  className="card-elevated flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2"
                >
                  <Link
                    to="/mb-ai/$threadId"
                    params={{ threadId: t.id }}
                    className="flex min-w-0 flex-1 items-center gap-3 py-1"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{t.title}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete ${t.title}`}
                    onClick={() => deleteThread.mutate(t.id)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
