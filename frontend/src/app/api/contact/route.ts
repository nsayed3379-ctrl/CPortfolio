import { NextResponse } from "next/server";
import { z } from "zod";
import { API_URL } from "@/sanity/env";
import { checkRateLimit, getRequestIp } from "@/lib/rateLimit";

// Server-side re-validation. Deliberately NOT importing the client-side
// `contactSchema` from src/lib/validations/contact.ts, even though the
// shape overlaps — that schema's honeypot field
// (`company_website: z.string().max(0)`) would make the whole parse fail
// on a bot submission, which we instead want to catch explicitly and
// respond to with a fake success (see below) rather than a validation
// error that tips the bot off. Keeping a separate, focused server schema
// avoids that coupling.
const payloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
  company_website: z.string().optional(), // honeypot — checked separately below
});

export async function POST(request: Request) {
  // Rate limit: 5 submissions per minute per IP. See src/lib/rateLimit.ts
  // for why this is in-memory (fine for now) rather than Upstash (later).
  const ip = getRequestIp(request);
  if (!checkRateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 }
    );
  }

  // Honeypot: a real visitor never fills this hidden field. Respond as if
  // it succeeded — anything else (a 4xx, a different message) teaches a
  // bot which field to leave empty next time.
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || undefined,
        subject: parsed.data.subject,
        message: parsed.data.message,
      }),
    });
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
  } catch (error) {
    console.error("[/api/contact] backend write failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
