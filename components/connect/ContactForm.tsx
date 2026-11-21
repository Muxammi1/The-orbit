"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TurnstileWidget } from "@/components/twin/TurnstileWidget";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  reason: string;
  message: string;
}

interface ContactFormProps {
  reasons: string[];
}

export function ContactForm({ reasons }: ContactFormProps) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      reason: reasons[0] ?? "General Inquiry",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          token: turnstileToken ?? "",
        }),
      });

      const json = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to transmit message. Please try again or reach out directly by email.");
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-[#B6E36A]/30 rounded-sm p-8 bg-[#0E1117] space-y-4"
      >
        <div className="flex items-center gap-3 text-[#B6E36A]">
          <CheckCircle2 className="h-6 w-6" />
          <h3 className="text-lg font-medium text-[#D9DEE5]">
            Message Received
          </h3>
        </div>
        <p className="text-sm text-[#8C96A3] leading-relaxed">
          Your transmission has been queued. Muzammil will review and respond directly to your provided email address.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-xs font-mono uppercase tracking-wider text-[#B6E36A] hover:underline"
        >
          Send another transmission →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 border border-[#252C35] rounded-sm p-6 sm:p-8 bg-[#0E1117]/60"
      noValidate
    >
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-[#D9DEE5]">
          Direct Transmission
        </h3>
        <p className="text-xs text-[#8C96A3]">
          Fill in the parameters below. Messages are delivered securely to Muzammil&rsquo;s inbox.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-2 p-3 text-xs font-mono text-red-400 border border-red-500/30 rounded-sm bg-red-950/20"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="block text-xs font-mono uppercase tracking-wider text-[#8C96A3]"
        >
          Name <span className="text-[#B6E36A]">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
          })}
          className="w-full bg-[#171B22] border border-[#252C35] rounded-sm px-3.5 py-2.5 text-sm text-[#D9DEE5] focus-visible:outline-2 focus-visible:outline-[#B6E36A] transition-colors"
          placeholder="Your full name or organization"
        />
        {errors.name && (
          <p className="text-xs font-mono text-red-400 mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-mono uppercase tracking-wider text-[#8C96A3]"
        >
          Email <span className="text-[#B6E36A]">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full bg-[#171B22] border border-[#252C35] rounded-sm px-3.5 py-2.5 text-sm text-[#D9DEE5] focus-visible:outline-2 focus-visible:outline-[#B6E36A] transition-colors"
          placeholder="your.email@domain.com"
        />
        {errors.email && (
          <p className="text-xs font-mono text-red-400 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Reason */}
      <div className="space-y-1.5">
        <label
          htmlFor="reason"
          className="block text-xs font-mono uppercase tracking-wider text-[#8C96A3]"
        >
          Inquiry Type
        </label>
        <select
          id="reason"
          {...register("reason")}
          className="w-full bg-[#171B22] border border-[#252C35] rounded-sm px-3.5 py-2.5 text-sm text-[#D9DEE5] focus-visible:outline-2 focus-visible:outline-[#B6E36A] transition-colors"
        >
          {reasons.map((r) => (
            <option key={r} value={r} className="bg-[#171B22] text-[#D9DEE5]">
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="block text-xs font-mono uppercase tracking-wider text-[#8C96A3]"
        >
          Message <span className="text-[#B6E36A]">*</span>
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message", {
            required: "Message is required",
            minLength: { value: 10, message: "Minimum 10 characters" },
          })}
          className="w-full bg-[#171B22] border border-[#252C35] rounded-sm px-3.5 py-2.5 text-sm text-[#D9DEE5] focus-visible:outline-2 focus-visible:outline-[#B6E36A] transition-colors resize-none"
          placeholder="Briefly describe your question, project, or context…"
        />
        {errors.message && (
          <p className="text-xs font-mono text-red-400 mt-1">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Turnstile verification */}
      <div>
        <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={[
          "w-full py-3.5 px-6 rounded-sm font-mono text-xs uppercase tracking-widest",
          "bg-[#B6E36A] text-[#08090C] font-semibold",
          "hover:bg-[#a5d655] active:bg-[#92bf47] transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6E36A]",
        ].join(" ")}
      >
        {isSubmitting ? "Transmitting..." : "Send Transmission →"}
      </button>
    </form>
  );
}
