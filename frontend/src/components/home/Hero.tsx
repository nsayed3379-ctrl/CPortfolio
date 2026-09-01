import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import HeroVisual from "@/components/hero/HeroVisual";
import { SITE } from "@/lib/constants";

export default function Hero({ tagline }: { tagline?: string }) {
  const headline = tagline || SITE.tagline;
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24">
      <div className="grid-field absolute inset-0 -z-10" />
      <div
        className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-electric) 0%, transparent 70%)" }}
      />

      <Container className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <TextReveal
            as="h1"
            text={headline}
            staggerMs={70}
            startDelay={100}
            className="text-balance text-4xl font-medium tracking-tight text-[var(--color-paper)] sm:text-5xl lg:text-6xl"
          />

          <p className="mt-6 max-w-lg text-balance text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            Modern software, intelligent automation, and digital platforms crafted with technical precision.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/get-a-quote" variant="primary" showArrow>
              Start a Project
            </Button>
            <Button href="/services" variant="secondary">
              Services
            </Button>
          </div>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
