import { NextRequest } from "next/server";
import { env } from "@/lib/env";
import fallbackRaw from "@/content/twin/fallback-answers.json";
import suggestedRaw from "@/content/twin/suggested-questions.json";

type FallbackAnswers = {
  answers: Record<string, { id: string; answer: string; sources: string[] }>;
  defaultFallback: { answer: string; sources: string[] };
};

const fallbackData = fallbackRaw as FallbackAnswers;

// Match prompt to a fallback answer
function matchFallback(prompt: string): {
  answer: string;
  sources: string[];
} {
  const lower = prompt.toLowerCase();
  const keyMap: Record<string, string[]> = {
    q1: ["project", "engineering", "greenlink"],
    q2: ["ai architecture", "architecture", "experience"],
    q3: ["research", "interest"],
    q4: ["technolog", "work with", "stack"],
    q5: ["academic", "background", "education"],
    q6: ["contact", "connect", "reach"],
  };
  for (const [id, keywords] of Object.entries(keyMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const hit = fallbackData.answers[id];
      if (hit) return { answer: hit.answer, sources: hit.sources };
    }
  }
  return {
    answer: fallbackData.defaultFallback.answer,
    sources: fallbackData.defaultFallback.sources,
  };
}

// Server-sent events stream helper
function sseStream(answer: string, sources: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Stream word by word for natural feel
      const words = answer.split(" ");
      let idx = 0;
      function pushNext() {
        if (idx < words.length) {
          const word = (idx === 0 ? "" : " ") + (words[idx] ?? "");
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ delta: word })}\n\n`),
          );
          idx++;
          setTimeout(pushNext, 25);
        } else {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ sources, delta: "" })}\n\n`,
            ),
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      }
      pushNext();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // bypass in dev (no key configured)

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
    });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("prompt" in body) ||
    typeof (body as Record<string, unknown>).prompt !== "string"
  ) {
    return new Response(JSON.stringify({ error: "prompt is required" }), {
      status: 400,
    });
  }

  const { prompt, token } = body as { prompt: string; token?: string };

  // Turnstile verification
  const verified = await verifyTurnstile(token ?? "");
  if (!verified) {
    return new Response(
      JSON.stringify({ error: "Turnstile verification failed" }),
      { status: 403 },
    );
  }

  // Try FastAPI backend (RAG)
  const backendUrl = env.TWIN_BACKEND_URL;
  if (backendUrl) {
    try {
      const upstream = await fetch(`${backendUrl}/twin/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: AbortSignal.timeout(8000),
      });
      if (upstream.ok && upstream.body) {
        // Forward SSE stream from FastAPI backend
        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }
    } catch {
      // Backend unavailable — fall through to offline mode
    }
  }

  // Offline fallback
  const { answer, sources } = matchFallback(prompt);
  return sseStream(answer, sources);
}

// Quiet unused import — suggestedRaw is imported for type-checking the JSON shape
void suggestedRaw;
