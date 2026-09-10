"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { TECH_STACK_GROUPS } from "@/lib/constants";
import { getTechIcon } from "@/lib/techIcons";
import { cn } from "@/lib/utils";

export default function TechnologySection({
  groups: groupsProp,
}: {
  groups?: { group: string; items: string[] }[];
}) {
  const groups = groupsProp && groupsProp.length > 0 ? groupsProp : TECH_STACK_GROUPS;
  const [active, setActive] = useState(groups[0]?.group);
  const activeGroup = groups.find((g) => g.group === active) ?? groups[0];

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          title="Engineered with tools built to last."
          className="mb-8 sm:mb-12"
        />

        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] sm:rounded-3xl">
          <div className="flex snap-x snap-mandatory overflow-x-auto bg-[var(--color-surface-raised)] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {groups.map((group) => {
              const isActive = group.group === activeGroup?.group;
              return (
                <button
                  key={group.group}
                  type="button"
                  onClick={() => setActive(group.group)}
                  aria-pressed={isActive}
                  className={cn(
                    "focus-ring relative shrink-0 snap-start whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors sm:px-6 sm:py-4 sm:text-xl",
                    isActive
                      ? "bg-[var(--color-surface)] text-[var(--color-electric)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-[var(--color-electric)]" />
                  )}
                  {group.group}
                </button>
              );
            })}
          </div>

          <div className="bg-[var(--color-surface)] p-5 sm:p-10">
            <div className="grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-10 md:grid-cols-5">
              {activeGroup?.items.map((item) => {
                const { Icon, color } = getTechIcon(item);
                return (
                  <div key={item} className="group flex flex-col items-center gap-2 text-center sm:gap-3">
                    <Icon
                      className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11"
                      style={{ color }}
                    />
                    <span className="text-[11px] font-medium leading-tight text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-paper)] sm:text-base">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
