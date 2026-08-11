import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKET = "ai-images";

/** Generates an image with Lovable AI and stores it, returning a stable app URL. */
export async function generateAndStoreImage(prompt: string, apiKey: string) {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Image generation failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const json = (await response.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image generation returned no image");

  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const name = `${crypto.randomUUID()}.png`;
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(name, bytes, { contentType: "image/png", upsert: false });
  if (error) throw new Error(`Could not store the generated image: ${error.message}`);

  return { url: `/api/public/ai-image/${name}` };
}

export async function readStoredImage(name: string) {
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).download(name);
  if (error || !data) return null;
  return data;
}
