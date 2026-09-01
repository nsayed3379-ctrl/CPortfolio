import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  showArrow?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  children,
  href,
  variant = "primary",
  className,
  showArrow = false,
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const styles = cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200",
    "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
    variant === "primary" &&
      "bg-[var(--color-electric)] text-white hover:bg-[var(--color-electric-soft)] shadow-[0_0_0_0_rgba(46,94,255,0.4)] hover:shadow-[0_0_24px_2px_rgba(46,94,255,0.35)]",
    variant === "secondary" &&
      "border border-[var(--color-border)] text-[var(--color-paper)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-raised)]",
    variant === "ghost" &&
      "text-[var(--color-paper)] hover:text-[var(--color-cyan)]",
    className
  );

  const content = (
    <>
      {children}
      {showArrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(styles, "group")}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cn(styles, "group")}>
      {content}
    </button>
  );
}
