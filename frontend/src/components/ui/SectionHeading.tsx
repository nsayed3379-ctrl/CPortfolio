import { cn } from "@/lib/utils";

export default function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: {
  // `eyebrow` intentionally removed from rendering — the small "// LABEL"
  // tags above every heading were dropped site-wide per a design
  // decision. The prop itself stays accepted (and ignored) below so every
  // existing call site across the codebase keeps compiling without
  // needing to be edited one-by-one.
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <h2 className="text-fluid-h2 text-balance font-medium text-[var(--color-paper)]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-[var(--color-muted)] sm:mt-4">
          {description}
        </p>
      )}
    </div>
  );
}
