import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import QuoteForm from "@/components/contact/QuoteForm";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Tell us about your project and get a response from VecoSoft within 24-48 hours.",
};

export default function GetAQuotePage() {
  return (
    <section className="py-24">
      <Container className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
            <h1 className="mt-4 max-w-md text-4xl font-medium tracking-tight text-[var(--color-paper)] sm:text-5xl">
            Tell us what you&apos;re building.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-[var(--color-muted)]">
            The more detail you share, the more useful our first response will be.
            We reply within 24–48 hours with next steps — no automated sales calls.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <QuoteForm />
        </div>
      </Container>
    </section>
  );
}
