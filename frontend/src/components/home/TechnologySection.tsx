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
    <section className="py-24">
      <Container>
        <SectionHeading
          title="Engineered with tools built to last."
          className="mb-12"
        />

        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <div className="flex flex-wrap justify-center bg-[var(--color-surface-raised)]">
            {groups.map((group) => {
              const isActive = group.group === activeGroup?.group;
              return (
                <button
                  key={group.group}
                  type="button"
                  onClick={() => setActive(group.group)}
                  aria-pressed={isActive}
                  className={cn(
                    "focus-ring relative px-5 py-4 text-lg font-medium transition-colors sm:px-6 sm:text-xl",
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

          <div className="bg-[var(--color-surface)] p-8 sm:p-10">
            <div className="flex flex-wrap justify-evenly gap-y-10">
              {activeGroup?.items.map((item) => {
                const { Icon, color } = getTechIcon(item);
                return (
                  <div key={item} className="group flex w-32 flex-col items-center gap-3 text-center">
                    <Icon
                      className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ color }}
                    />
                    <span className="text-lg font-medium text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-paper)]">
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
