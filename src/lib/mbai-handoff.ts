import type { FileUIPart } from "ai";

/** In-memory handoff of a prompt + files from another page into a fresh MB AI chat. */
type Handoff = { threadId: string; text: string; files: FileUIPart[] };
let pending: Handoff | null = null;

export function setMbAiHandoff(h: Handoff) {
  pending = h;
}

export function takeMbAiHandoff(threadId: string): Handoff | null {
  if (!pending || pending.threadId !== threadId) return null;
  const h = pending;
  pending = null;
  return h;
}

/** Captures the current tab (incl. embedded sites) via screen capture; returns a PNG data URL or null. */
export async function captureCurrentTab(): Promise<string | null> {
  const md = navigator.mediaDevices as MediaDevices | undefined;
  if (!md?.getDisplayMedia) return null;
  let stream: MediaStream | null = null;
  try {
    stream = await md.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: false,
      // @ts-expect-error Chromium-only hints
      preferCurrentTab: true,
      selfBrowserSurface: "include",
    });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    await video.play();
    await new Promise((r) => setTimeout(r, 300));
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  } finally {
    stream?.getTracks().forEach((t) => t.stop());
  }
}
