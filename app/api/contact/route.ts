import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/lib/env";

interface ContactRequestBody {
  name: string;
  email: string;
  reason: string;
  message: string;
  token?: string;
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
    }
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ContactRequestBody>;

    const { name, email, reason, message, token } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Verify Turnstile
    const isHuman = await verifyTurnstile(token ?? "");
    if (!isHuman) {
      return NextResponse.json(
        { error: "Security challenge verification failed." },
        { status: 403 }
      );
    }

    // Email dispatch via Resend
    const resendApiKey = env.RESEND_API_KEY;
    const recipient = env.CONTACT_EMAIL_TO ?? "contact@example.com";

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "ORBIT Transmission <onboarding@resend.dev>",
        to: recipient,
        subject: `[ORBIT Transmission: ${reason ?? "General"}] from ${name}`,
        replyTo: email,
        text: `Name: ${name}\nEmail: ${email}\nInquiry Reason: ${reason}\n\nMessage:\n${message}`,
      });
      return NextResponse.json({ success: true, delivered: true });
    }

    // Development / Local Mock Delivery
    return NextResponse.json({
      success: true,
      mocked: true,
      note: "Message processed successfully (mocked mode: configure RESEND_API_KEY for live delivery).",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal transmission failure. Please reach out directly." },
      { status: 500 }
    );
  }
}
