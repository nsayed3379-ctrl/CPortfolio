"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { applicationSchema, type ApplicationFormValues } from "@/lib/validations/application";
import { formInputClass, formLabelClass, formErrorClass } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { CheckCircle2, UploadCloud } from "lucide-react";

export default function ApplicationForm({ jobTitle, jobId }: { jobTitle: string; jobId?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  async function onSubmit(data: ApplicationFormValues) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // FormData, not JSON — the CV file has to travel as multipart data.
      const formData = new FormData();
      formData.append("jobTitle", jobTitle);
      if (jobId) formData.append("jobId", jobId);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data.linkedin) formData.append("linkedin", data.linkedin);
      if (data.portfolio) formData.append("portfolio", data.portfolio);
      formData.append("coverLetter", data.coverLetter);
      formData.append("consent", String(data.consent));
      formData.append("company_website", data.company_website ?? "");
      const cvFile = (data.cv as FileList)[0];
      formData.append("cv", cvFile);

      const res = await fetch("/api/applications", { method: "POST", body: formData });
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-[var(--color-cyan)]" />
        <h3 className="mt-4 text-lg font-medium text-[var(--color-paper)]">Application received</h3>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-muted)]">
          Thanks for applying for {jobTitle}. We review every application and will reach out within 24–48 hours if it&apos;s a fit.
        </p>
      </div>
    );
  }

  const inputClass = formInputClass;
  const labelClass = formLabelClass;
  const errorClass = formErrorClass;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Honeypot field — hidden from real users */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        {...register("company_website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input className={inputClass} placeholder="Jane Doe" {...register("fullName")} />
          {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input className={inputClass} placeholder="jane@email.com" {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} placeholder="+880 1XXXXXXXXX" {...register("phone")} />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelClass}>LinkedIn (optional)</label>
          <input className={inputClass} placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
          {errors.linkedin && <p className={errorClass}>{errors.linkedin.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>GitHub / Portfolio (optional)</label>
        <input className={inputClass} placeholder="https://github.com/..." {...register("portfolio")} />
        {errors.portfolio && <p className={errorClass}>{errors.portfolio.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Cover Letter</label>
        <textarea
          className={inputClass}
          rows={5}
          placeholder="Tell us why you're a good fit for this role..."
          {...register("coverLetter")}
        />
        {errors.coverLetter && <p className={errorClass}>{errors.coverLetter.message}</p>}
      </div>

      <div>
        <label className={labelClass}>CV (PDF, max 5MB)</label>
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
          <UploadCloud className="h-5 w-5 text-[var(--color-muted)]" />
          <input
            type="file"
            accept="application/pdf"
            className="focus-ring w-full text-sm text-[var(--color-muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-surface-raised)] file:px-4 file:py-1.5 file:text-xs file:text-[var(--color-paper)]"
            {...register("cv")}
          />
        </div>
        {errors.cv && <p className={errorClass}>{String(errors.cv.message)}</p>}
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-[var(--color-muted)]">
        <input type="checkbox" className="focus-ring mt-0.5" {...register("consent")} />
        I agree that VecoSoft may store my application data to evaluate this role. I can request
        deletion at any time by emailing hello@vecosoft.com.
      </label>
      {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

      <Button type="submit" variant="primary" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>
      {submitError && <p className={errorClass}>{submitError}</p>}
    </form>
  );
}
