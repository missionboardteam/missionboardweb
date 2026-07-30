import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthPanel } from "@/components/AuthPanel";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Mission Board Class 10 2027" },
      {
        name: "description",
        content: "Sign in or create an account with email, Google or Apple to browse Mission Board 2027.",
      },
      { property: "og:title", content: "Sign in to Mission Board 2027" },
      { property: "og:description", content: "Create an account or sign in to continue browsing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate({ to: "/", replace: true });
  }, [session, navigate]);

  return (
    <div className="hero-surface flex min-h-screen items-center justify-center px-4 py-16 font-sans">
      <div className="card-elevated w-full max-w-md rounded-3xl border border-border bg-card p-7">
        <AuthPanel onSuccess={() => navigate({ to: "/", replace: true })} />
      </div>
    </div>
  );
}
