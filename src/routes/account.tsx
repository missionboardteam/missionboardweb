import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Droplets, LogOut, Mail, Phone, Snowflake } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useGlass } from "@/lib/glass";
import { channels, TelegramIcon } from "@/lib/channels";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — Mission Board Class 10 2027" },
      {
        name: "description",
        content: "Manage your Mission Board account, edit your profile and quick-join all Telegram channels.",
      },
      { property: "og:title", content: "Your Account" },
      { property: "og:description", content: "Manage your Mission Board family account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(60);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{7,15}$/, "Enter a valid mobile number (digits only, optional +)");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);

const CLASS_OPTIONS = ["Class 10", "Class 11", "Class 12"] as const;

function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const { level: glassLevel, setLevel: setGlassLevel } = useGlass();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [klass, setKlass] = useState("");
  const [bio, setBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, phone, class, bio")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? ((user?.user_metadata?.full_name as string) ?? ""));
    setPhone(profile.phone ?? "");
    setKlass(profile.class ?? "");
    setBio(profile.bio ?? "");
  }, [profile, user]);

  useEffect(() => {
    let active = true;
    async function resolveAvatar() {
      const value = profile?.avatar_url;
      if (!value) {
        setAvatarSrc(null);
        return;
      }
      if (/^https?:\/\//.test(value)) {
        setAvatarSrc(value);
        return;
      }
      const { data } = await supabase.storage.from("avatars").createSignedUrl(value, 3600);
      if (active) setAvatarSrc(data?.signedUrl ?? null);
    }
    void resolveAvatar();
    return () => {
      active = false;
    };
  }, [profile?.avatar_url]);

  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Student";

  const isSocialOnly = (user?.identities ?? []).every((i) => i.provider !== "email");

  async function saveProfile() {
    if (!user) return;
    const parsedName = nameSchema.safeParse(fullName);
    if (!parsedName.success) {
      toast.error(parsedName.error.issues[0].message);
      return;
    }
    let phoneValue: string | null = null;
    if (phone.trim()) {
      const parsedPhone = phoneSchema.safeParse(phone);
      if (!parsedPhone.success) {
        toast.error(parsedPhone.error.issues[0].message);
        return;
      }
      phoneValue = parsedPhone.data;
    }
    setSavingProfile(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: parsedName.data,
        phone: phoneValue,
        class: klass || null,
        bio: bio.trim() || null,
      });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { error } = await supabase.from("profiles").upsert({ id: user.id, avatar_url: path });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload picture");
    } finally {
      setUploading(false);
    }
  }

  async function changePassword() {
    const parsed = passwordSchema.safeParse(newPassword);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen pb-28 font-sans">
      <div className="hero-surface border-b border-border/70 px-4 py-12 text-center">
        <div className="relative mx-auto h-24 w-24">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Your profile picture"
              className="h-24 w-24 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card font-display text-2xl font-extrabold text-gold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            type="button"
            aria-label="Change profile picture"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="absolute -right-1 -bottom-1 rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatar}
          />
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight">{displayName}</h1>
        {user?.email && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </p>
        )}
        {uploading && <p className="mt-2 text-xs text-muted-foreground">Uploading picture…</p>}
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <section className="card-elevated rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold">Edit profile</h2>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="full-name">Display name *</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={60}
                placeholder="Your name"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Class (optional)</Label>
              <div className="flex gap-2">
                {CLASS_OPTIONS.map((c) => {
                  const active = klass === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setKlass(active ? "" : c)}
                      className={`flex-1 rounded-xl px-3 py-2.5 font-display text-sm font-bold transition-all ${
                        active
                          ? "text-accent-foreground"
                          : "border border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
                      }`}
                      style={active ? { backgroundImage: "var(--gradient-gold)" } : undefined}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Mobile number (optional)
              </Label>
              <Input
                id="phone"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={16}
                placeholder="+919876543210"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="bio">Bio (optional)</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="e.g. JEE aspirant, loves Physics"
                className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <Button
              onClick={saveProfile}
              disabled={savingProfile}
              className="mt-1 w-full font-display font-bold"
            >
              {savingProfile ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </section>

        {!isSocialOnly && (
          <section className="card-elevated mt-4 rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">Change password</h2>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="acct-new-password">New password</Label>
                <Input
                  id="acct-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  maxLength={72}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="acct-confirm-password">Confirm new password</Label>
                <Input
                  id="acct-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={72}
                />
              </div>
              <Button
                variant="secondary"
                onClick={changePassword}
                disabled={savingPassword}
                className="mt-1 w-full font-display font-bold"
              >
                {savingPassword ? "Updating…" : "Update password"}
              </Button>
            </div>
          </section>
        )}

        <section className="card-elevated mt-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fine-tune the navigation bar material, from classic frosted glass to glossy liquid glass.
          </p>
          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Snowflake className="h-3.5 w-3.5" /> Frosted
              </span>
              <span className="flex items-center gap-1.5 text-accent">
                Liquid <Droplets className="h-3.5 w-3.5" />
              </span>
            </div>
            <Slider
              aria-label="Glass effect level"
              value={[glassLevel]}
              min={0}
              max={100}
              step={1}
              onValueChange={([v]) => setGlassLevel(v)}
            />
            <p className="text-xs text-muted-foreground">
              Currently: {glassLevel === 0 ? "frosted glass" : glassLevel === 100 ? "liquid glass" : `liquid glass (${glassLevel}%)`}
            </p>
          </div>
        </section>

        <h2 className="mt-8 font-display text-lg font-bold">Quick join</h2>
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
