import { cn } from "@/lib/utils";
import { STATUS_LABEL, type Status } from "@/lib/constants";

const DOT_COLOR: Record<Status, string> = {
  live: "bg-emerald-400",
  "in-development": "bg-[var(--color-cyan)]",
  prototype: "bg-[var(--color-electric-soft)]",
  concept: "bg-[var(--color-muted-2)]",
  research: "bg-amber-400",
};

export default function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-ink)]/60 px-2.5 py-1 text-sm font-medium text-[var(--color-paper)] backdrop-blur-sm",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_COLOR[status])} />
      {STATUS_LABEL[status]}
    </span>
  );
}
