import { useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { AuthPanel } from "@/components/AuthPanel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const PUBLIC_PATHS = ["/auth", "/reset-password"];

export function AuthGate() {
  const { session, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading || session) return null;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <Dialog open>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-md [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Sign in to continue</DialogTitle>
        <AuthPanel />
      </DialogContent>
    </Dialog>
  );
}
