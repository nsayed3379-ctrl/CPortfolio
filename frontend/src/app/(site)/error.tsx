"use client";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] items-center">
      <Container className="text-center">
            <h1 className="mt-4 text-3xl font-medium tracking-tight text-[var(--color-paper)] sm:text-4xl">
          Something went wrong.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
          An unexpected error occurred while loading this page. You can try again,
          or return home.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={reset} variant="primary">Try Again</Button>
          <Button href="/" variant="secondary">Go Home</Button>
        </div>
      </Container>
    </div>
  );
}
