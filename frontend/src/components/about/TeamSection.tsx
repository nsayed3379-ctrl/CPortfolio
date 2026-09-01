"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import MediaFrame from "@/components/ui/MediaFrame";
import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { TeamMemberDoc } from "@/sanity/types";

const TONES: Array<"electric" | "cyan" | "violet"> = ["electric", "cyan", "violet"];

function TeamRow({ member, index }: { member: TeamMemberDoc; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const reversed = index % 2 === 1;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 items-center gap-10 py-14 first:pt-0 last:pb-0 sm:gap-14 lg:grid-cols-2",
        "border-b border-[var(--color-border)] last:border-b-0"
      )}
    >
      <div
        className={cn(
          "transition-all duration-[900ms] ease-out motion-reduce:transition-none",
          reversed && "lg:order-2",
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        <MediaFrame
          media={{
            tone: TONES[index % TONES.length],
            label: member.name,
            variant: "orbs",
            imageUrl: member.photoUrl,
          }}
          className="aspect-[4/5] w-full rounded-3xl border border-[var(--color-border)] transition-transform duration-500 ease-out hover:scale-[1.015]"
        />
      </div>

      <div
        className={cn(
          "transition-all duration-[900ms] ease-out motion-reduce:transition-none",
          reversed && "lg:order-1",
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
        style={{ transitionDelay: visible ? "150ms" : "0ms" }}
      >
        <span className="text-xs font-medium text-[var(--color-electric-soft)]" style={{ fontFamily: "var(--font-mono)" }}>
          {member.role}
        </span>
        <h3 className="mt-2 text-2xl font-medium tracking-tight text-[var(--color-paper)] sm:text-3xl">
          {member.name}
        </h3>
        <TextReveal
          as="p"
          text={member.quote}
          triggerOnView
          staggerMs={12}
          className="mt-5 max-w-lg text-base leading-relaxed text-[var(--color-muted)]"
        />
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="focus-ring mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-electric-soft)] hover:text-[var(--color-electric-soft)]"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function TeamSection({ members }: { members: TeamMemberDoc[] }) {
  if (members.length === 0) return null;
  return (
    <section className="border-b border-[var(--color-border)] py-20">
      <Container>
        <SectionHeading title="The people behind VecoSoft." className="mb-12" />
        <div>
          {members.map((member, i) => (
            <TeamRow key={member._id} member={member} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
