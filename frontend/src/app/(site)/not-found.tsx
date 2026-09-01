import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center">
      <Container className="text-center">
            <h1 className="mt-4 text-3xl font-medium tracking-tight text-[var(--color-paper)] sm:text-4xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
          The page you&apos;re looking for may have been moved or never existed.
          Head back home or explore what we offer.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/" variant="primary">Go Home</Button>
          <Button href="/contact" variant="secondary">Contact Us</Button>
        </div>
      </Container>
    </div>
  );
}
