import { NextResponse } from "next/server";
import { z } from "zod";
import { API_URL } from "@/sanity/env";
import { checkRateLimit, getRequestIp } from "@/lib/rateLimit";

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB — must match the client-side limit in ApplicationForm.tsx

// Text-field validation only — the CV file itself is validated separately
// below, since FormData delivers it as a File object, not something a
// plain Zod schema shape naturally describes alongside the other fields.
const payloadSchema = z.object({
  jobTitle: z.string().min(1),
  jobId: z.string().optional(), // the backend's numeric job id, only present for real (non-fallback) job listings
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  linkedin: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().min(20),
  consent: z.literal("true"), // FormData values are always strings
  company_website: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  // Stricter window than contact/inquiry — a genuine applicant only
  // submits once; repeated rapid submissions are almost always abuse.
  const ip = getRequestIp(request);
  if (!checkRateLimit(`applications:${ip}`, 3, 10 * 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const rawFields = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => key !== "cv")
  );
  const parsed = payloadSchema.safeParse(rawFields);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 }
    );
  }

  // Honeypot — same fake-success handling as the other two routes.
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  // Re-validate the CV server-side. The client already restricts the file
  // picker to PDF and checks the 5MB limit, but that's trivially bypassed
  // by anyone calling this endpoint directly.
  const cv = formData.get("cv");
  if (!(cv instanceof File)) {
    return NextResponse.json({ ok: false, error: "Please attach your CV." }, { status: 400 });
  }
  if (cv.type !== "application/pdf") {
    return NextResponse.json({ ok: false, error: "CV must be a PDF file." }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ ok: false, error: "CV must be under 5MB." }, { status: 400 });
  }

  try {
    const forward = new FormData();
    forward.set("jobTitle", parsed.data.jobTitle);
    if (parsed.data.jobId) forward.set("jobId", parsed.data.jobId);
    forward.set("fullName", parsed.data.fullName);
    forward.set("email", parsed.data.email);
    forward.set("phone", parsed.data.phone);
    if (parsed.data.linkedin) forward.set("linkedin", parsed.data.linkedin);
    if (parsed.data.portfolio) forward.set("portfolio", parsed.data.portfolio);
    forward.set("coverLetter", parsed.data.coverLetter);
    forward.set("consent", "true");
    forward.set("cv", cv, cv.name);

    const res = await fetch(`${API_URL}/api/applications`, { method: "POST", body: forward });
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
  } catch (error) {
    console.error("[/api/applications] backend write failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
