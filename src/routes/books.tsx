import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "Books — Mission Board Class 10 2027" },
      {
        name: "description",
        content:
          "Latest Class 10 books available on our Google Drive link — PW QCB, Padhle TYQs and Educart question banks.",
      },
      { property: "og:title", content: "Books available now" },
      {
        property: "og:description",
        content: "Class 10 question banks and TYQs available in the Google Drive link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  const { session } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["books-notifications", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, body, link, created_at")
        .eq("channel", "books")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen pb-28 font-sans">
      <div className="hero-surface border-b border-border/70 px-4 py-12 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-gold">Books</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Every book we've dropped in the Google Drive link so far.
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {!session && (
          <p className="text-sm text-muted-foreground">Sign in to see the book list.</p>
        )}
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        <ul className="grid gap-3">
          {data?.map((n) => (
            <li key={n.id} className="card-elevated rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="font-display font-bold">{n.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  {n.link && (
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                    >
                      Open Google Drive 🔗
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
