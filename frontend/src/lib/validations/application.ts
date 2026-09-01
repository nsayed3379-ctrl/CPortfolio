import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  coverLetter: z.string().min(20, "Tell us a little about why you're a fit (min 20 characters)"),
  cv: z
    .any()
    .refine((files) => files?.length === 1, "Please attach your CV")
    .refine(
      (files) => files?.[0]?.type === "application/pdf",
      "CV must be a PDF file"
    )
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, "CV must be under 5MB"),
  consent: z.literal(true, {
    error: "Please confirm you agree to our data handling",
  }),
  // honeypot field — should always stay empty
  company_website: z.string().max(0).optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
