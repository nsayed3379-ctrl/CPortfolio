"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE, FEATURES } from "@/lib/constants";

export default function Navbar({
  productCategories = [],
}: {
  productCategories?: { name: string; slug: string }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Merge Sanity-driven category links into the "Products" dropdown at
  // render time — constants.ts only defines "All Products" statically
  // (see its comment); everything else scales with however many
  // categories actually exist, not individual products.
  const visibleNavLinks = NAV_LINKS.filter((link) => {
    if (link.label === "Solutions") return FEATURES.solutions;
    if (link.label === "Products") return FEATURES.products;
    if (link.label === "Work") return FEATURES.work;
    return true;
  });
  const effectiveNavLinks = visibleNavLinks.map((link) =>
    link.label === "Products" && "dropdown" in link && link.dropdown
      ? {
        ...link,
        dropdown: [
          ...link.dropdown,
          ...productCategories.map((c) => ({
            label: c.name,
            href: `/products?category=${c.slug}`,
          })),
        ],
      }
      : link
  );

  // Close mobile menu on route change — derived during render, no effect needed.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-[var(--color-border)] bg-[var(--color-ink)]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container>
        <nav className="flex h-18 items-center justify-between py-4">
          <Link href="/" className="focus-ring flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight text-[var(--color-paper)]">
              {SITE.name.toUpperCase()}
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {effectiveNavLinks.map((link) => {
              const hasDropdown = "dropdown" in link && link.dropdown;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => hasDropdown && (cancelClose(), setOpenDropdown(link.label))}
                  onMouseLeave={() => hasDropdown && scheduleClose()}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "focus-ring flex items-center gap-1 rounded-full px-4 py-2 text-lg font-medium transition-colors",
                      isActive
                        ? "text-[var(--color-paper)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                    )}
                  >
                    {link.label}
                    {hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                  </Link>

                  {hasDropdown && openDropdown === link.label && (
                    <div
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                      className="absolute left-0 top-full z-20 min-w-[200px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-xl shadow-black/30"
                    >
                      {link.dropdown!.map((item) => (
                        <Link
                          key={`${link.label}-${item.href}`}
                          href={item.href}
                          className="focus-ring block rounded-lg px-3 py-2 text-base text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-paper)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <Button href="/get-a-quote" variant="primary" className="text-lg">
              Start a Project
            </Button>
          </div>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-paper)] lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </Container>

      {open && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-[var(--color-border)] bg-[var(--color-ink)] lg:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {effectiveNavLinks.map((link) => {
              const hasDropdown = "dropdown" in link && link.dropdown;
              const isGroupOpen = openMobileGroup === link.label;
              return (
                <div key={link.href}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className={cn(
                        "focus-ring flex-1 rounded-lg px-3 py-3 text-base font-medium",
                        pathname === link.href
                          ? "bg-[var(--color-surface-raised)] text-[var(--color-paper)]"
                          : "text-[var(--color-muted)]"
                      )}
                    >
                      {link.label}
                    </Link>
                    {hasDropdown && (
                      <button
                        aria-label={`Toggle ${link.label} submenu`}
                        onClick={() => setOpenMobileGroup(isGroupOpen ? null : link.label)}
                        className="focus-ring p-3 text-[var(--color-muted)]"
                      >
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isGroupOpen && "rotate-180")} />
                      </button>
                    )}
                  </div>
                  {hasDropdown && isGroupOpen && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-[var(--color-border)] pl-3">
                      {link.dropdown!.map((item) => (
                        <Link
                          key={`${link.label}-${item.href}`}
                          href={item.href}
                          className="focus-ring rounded-lg px-3 py-2 text-sm text-[var(--color-muted)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-3">
              <Button href="/get-a-quote" variant="primary" className="w-full text-base">
                Start a Project
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
