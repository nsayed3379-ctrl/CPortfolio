"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";
import { formInputClass, formLabelClass, formErrorClass } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactFormValues) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
      reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = formInputClass;
  const labelClass = formLabelClass;
  const errorClass = formErrorClass;

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-[var(--color-cyan)]" />
        <h3 className="mt-4 text-lg font-medium text-[var(--color-paper)]">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-muted)]">
          Thanks for reaching out. We reply to every message within 24–48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company_website")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input className={inputClass} placeholder="Your name" {...register("name")} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input className={inputClass} placeholder="you@email.com" {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Company (optional)</label>
        <input className={inputClass} placeholder="Company name" {...register("company")} />
      </div>

      <div>
        <label className={labelClass}>Subject</label>
        <input className={inputClass} placeholder="What's this about?" {...register("subject")} />
        {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Message</label>
        <textarea className={inputClass} rows={5} placeholder="Tell us a bit about your project..." {...register("message")} />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <Button type="submit" variant="primary" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending..." : "Send Message"}
      </Button>
      {submitError && <p className={errorClass}>{submitError}</p>}
    </form>
  );
}
