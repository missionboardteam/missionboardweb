import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Mission Board Class 10 2027" },
      {
        name: "description",
        content: "Latest announcements and updates from Mission Board 2027 and Next Generation Academy.",
      },
      { property: "og:title", content: "Notifications" },
      { property: "og:description", content: "Latest announcements from the Mission Board family." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { session } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, body, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen pb-24 font-sans">
      <div className="hero-surface border-b border-border/70 px-4 py-12 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-gold">Notifications</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Announcements, new material drops and important exam updates.
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && (!data || data.length === 0) && (
          <div className="card-elevated rounded-3xl border border-border bg-card p-10 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-display font-bold">No notifications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You'll see updates here as soon as they're posted.
            </p>
          </div>
        )}
        <ul className="grid gap-3">
          {data?.map((n) => (
            <li
              key={n.id}
              className="card-elevated rounded-2xl border border-border bg-card p-5"
            >
              <p className="font-display font-bold">{n.title}</p>
              {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
