"use client";

import { Turnstile } from "@marsidev/react-turnstile";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function TurnstileWidget({ onVerify, onExpire }: TurnstileWidgetProps) {
  // If no site key configured (dev/local), auto-pass with a sentinel token
  if (!SITE_KEY) {
    return (
      <div
        className="flex items-center gap-2 text-[11px] font-mono text-[#8C96A3] border border-[#252C35] rounded-sm px-3 py-2"
        role="status"
      >
        <span className="inline-block w-2 h-2 rounded-full bg-[#B6E36A]" />
        TURNSTILE BYPASSED — CONFIGURE NEXT_PUBLIC_TURNSTILE_SITE_KEY
      </div>
    );
  }

  return (
    <Turnstile
      siteKey={SITE_KEY}
      onSuccess={onVerify}
      onExpire={onExpire}
      options={{
        theme: "dark",
        size: "normal",
      }}
    />
  );
}
