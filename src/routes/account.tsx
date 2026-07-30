import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { channels, TelegramIcon } from "@/lib/channels";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — Mission Board Class 10 2027" },
      {
        name: "description",
        content: "Manage your Mission Board account, view your profile and quick-join all Telegram channels.",
      },
      { property: "og:title", content: "Your Account" },
      { property: "og:description", content: "Manage your Mission Board family account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Student";

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen pb-24 font-sans">
      <div className="hero-surface border-b border-border/70 px-4 py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card font-display text-2xl font-extrabold text-gold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight">{displayName}</h1>
        {user?.email && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <h2 className="font-display text-lg font-bold">Quick join</h2>
        <ul className="mt-3 grid gap-3">
          {channels.map((c) => (
            <li key={c.name}>
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="card-elevated flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <img src={c.logo} alt={`${c.name} logo`} className="h-11 w-11 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.tag}</p>
                </div>
                <TelegramIcon className="h-5 w-5 text-primary" />
              </a>
            </li>
          ))}
        </ul>

        <Button variant="outline" onClick={handleSignOut} className="mt-8 w-full gap-2">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
