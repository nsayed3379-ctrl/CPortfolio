import { Code2, BrainCircuit, Smartphone, PenTool, Cloud, Settings2 } from "lucide-react";

const ICONS = [Code2, BrainCircuit, Smartphone, PenTool, Cloud, Settings2];

export default function ServicesHeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-gradient-to-br from-[#eef2ff] to-[#e7fbff]">
        <div className="grid-field absolute inset-0 opacity-40" />
        <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-[var(--color-electric)]/15 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[var(--color-cyan)]/15 blur-3xl" />
      </div>

      <div className="relative grid h-full grid-cols-3 place-items-center gap-4 p-10 sm:p-12">
        {ICONS.map((Icon, i) => (
          <div
            key={i}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-electric)] shadow-md sm:h-16 sm:w-16"
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
        ))}
      </div>
    </div>
  );
}
