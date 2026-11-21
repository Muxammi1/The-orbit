"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { TurnstileWidget } from "./TurnstileWidget";

interface Question {
  id: string;
  label: string;
  prompt: string;
}

interface FallbackAnswer {
  id: string;
  answer: string;
  sources: string[];
}

interface FallbackData {
  answers: Record<string, FallbackAnswer>;
  defaultFallback: { answer: string; sources: string[] };
}

interface Message {
  role: "user" | "twin";
  content: string;
  sources?: string[];
  streaming?: boolean;
}

interface ChatInterfaceProps {
  questions: Question[];
  fallbackData: FallbackData;
  personaName?: string;
}

// Match a question prompt to a fallback answer key
function matchFallback(
  prompt: string,
  fallbackData: FallbackData,
): FallbackAnswer {
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
      if (hit) return hit;
    }
  }
  return {
    id: "default",
    answer: fallbackData.defaultFallback.answer,
    sources: fallbackData.defaultFallback.sources,
  };
}

export function ChatInterface({
  questions,
  fallbackData,
  personaName = "Muzammil",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [hasSentFirst, setHasSentFirst] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTokenExpire = useCallback(() => {
    setToken(null);
    setTokenExpired(true);
  }, []);

  const handleTokenVerify = useCallback((t: string) => {
    setToken(t);
    setTokenExpired(false);
  }, []);

  const setQuestion = useCallback((prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  }, []);

  const appendUserMessage = useCallback((content: string) => {
    setMessages((prev) => [...prev, { role: "user", content }]);
  }, []);

  const appendTwinMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateLastTwinMessage = useCallback(
    (updater: (prev: Message) => Message) => {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (!last || last.role !== "twin") return copy;
        copy[copy.length - 1] = updater(last);
        return copy;
      });
    },
    [],
  );

  async function sendMessage() {
    const prompt = input.trim();
    if (!prompt || loading) return;

    setInput("");
    setLoading(true);
    setHasSentFirst(true);
    appendUserMessage(prompt);

    // If no token and site key configured, use fallback directly
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
    if (!siteKey || !token) {
      // Offline fallback mode
      const fallback = matchFallback(prompt, fallbackData);
      setTimeout(() => {
        appendTwinMessage({
          role: "twin",
          content: fallback.answer,
          sources: fallback.sources,
        });
        setLoading(false);
      }, 450);
      return;
    }

    // Online streaming mode
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    appendTwinMessage({ role: "twin", content: "", streaming: true });

    try {
      const response = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, token }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const fallback = matchFallback(prompt, fallbackData);
        updateLastTwinMessage(() => ({
          role: "twin",
          content: fallback.answer,
          sources: fallback.sources,
          streaming: false,
        }));
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE lines
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data) as {
                delta?: string;
                sources?: string[];
              };
              if (parsed.delta) {
                accumulated += parsed.delta;
                updateLastTwinMessage((prev) => ({
                  ...prev,
                  content: accumulated,
                }));
              }
              if (parsed.sources) {
                updateLastTwinMessage((prev) => ({
                  ...prev,
                  sources: parsed.sources,
                  streaming: false,
                }));
              }
            } catch {
              // non-JSON SSE line, ignore
            }
          }
        }
      }

      updateLastTwinMessage((prev) => ({ ...prev, streaming: false }));
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const fallback = matchFallback(prompt, fallbackData);
      updateLastTwinMessage(() => ({
        role: "twin",
        content: fallback.answer,
        sources: fallback.sources,
        streaming: false,
      }));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  const isTokenReady =
    !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || !!token;

  return (
    <div className="flex flex-col gap-6">
      {/* Intro label */}
      <p className="text-[11px] font-mono uppercase tracking-widest text-[#8C96A3]">
        TWIN INTERFACE / OFFLINE KNOWLEDGE BASE
      </p>

      {/* Suggested questions — hide after first send */}
      {!hasSentFirst && (
        <SuggestedQuestions
          questions={questions}
          onSelect={setQuestion}
          disabled={loading}
        />
      )}

      {/* Chat log */}
      {messages.length > 0 && (
        <div
          className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin"
          role="log"
          aria-label="Conversation with the Digital Twin"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C96A3]">
                {msg.role === "user" ? "YOU" : personaName.toUpperCase()}
              </span>
              <div
                className={[
                  "max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#171B22] border border-[#252C35] text-[#D9DEE5] text-right"
                    : "bg-[#0E1117] border border-[#B6E36A]/20 text-[#D9DEE5]",
                ].join(" ")}
              >
                {msg.content || (msg.streaming ? "…" : "")}
                {msg.streaming && (
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#B6E36A] animate-pulse align-middle" />
                )}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {msg.sources.map((src, si) => (
                    <span
                      key={si}
                      className="text-[10px] font-mono text-[#8C96A3]/60 italic"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Turnstile — shown before first message */}
      {!hasSentFirst && (
        <div>
          <TurnstileWidget
            onVerify={handleTokenVerify}
            onExpire={handleTokenExpire}
          />
          {tokenExpired && (
            <p className="text-[11px] font-mono text-[#B58A68] mt-2">
              Verification expired — please re-verify before sending.
            </p>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 items-end">
        <label htmlFor="twin-input" className="sr-only">
          Ask the Digital Twin
        </label>
        <textarea
          id="twin-input"
          ref={inputRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Ask anything about Muzammil's work, research, or background…"
          className={[
            "flex-1 resize-none bg-[#0E1117] border border-[#252C35]",
            "rounded-sm px-4 py-3 text-sm text-[#D9DEE5] placeholder-[#8C96A3]/50",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6E36A]",
            "disabled:opacity-50",
          ].join(" ")}
        />
        <button
          type="button"
          disabled={loading || !isTokenReady || !input.trim()}
          onClick={() => void sendMessage()}
          className={[
            "px-5 py-3 text-[11px] font-mono uppercase tracking-widest",
            "bg-[#B6E36A] text-[#08090C] rounded-sm",
            "hover:bg-[#c8f27a] active:bg-[#a4d05a]",
            "transition-colors duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6E36A]",
          ].join(" ")}
          aria-label="Send message"
        >
          {loading ? "…" : "SEND"}
        </button>
      </div>

      <p className="text-[10px] font-mono text-[#8C96A3]/50">
        Responses are generated from verified content only. {personaName} speaks
        in third person. No fabricated data is ever surfaced.
      </p>
    </div>
  );
}
