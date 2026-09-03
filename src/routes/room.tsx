import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Send, MessagesSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/room")({
  head: () => ({
    meta: [
      { title: "Discussion Room — Mission Board" },
      {
        name: "description",
        content:
          "Ask doubts, discuss chapters and help other Class 10, 11 and 12 students inside the Mission Board Discussion Room.",
      },
      { property: "og:title", content: "Discussion Room — Mission Board" },
      {
        property: "og:description",
        content: "A student community to ask doubts, discuss and share study resources.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoomPage,
});

type Author = { id: string; full_name: string | null; class: string | null };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function initials(name: string) {
  return name.trim().charAt(0).toUpperCase() || "S";
}

function RoomPage() {
  const { session, user } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["room-feed", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("discussion_posts")
        .select("id, user_id, body, created_at")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;

      const ids = posts.map((p) => p.id);
      const userIds = [...new Set(posts.map((p) => p.user_id))];

      const [{ data: authors }, { data: likes }, { data: comments }] = await Promise.all([
        userIds.length
          ? supabase.from("public_profiles").select("id, full_name, class").in("id", userIds)
          : Promise.resolve({ data: [] as Author[] }),
        ids.length
          ? supabase.from("discussion_likes").select("post_id, user_id").in("post_id", ids)
          : Promise.resolve({ data: [] as { post_id: string; user_id: string }[] }),
        ids.length
          ? supabase
              .from("discussion_comments")
              .select("id, post_id, user_id, body, created_at")
              .in("post_id", ids)
              .order("created_at", { ascending: true })
          : Promise.resolve({
              data: [] as {
                id: string;
                post_id: string;
                user_id: string;
                body: string;
                created_at: string;
              }[],
            }),
      ]);

      const commentUserIds = [...new Set((comments ?? []).map((c) => c.user_id))].filter(
        (id) => !userIds.includes(id),
      );
      let allAuthors = (authors ?? []) as Author[];
      if (commentUserIds.length) {
        const { data: more } = await supabase
          .from("public_profiles")
          .select("id, full_name, class")
          .in("id", commentUserIds);
        allAuthors = [...allAuthors, ...((more ?? []) as Author[])];
      }
      const authorMap = new Map(allAuthors.map((a) => [a.id, a]));

      return posts.map((p) => ({
        ...p,
        author: authorMap.get(p.user_id) ?? null,
        likes: (likes ?? []).filter((l) => l.post_id === p.id).length,
        liked: (likes ?? []).some((l) => l.post_id === p.id && l.user_id === user?.id),
        comments: (comments ?? [])
          .filter((c) => c.post_id === p.id)
          .map((c) => ({ ...c, author: authorMap.get(c.user_id) ?? null })),
      }));
    },
  });

  const post = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase
        .from("discussion_posts")
        .insert({ user_id: user!.id, body: text });
      if (error) throw error;
    },
    onSuccess: () => {
      setBody("");
      void qc.invalidateQueries({ queryKey: ["room-feed"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not post"),
  });

  const comment = useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      const { error } = await supabase
        .from("discussion_comments")
        .insert({ post_id: postId, user_id: user!.id, body: text });
      if (error) throw error;
    },
    onSuccess: () => {
      setCommentText("");
      void qc.invalidateQueries({ queryKey: ["room-feed"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not comment"),
  });

  const toggleLike = useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (liked) {
        const { error } = await supabase
          .from("discussion_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("discussion_likes")
          .insert({ post_id: postId, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["room-feed"] }),
  });

  return (
    <div className="min-h-screen pb-28 font-sans">
      <div className="hero-surface border-b border-border/70 px-4 py-10 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-gold">Discussion Room</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Ask doubts, discuss chapters and help each other out. Visible to everyone using this site —
          keep it respectful.
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {!session && (
          <p className="text-sm text-muted-foreground">Sign in to join the discussion.</p>
        )}

        {session && (
          <div className="card-elevated rounded-3xl border border-border bg-card p-4">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Ask a doubt or share something…"
              className="w-full resize-none rounded-2xl border border-border bg-secondary/60 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                disabled={post.isPending || body.trim().length < 2}
                onClick={() => post.mutate(body.trim())}
                className="glow inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-display text-xs font-bold text-primary-foreground disabled:opacity-50"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                <Send className="h-3.5 w-3.5" />
                {post.isPending ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        )}

        {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}

        {!isLoading && session && data && data.length === 0 && (
          <div className="card-elevated mt-6 rounded-3xl border border-border bg-card p-10 text-center">
            <MessagesSquare className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-display font-bold">No discussions yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Be the first to ask a doubt.</p>
          </div>
        )}

        <ul className="mt-5 grid gap-3">
          {data?.map((p) => {
            const name = p.author?.full_name || "Student";
            return (
              <li key={p.id} className="card-elevated rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-extrabold text-primary-foreground"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    {initials(name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display text-sm font-bold">{name}</p>
                      {p.author?.class && (
                        <span className="rounded-md border border-accent/40 bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-gold">
                          {p.author.class}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{timeAgo(p.created_at)}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {p.body}
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleLike.mutate({ postId: p.id, liked: p.liked })}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
                      p.liked
                        ? "border-accent/50 bg-accent/15 text-gold"
                        : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart
                      className="h-4 w-4 shrink-0"
                      strokeWidth={2.25}
                      fill={p.liked ? "currentColor" : "none"}
                    />
                    <span>{p.likes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenComments(openComments === p.id ? null : p.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {p.comments.length > 0 ? `${p.comments.length} Comments` : "Comments"}
                  </button>
                </div>

                {openComments === p.id && (
                  <div className="mt-3 border-t border-border pt-3">
                    <ul className="grid gap-2">
                      {p.comments.map((c) => {
                        const canDelete =
                          c.user_id === user?.id &&
                          Date.now() - new Date(c.created_at).getTime() < 48 * 3600 * 1000;
                        return (
                          <li key={c.id} className="rounded-xl bg-secondary/50 p-3">
                            <div className="flex items-start gap-2">
                              <p className="text-xs font-bold">
                                {c.author?.full_name || "Student"}
                                <span className="ml-2 font-normal text-muted-foreground">
                                  {timeAgo(c.created_at)}
                                </span>
                              </p>
                              {canDelete && (
                                <button
                                  type="button"
                                  disabled={removeComment.isPending}
                                  onClick={() => removeComment.mutate(c.id)}
                                  className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </button>
                              )}
                            </div>
                            <p className="mt-1 text-sm whitespace-pre-wrap text-foreground/90">
                              {c.body}
                            </p>
                          </li>
                        );
                      })}

                    </ul>
                    {session && (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          maxLength={500}
                          placeholder="Write a comment…"
                          className="h-10 flex-1 rounded-xl border border-border bg-secondary/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={comment.isPending || commentText.trim().length < 1}
                          onClick={() =>
                            comment.mutate({ postId: p.id, text: commentText.trim() })
                          }
                          className="rounded-xl border border-border bg-secondary px-3 text-xs font-bold text-foreground disabled:opacity-50"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
