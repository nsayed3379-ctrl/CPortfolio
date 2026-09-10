import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import CommitmentStrip from "@/components/shared/CommitmentStrip";
import { getSiteSettings } from "@/sanity/siteSettings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with VecoSoft. We reply to every message within 24-48 hours.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h1 className="text-fluid-hero mt-4 max-w-md font-medium text-[var(--color-paper)]">
              Let&apos;s build something great.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-[var(--color-muted)]">
              Whether you have a fully scoped project or just an early idea, we&apos;d like to hear about it.
            </p>
            <div className="mt-12">
              <ContactInfo />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <ContactForm />
          </div>
        </Container>
      </section>

      <CommitmentStrip commitments={settings?.commitments} />
    </div>
  );
}
