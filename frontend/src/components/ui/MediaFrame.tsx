import { cn } from "@/lib/utils";
import type { MediaRef } from "@/lib/constants";
import NextImage from "next/image";
import { mediaUrl } from "@/sanity/image";

const TONES: Record<MediaRef["tone"], { bg: string; accent: string; accent2: string }> = {
  electric: { bg: "linear-gradient(160deg, #0c1230 0%, #141c46 55%, #1a2b6b 100%)", accent: "#2e5eff", accent2: "#22d3ee" },
  cyan: { bg: "linear-gradient(160deg, #06181c 0%, #0d2b31 55%, #0d3b45 100%)", accent: "#22d3ee", accent2: "#4d74ff" },
  violet: { bg: "linear-gradient(160deg, #130e28 0%, #1c1440 55%, #241a4a 100%)", accent: "#8b7bea", accent2: "#4d3aa8" },
  amber: { bg: "linear-gradient(160deg, #1c1408 0%, #2c1e0c 55%, #3a2a10 100%)", accent: "#f2b854", accent2: "#a8722e" },
  graphite: { bg: "linear-gradient(160deg, #0a0b0e 0%, #15161c 55%, #22242e 100%)", accent: "#8892a6", accent2: "#5c6272" },
};

// Deterministic pseudo-random from a string, so the same media label always
// renders the same composition (stable across server/client, no hydration
// mismatch) while different labels still look distinct from each other.
function seedFrom(label: string) {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return (n: number) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return h % n;
  };
}

function UIPattern({ media, tone }: { media: MediaFrameMedia; tone: { accent: string; accent2: string } }) {
  const rand = seedFrom(media.label);
  const bars = Array.from({ length: 5 }, () => 30 + rand(60));
  return (
    <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      {/* window chrome */}
      <rect x="16" y="16" width="368" height="228" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
      <rect x="16" y="16" width="368" height="30" rx="10" fill="rgba(255,255,255,0.05)" />
      <circle cx="32" cy="31" r="3.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="44" cy="31" r="3.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="56" cy="31" r="3.5" fill="rgba(255,255,255,0.25)" />
      {/* sidebar */}
      <rect x="16" y="46" width="72" height="198" fill="rgba(255,255,255,0.03)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="28" y={64 + i * 28} width="48" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
      ))}
      {/* content: chart bars */}
      <g transform="translate(104,150)">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={i * 44}
            y={-h}
            width="26"
            height={h}
            rx="4"
            fill={i % 2 === 0 ? tone.accent : tone.accent2}
            opacity={0.55 + (i % 3) * 0.12}
          />
        ))}
        <line x1="-8" y1="0" x2="268" y2="0" stroke="rgba(255,255,255,0.15)" />
      </g>
      {/* content: header line + cards */}
      <rect x="104" y="60" width="140" height="10" rx="5" fill="rgba(255,255,255,0.16)" />
      <rect x="104" y="78" width="90" height="7" rx="3.5" fill="rgba(255,255,255,0.08)" />
      <rect x="300" y="58" width="84" height="34" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" />
    </svg>
  );
}

function DiagramPattern({ media, tone }: { media: MediaFrameMedia; tone: { accent: string; accent2: string } }) {
  const rand = seedFrom(media.label);
  const nodes = [
    { x: 70, y: 60 },
    { x: 200, y: 40 },
    { x: 330, y: 70 },
    { x: 130, y: 160 },
    { x: 280, y: 190 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [3, 4],
    [2, 4],
  ];
  return (
    <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={i % 2 === 0 ? tone.accent : tone.accent2}
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="3 5"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={16 + rand(6)} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
          <circle cx={n.x} cy={n.y} r={4} fill={i % 2 === 0 ? tone.accent : tone.accent2} />
        </g>
      ))}
    </svg>
  );
}

function OrbsPattern({ media, tone }: { media: MediaFrameMedia; tone: { accent: string; accent2: string } }) {
  const rand = seedFrom(media.label);
  const cx1 = 20 + rand(30);
  const cy1 = 15 + rand(30);
  const cx2 = 55 + rand(35);
  const cy2 = 45 + rand(40);
  return (
    <div className="absolute inset-0">
      <div
        className="absolute h-[70%] w-[70%] rounded-full opacity-50 blur-3xl"
        style={{ background: tone.accent, left: `${cx1}%`, top: `${cy1}%`, transform: "translate(-50%,-50%)" }}
      />
      <div
        className="absolute h-[55%] w-[55%] rounded-full opacity-40 blur-3xl"
        style={{ background: tone.accent2, left: `${cx2}%`, top: `${cy2}%`, transform: "translate(-50%,-50%)" }}
      />
    </div>
  );
}

// Superset of the frontend's own `MediaRef` (from constants.ts, used by
// hardcoded content still awaiting full migration) plus the optional
// `imageUrl` field that only backend-sourced `mediaRef` records carry.
// Both call sites can pass through this one component without type friction.
type MediaFrameMedia = {
  tone: MediaRef["tone"];
  label: string;
  variant?: MediaRef["variant"];
  imageUrl?: string | null;
};

function hasUploadedAsset(imageUrl?: string | null): imageUrl is string {
  return Boolean(imageUrl);
}

export default function MediaFrame({
  media,
  className,
  children,
}: {
  media: MediaFrameMedia;
  className?: string;
  children?: React.ReactNode;
}) {
  const tone = TONES[media.tone];
  const variant = media.variant ?? "orbs";
  const useRealImage = hasUploadedAsset(media.imageUrl);

  return (
    <div
      role="img"
      aria-label={media.label}
      className={cn("relative overflow-hidden", className)}
      style={useRealImage ? undefined : { backgroundImage: tone.bg }}
    >
      {useRealImage ? (
        // Real photography, once uploaded through the admin panel — takes
        // over entirely from the generative placeholder for this item.
        <NextImage
          src={mediaUrl(media.imageUrl)!}
          alt={media.label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <>
          <div className="grid-field absolute inset-0 opacity-30" />
          {variant === "ui" && <UIPattern media={media} tone={tone} />}
          {variant === "diagram" && <DiagramPattern media={media} tone={tone} />}
          {variant === "orbs" && <OrbsPattern media={media} tone={tone} />}
        </>
      )}
      <div className="noise pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}
