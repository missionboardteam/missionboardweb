import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/ai-image/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const file = params.file;
        if (!/^[0-9a-f-]{36}\.png$/i.test(file)) {
          return new Response("Not found", { status: 404 });
        }
        const { readStoredImage } = await import("@/lib/mbai-image.server");
        const blob = await readStoredImage(file);
        if (!blob) return new Response("Not found", { status: 404 });
        return new Response(blob, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
