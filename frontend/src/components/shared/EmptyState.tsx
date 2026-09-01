import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

// The same honest-empty pattern originally built for /work (never showing
// fabricated placeholder content) — now shared by every list page, since
// Phase 3.2 means any of them can legitimately be empty on a fresh Sanity
// dataset until content is published through the Studio.
export default function EmptyState({
  message,
  ctaLabel = "Start a Project",
  ctaHref = "/get-a-quote",
  showCta = true,
}: {
  message: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  showCta?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-16 text-center">
      <p className="mx-auto max-w-md text-base leading-relaxed text-[var(--color-muted)]">
        {message}
      </p>
      {showCta && (
        <div className="mt-8 flex justify-center">
          <Button href={ctaHref} variant="secondary">
            {ctaLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

// Convenience wrapper so pages don't repeat the outer <Container>/<div>.
export function EmptyStateSection({
  message,
  ctaLabel,
  ctaHref,
  showCta,
}: {
  message: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  showCta?: boolean;
}) {
  return (
    <Container>
      <EmptyState message={message} ctaLabel={ctaLabel} ctaHref={ctaHref} showCta={showCta} />
    </Container>
  );
}