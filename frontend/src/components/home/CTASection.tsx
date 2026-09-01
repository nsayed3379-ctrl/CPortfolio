import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";

export default function CTASection() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-16 text-center sm:px-16">
          <div
            className="absolute -top-24 left-1/2 -z-0 h-64 w-[600px] -translate-x-1/2 rounded-full opacity-25 blur-[100px]"
            style={{ background: "radial-gradient(circle, var(--color-electric) 0%, transparent 70%)" }}
          />
          <div className="relative z-10">
            <TextReveal
              as="h2"
              text="Have a project in mind? Let's build it right."
              triggerOnView
              staggerMs={50}
              className="text-balance mx-auto max-w-2xl text-3xl font-medium tracking-tight text-[var(--color-paper)] sm:text-4xl"
            />
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--color-muted)]">
              Tell us what you&apos;re building. We&apos;ll respond within 24–48 hours with next steps.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href="/get-a-quote" variant="primary" showArrow>
                Get a Quote
              </Button>
              <Button href="/contact" variant="secondary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
