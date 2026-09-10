import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import HeroVisual from "@/components/hero/HeroVisual";
import { SITE } from "@/lib/constants";

export default function Hero({ tagline }: { tagline?: string }) {
  const headline = tagline || SITE.tagline;
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
      <div className="grid-field absolute inset-0 -z-10" />
      <div
        className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[min(820px,140vw)] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-electric) 0%, transparent 70%)" }}
      />

      <Container className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <TextReveal
            as="h1"
            text={headline}
            staggerMs={70}
            startDelay={100}
            className="text-fluid-hero text-balance font-medium text-[var(--color-paper)]"
          />

          <p className="mt-5 max-w-lg text-balance text-base leading-relaxed text-[var(--color-muted)] sm:mt-6 sm:text-lg">
            Modern software, intelligent automation, and digital platforms crafted with technical precision.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Button href="/get-a-quote" variant="primary" showArrow className="w-full sm:w-auto">
              Start a Project
            </Button>
            <Button href="/services" variant="secondary" className="w-full sm:w-auto">
              Services
            </Button>
          </div>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
