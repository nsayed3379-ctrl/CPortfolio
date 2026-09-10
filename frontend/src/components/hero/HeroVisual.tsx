"use client";

// Wrapper that lazy-loads the WebGL 3D scene (HeroScene3D.tsx) on the
// client only — three.js/react-three-fiber need `window`/canvas, so this
// can't be server-rendered. The static SVG below is shown while the 3D
// bundle is loading (and stays if JS fails), so there's no blank flash.

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const HeroScene3D = dynamic(() => import("./HeroScene3D"), {
  ssr: false,
  loading: () => <HeroVisualFallback />,
});

// Only mount the WebGL scene (three.js ~ several hundred KB, plus a live
// rAF render loop) on desktop widths. On phones/tablets the lightweight
// inline-SVG diagram below is shown instead — visually equivalent for the
// hero's purpose, with none of the bundle or battery cost. `false` on the
// server matches HeroScene3D being ssr:false anyway, so no hydration jump.
const DESKTOP_QUERY = "(min-width: 1024px)";
function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

const NODES = [
  { key: "ai", label: "AI", x: 200, y: 40 },
  { key: "data", label: "DATA", x: 60, y: 160 },
  { key: "software", label: "SOFTWARE", x: 340, y: 160 },
  { key: "cloud", label: "CLOUD", x: 200, y: 280 },
];

function HeroVisualFallback() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center lg:max-w-lg">
      <svg
        viewBox="0 0 400 320"
        className="h-full w-full"
        role="img"
        aria-label="Diagram showing VecoSoft at the center of AI, Data, Software, and Cloud capabilities"
      >
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-electric-soft)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-electric-soft)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-electric-soft)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {NODES.map((node) => (
          <line
            key={node.key}
            x1={200}
            y1={160}
            x2={node.x}
            y2={node.y}
            stroke="url(#line-grad)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            className="animate-[dash_18s_linear_infinite]"
          />
        ))}

        <circle cx={200} cy={160} r={70} fill="url(#hub-glow)" />

        {NODES.map((node) => (
          <g key={node.key}>
            <circle
              cx={node.x}
              cy={node.y}
              r={26}
              fill="var(--color-surface)"
              stroke="var(--color-border-hover)"
              strokeWidth={1}
              className="animate-[pulse-node_4s_ease-in-out_infinite]"
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fontSize="9"
              fontWeight={600}
              letterSpacing="0.06em"
              fill="var(--color-paper)"
            >
              {node.label}
            </text>
          </g>
        ))}

        <circle cx={200} cy={160} r={40} fill="var(--color-ink)" stroke="var(--color-electric-soft)" strokeWidth={1.5} />
        <text
          x={200}
          y={158}
          textAnchor="middle"
          fontSize="9.5"
          fontWeight={700}
          letterSpacing="0.04em"
          fill="var(--color-cyan)"
        >
          VECOSOFT
        </text>
        <text x={200} y={170} textAnchor="middle" fontSize="7" fill="var(--color-muted)">
          engine
        </text>
      </svg>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -200; }
        }
        @keyframes pulse-node {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(46,94,255,0)); }
          50% { filter: drop-shadow(0 0 6px rgba(46,94,255,0.45)); }
        }
        @media (prefers-reduced-motion: reduce) {
          line, circle { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function HeroVisual() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <HeroScene3D /> : <HeroVisualFallback />;
}
