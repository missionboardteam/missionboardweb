import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MbAiLogo } from "@/components/MbAiLogo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { captureCurrentTab, setMbAiHandoff } from "@/lib/mbai-handoff";

const CAPTION = "I want to know more about this page.";

export function AskMbAiButton({ pageUrl, pageName }: { pageUrl: string; pageName: string }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function ask() {
    if (!session) {
      toast.error("Sign in to ask MB AI.");
      return;
    }
    setBusy(true);
    try {
      const shot = await captureCurrentTab();
      const url = shot ?? `https://image.thum.io/get/width/1200/crop/1600/${pageUrl}`;
      const { data, error } = await supabase
        .from("ai_threads")
        .insert({ user_id: session.user.id, title: `About ${pageName}` })
        .select("id")
        .single();
      if (error) throw error;
      setMbAiHandoff({
        threadId: data.id,
        text: CAPTION,
        files: [{ type: "file", mediaType: "image/png", filename: `${pageName}.png`, url }],
      });
      navigate({ to: "/mb-ai/$threadId", params: { threadId: data.id }, search: { model: "gemini" } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't open MB AI.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={ask}
      disabled={busy}
      aria-label="Ask MB AI about this page"
      className="fixed right-4 bottom-6 z-50 flex items-center gap-2 rounded-full border border-accent/50 bg-card/85 py-1.5 pr-4 pl-1.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-transform active:scale-95 disabled:opacity-70"
    >
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-60 blur-lg"
        style={{ backgroundImage: "var(--gradient-gold)", animation: "mbai-pulse 2.6s ease-in-out infinite" }}
      />
      <span className="absolute -top-2.5 -left-1 rotate-[-8deg] rounded-full bg-destructive px-2 py-0.5 text-[9px] font-black tracking-widest text-destructive-foreground shadow-md ring-2 ring-background">
        ✨ NEW
      </span>
      {busy ? <Loader2 className="h-8 w-8 animate-spin p-1.5 text-accent" /> : <MbAiLogo className="h-8 w-8" />}
      <span className="font-display text-xs font-extrabold tracking-tight text-accent">
        Ask MB AI about this page
      </span>
    </button>
  );
}
