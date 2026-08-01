import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { AuthPanel } from "@/components/AuthPanel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const PUBLIC_PATHS = ["/auth", "/reset-password"];

export function AuthGate() {
  const { session, loading } = useAuth();
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCanClose(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (loading || session || dismissed) return null;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <Dialog open>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-md [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Sign in to continue</DialogTitle>
        {canClose && (
          <button
            type="button"
            aria-label="Continue without signing in"
            onClick={() => setDismissed(true)}
            className="animate-in fade-in absolute top-3 right-3 z-10 rounded-full border border-border bg-card/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <AuthPanel />
      </DialogContent>
    </Dialog>
  );
}
