import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AuthMode = "signin" | "signup" | "forgot";

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your name").max(80);

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.46a5.5 5.5 0 0 1-2.4 3.6v3h3.88c2.27-2.09 3.56-5.17 3.56-8.63Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.9l-3.88-3c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.26a12 12 0 0 0 0 10.8l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.16 15.24 0 12 0A12 12 0 0 0 1.26 6.6l4.01 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M16.36 12.68c.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.61 2.79-.41 6.92 1.15 9.19.77 1.11 1.68 2.35 2.88 2.31 1.16-.05 1.6-.75 3-.75s1.79.75 3.01.72c1.24-.02 2.03-1.13 2.79-2.24.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.44-3.7ZM14.1 5.13c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.77-.97 2.82 1.02.08 2.07-.52 2.71-1.28Z" />
    </svg>
  );
}

export function AuthPanel({
  initialMode = "signin",
  onSuccess,
}: {
  initialMode?: AuthMode;
  onSuccess?: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast.error(emailResult.error.issues[0].message);
      return;
    }

    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(emailResult.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent — check your email.");
        setMode("signin");
        return;
      }

      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        toast.error(passwordResult.error.issues[0].message);
        return;
      }

      if (mode === "signup") {
        const nameResult = nameSchema.safeParse(name);
        if (!nameResult.success) {
          toast.error(nameResult.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: emailResult.data,
          password: passwordResult.data,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: nameResult.data },
          },
        });
        if (error) throw error;
        toast.success("Account created! You're all set.");
        onSuccess?.();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailResult.data,
        password: passwordResult.data,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: "google" | "apple") {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Sign in failed");
        return;
      }
      if (result.redirected) return;
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      <h2 className="font-display text-xl font-extrabold tracking-tight">
        {mode === "signup"
          ? "Create your account"
          : mode === "forgot"
            ? "Reset your password"
            : "Sign in to continue"}
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {mode === "signup"
          ? "Join with your email to unlock all channels, notifications and updates."
          : mode === "forgot"
            ? "Enter your email and we'll send you a reset link."
            : "Sign in to browse Mission Board 2027 & Next Generation Academy."}
      </p>

      {mode !== "forgot" && (
        <>
          <div className="mt-5 grid gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => oauth("google")}
              className="w-full gap-2"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => oauth("apple")}
              className="w-full gap-2"
            >
              <AppleIcon />
              Continue with Apple
            </Button>
          </div>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
              or use email
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className={mode === "forgot" ? "mt-5 grid gap-3" : "grid gap-3"}>
        {mode === "signup" && (
          <div className="grid gap-1.5">
            <Label htmlFor="auth-name">Full name</Label>
            <Input
              id="auth-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              maxLength={80}
            />
          </div>
        )}
        <div className="grid gap-1.5">
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={255}
          />
        </div>
        {mode !== "forgot" && (
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="auth-password">Password</Label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              maxLength={72}
            />
          </div>
        )}
        <Button type="submit" disabled={busy} className="mt-2 w-full font-display font-bold">
          {busy
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : mode === "forgot"
                ? "Send reset link"
                : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        {mode === "signin" && (
          <>
            New here?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </button>
          </>
        )}
        {mode === "signup" && (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </button>
          </>
        )}
        {mode === "forgot" && (
          <button
            type="button"
            onClick={() => setMode("signin")}
            className="font-semibold text-primary hover:underline"
          >
            Back to sign in
          </button>
        )}
      </p>
    </div>
  );
}
