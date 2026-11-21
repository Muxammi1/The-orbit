"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { TurnstileWidget } from "./TurnstileWidget";
import type { TwinVisualState } from "@/scenes/avatar/AvatarScene";

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
  onStateChange?: (state: TwinVisualState) => void;
}

function matchFallback(
  prompt: string,
  fallbackData: FallbackData,
): FallbackAnswer {
  const lower = prompt.toLowerCase();
  const keyMap: Record<string, string[]> = {
    q1: ["focus", "core", "engineering focus", "system"],
    q2: ["architecture", "approach", "ai systems", "pipeline"],
    q3: ["research", "exploring", "questions", "inquiries"],
    q4: ["individuality", "combine", "philosophy", "personal"],
    q5: ["ambitious", "project", "greenlink", "most ambitious"],
    q6: ["hardware", "constraint", "constraints", "telemetry", "power", "ram", "mcu", "embedded"],
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
  onStateChange,
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
    onStateChange?.("listening");
    inputRef.current?.focus();
  }, [onStateChange]);

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
    onStateChange?.("thinking");

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
    if (!siteKey || !token) {
      const fallback = matchFallback(prompt, fallbackData);
      setTimeout(() => {
        onStateChange?.("speaking");
        appendTwinMessage({
          role: "twin",
          content: fallback.answer,
          sources: fallback.sources,
        });
        setLoading(false);
        setTimeout(() => {
          onStateChange?.("idle");
        }, 1200);
      }, 500);
      return;
    }

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
        onStateChange?.("speaking");
        updateLastTwinMessage(() => ({
          role: "twin",
          content: fallback.answer,
          sources: fallback.sources,
          streaming: false,
        }));
        setLoading(false);
        setTimeout(() => onStateChange?.("idle"), 1200);
        return;
      }

      onStateChange?.("speaking");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
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
              // ignore parse errors
            }
          }
        }
      }

      updateLastTwinMessage((prev) => ({ ...prev, streaming: false }));
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const fallback = matchFallback(prompt, fallbackData);
      onStateChange?.("speaking");
      updateLastTwinMessage(() => ({
        role: "twin",
        content: fallback.answer,
        sources: fallback.sources,
        streaming: false,
      }));
    } finally {
      setLoading(false);
      setTimeout(() => onStateChange?.("idle"), 1500);
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
    <div className="flex flex-col gap-5">
      {/* Console Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#252C35] text-[10px] font-mono text-[#8C96A3]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B6E36A] shadow-[0_0_6px_#B6E36A]" />
          <span className="text-[#D9DEE5] font-semibold">CONSOLE // ORBIT-CORE</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LATENCY: 24MS</span>
          <span className="text-[#252C35]">•</span>
          <span>CONFIDENCE: 99.4%</span>
        </div>
      </div>

      {/* Suggested Quick Command Chips */}
      {!hasSentFirst && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8C96A3]">
            [ INITIALIZE COMMAND QUERY ]
          </p>
          <SuggestedQuestions
            questions={questions}
            onSelect={setQuestion}
            disabled={loading}
          />
        </div>
      )}

      {/* Terminal Output Log */}
      {messages.length > 0 && (
        <div
          className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin font-mono text-xs"
          role="log"
          aria-label="Conversation with the Digital Twin"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#8C96A3]">
                <span className={msg.role === "user" ? "text-[#D9DEE5]" : "text-[#B6E36A]"}>
                  {msg.role === "user" ? "user@orbit:~$ query" : `${personaName.toLowerCase()}-core:~$ transmission`}
                </span>
              </div>
              <div
                className={[
                  "max-w-[90%] rounded-sm px-4 py-3 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#171B22] border border-[#252C35] text-[#D9DEE5]"
                    : "bg-[#0E1117] border border-[#B6E36A]/30 text-[#D9DEE5] shadow-[0_0_15px_rgba(182,227,106,0.05)]",
                ].join(" ")}
              >
                {msg.content || (msg.streaming ? "…" : "")}
                {msg.streaming && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-[#B6E36A] animate-pulse align-middle" />
                )}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {msg.sources.map((src, si) => (
                    <span
                      key={si}
                      className="text-[9px] font-mono text-[#8C96A3]/70 px-1.5 py-0.5 rounded bg-[#171B22] border border-[#252C35]"
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

      {/* Turnstile */}
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

      {/* Terminal Input Prompt */}
      <div className="relative flex gap-2 items-center bg-[#08090C] border border-[#252C35] focus-within:border-[#B6E36A] rounded-sm p-1.5 transition-colors">
        <span className="font-mono text-xs text-[#B6E36A] pl-2 select-none">
          orbit:~$
        </span>
        <textarea
          id="twin-input"
          ref={inputRef}
          rows={1}
          value={input}
          onFocus={() => onStateChange?.("listening")}
          onBlur={() => {
            if (!loading) onStateChange?.("idle");
          }}
          onChange={(e) => {
            setInput(e.target.value);
            onStateChange?.("listening");
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Ask anything about Muzammil's systems, research, or philosophy..."
          className="flex-1 resize-none bg-transparent border-0 px-2 py-1.5 text-xs font-mono text-[#D9DEE5] placeholder-[#8C96A3]/50 focus:outline-none"
        />
        <button
          type="button"
          disabled={loading || !isTokenReady || !input.trim()}
          onClick={() => void sendMessage()}
          className="px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider bg-[#B6E36A] text-[#08090C] rounded-sm font-semibold hover:bg-[#cbf489] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Execute prompt"
        >
          {loading ? "PROCESSING" : "EXECUTE"}
        </button>
      </div>

      <div className="flex items-center justify-between text-[9px] font-mono text-[#8C96A3]/60">
        <span>CONSTRAINED KNOWLEDGE ENGINE • VERIFIED RESPONSES ONLY</span>
        <span>PRESS ENTER ↵</span>
      </div>
    </div>
  );
}
