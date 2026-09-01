"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const HoverContext = createContext<{
  hovered: string | null;
  setHovered: (slug: string | null) => void;
}>({ hovered: null, setHovered: () => {} });

export function useShowcaseHover() {
  return useContext(HoverContext);
}

export default function ShowcaseGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <HoverContext.Provider value={{ hovered, setHovered }}>
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
          "auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]",
          className
        )}
        onMouseLeave={() => setHovered(null)}
      >
        {children}
      </div>
    </HoverContext.Provider>
  );
}

export const SIZE_CLASS: Record<"wide" | "tall" | "large" | "standard", string> = {
  standard: "col-span-2 sm:col-span-1 row-span-1",
  wide: "col-span-2 row-span-1",
  tall: "col-span-2 sm:col-span-1 row-span-2",
  large: "col-span-2 row-span-2",
};
