import { cn } from "@/lib/utils";

export default function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}
