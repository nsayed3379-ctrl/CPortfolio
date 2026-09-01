import Container from "@/components/ui/Container";
import { CAPABILITIES } from "@/lib/constants";

export default function CapabilitySignal({ capabilities }: { capabilities?: string[] }) {
  const source = capabilities && capabilities.length > 0 ? capabilities : CAPABILITIES;
  const items = [...source, ...source];
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-6">
      <Container>
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10">
            {items.map((cap, i) => (
              <span
                key={`${cap}-${i}`}
                className="eyebrow flex items-center gap-10 whitespace-nowrap text-sm font-medium text-[var(--color-muted-2)]"
              >
                {cap.toUpperCase()}
                <span className="text-[var(--color-electric-soft)]">/</span>
              </span>
            ))}
          </div>
        </div>
      </Container>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[marquee_32s_linear_infinite\\] { animation: none; }
        }
      `}</style>
    </section>
  );
}
