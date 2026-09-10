import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center sm:px-16 sm:py-16">
          <div
            className="absolute -top-24 left-1/2 -z-0 h-64 w-[min(600px,120vw)] -translate-x-1/2 rounded-full opacity-25 blur-[100px]"
            style={{ background: "radial-gradient(circle, var(--color-electric) 0%, transparent 70%)" }}
          />
          <div className="relative z-10">
            <TextReveal
              as="h2"
              text="Have a project in mind? Let's build it right."
              triggerOnView
              staggerMs={50}
              className="text-fluid-h2 text-balance mx-auto max-w-2xl font-medium text-[var(--color-paper)]"
            />
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--color-muted)]">
              Tell us what you&apos;re building. We&apos;ll respond within 24–48 hours with next steps.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Button href="/get-a-quote" variant="primary" showArrow className="w-full sm:w-auto">
                Get a Quote
              </Button>
              <Button href="/contact" variant="secondary" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
