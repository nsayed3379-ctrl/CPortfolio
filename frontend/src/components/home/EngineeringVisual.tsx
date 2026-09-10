// One fixed, hand-built illustration for the "What we do" carousel's side
// panel — a small team collaborating around a shared board, drawn as flat
// geometric figures on a deep navy panel in the site's electric/cyan
// palette. Pure SVG + CSS: no state, no image request, no library. The
// board and accents drift slowly; motion stops under prefers-reduced-motion.
export default function EngineeringVisual() {
  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden sm:min-h-[320px] lg:min-h-[460px]">
      <svg
        viewBox="0 0 640 520"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label="Illustration of a small team collaborating around a shared board"
      >
        <defs>
          <linearGradient id="ev-panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b1533" />
            <stop offset="55%" stopColor="#0a1024" />
            <stop offset="100%" stopColor="#05070f" />
          </linearGradient>
          <linearGradient id="ev-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <radialGradient id="ev-glow-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2e5eff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2e5eff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ev-glow-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <pattern id="ev-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#ffffff" fillOpacity="0.05" />
          </pattern>
        </defs>

        {/* panel + ambient */}
        <rect width="640" height="520" fill="url(#ev-panel)" />
        <rect width="640" height="520" fill="url(#ev-dots)" />
        <circle cx="130" cy="90" r="230" fill="url(#ev-glow-a)" />
        <circle cx="560" cy="470" r="250" fill="url(#ev-glow-b)" />

        {/* collaboration ring behind the group */}
        <circle
          cx="320"
          cy="300"
          r="210"
          fill="none"
          stroke="#3f6bff"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeDasharray="2 9"
          className="ev-drift"
        />

        {/* dashed links between the three heads — the "connected team" motif */}
        <g stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" className="ev-drift">
          <line x1="150" y1="196" x2="410" y2="150" />
          <line x1="410" y1="150" x2="512" y2="205" />
          <line x1="150" y1="196" x2="512" y2="205" />
        </g>
        {[
          [150, 196],
          [410, 150],
          [512, 205],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="#22d3ee" className="ev-drift" />
        ))}

        {/* shared board */}
        <g className="ev-float">
          <rect x="236" y="196" width="222" height="150" rx="14" fill="#0c1226" stroke="#ffffff" strokeOpacity="0.14" />
          <rect x="236" y="196" width="222" height="150" rx="14" fill="url(#ev-glass)" />
          <circle cx="252" cy="212" r="3.5" fill="#ffffff" fillOpacity="0.25" />
          <circle cx="264" cy="212" r="3.5" fill="#ffffff" fillOpacity="0.25" />
          <circle cx="276" cy="212" r="3.5" fill="#ffffff" fillOpacity="0.25" />
          {/* checklist rows */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(256 ${244 + i * 30})`}>
              <rect width="16" height="16" rx="5" fill="none" stroke="#22d3ee" strokeOpacity="0.7" />
              <path d="M4 8 l3.5 3.5 l6 -7" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="28" y="4" width={i === 1 ? 120 : 150} height="8" rx="4" fill="#ffffff" fillOpacity={i === 2 ? 0.1 : 0.18} />
            </g>
          ))}
          {/* progress bar */}
          <rect x="256" y="320" width="182" height="8" rx="4" fill="#ffffff" fillOpacity="0.08" />
          <rect x="256" y="320" width="120" height="8" rx="4" fill="#2e5eff" />
        </g>

        {/* speech bubble from the presenter */}
        <g className="ev-float-slow">
          <rect x="120" y="120" width="86" height="40" rx="12" fill="#0b1533" stroke="#3f6bff" strokeOpacity="0.5" />
          <path d="M150 158 l6 12 l12 -10 z" fill="#0b1533" stroke="#3f6bff" strokeOpacity="0.5" />
          <rect x="134" y="132" width="46" height="7" rx="3.5" fill="#4d74ff" fillOpacity="0.8" />
          <rect x="134" y="144" width="30" height="6" rx="3" fill="#ffffff" fillOpacity="0.14" />
        </g>

        {/* ── team figures ── */}
        {/* A — presenter, left, arm raised toward the board */}
        <g>
          <line x1="150" y1="286" x2="212" y2="250" stroke="#3f6bff" strokeWidth="10" strokeLinecap="round" />
          <path d="M124 360 q0 -74 26 -74 q26 0 26 74 z" fill="#3f6bff" />
          <circle cx="150" cy="214" r="20" fill="#d7defb" />
          <rect x="136" y="360" width="12" height="46" rx="6" fill="#1c274f" />
          <rect x="152" y="360" width="12" height="46" rx="6" fill="#1c274f" />
        </g>

        {/* B — centre-right, holding a laptop */}
        <g>
          <path d="M384 372 q0 -78 28 -78 q28 0 28 78 z" fill="#2e5eff" />
          <circle cx="412" cy="150" r="21" fill="#e3e8fb" />
          <rect x="396" y="372" width="13" height="48" rx="6.5" fill="#1c274f" />
          <rect x="414" y="372" width="13" height="48" rx="6.5" fill="#1c274f" />
          {/* laptop */}
          <rect x="388" y="330" width="52" height="34" rx="4" fill="#0b1533" stroke="#22d3ee" strokeOpacity="0.55" />
          <rect x="382" y="364" width="64" height="6" rx="3" fill="#334066" />
        </g>

        {/* C — right */}
        <g>
          <path d="M486 366 q0 -74 26 -74 q26 0 26 74 z" fill="#0891b2" />
          <circle cx="512" cy="224" r="19" fill="#d7defb" />
          <rect x="498" y="366" width="12" height="46" rx="6" fill="#1c274f" />
          <rect x="514" y="366" width="12" height="46" rx="6" fill="#1c274f" />
        </g>

        {/* ground shadow */}
        <ellipse cx="330" cy="418" rx="230" ry="20" fill="#05070f" fillOpacity="0.55" />

        {/* floating code glyph + plus nodes */}
        <g className="ev-float-slow" fill="none" stroke="#4d74ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          <path d="M120 72 l-16 14 l16 14" />
          <path d="M150 72 l16 14 l-16 14" />
        </g>
        <g stroke="#22d3ee" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" className="ev-drift">
          <path d="M560 300 h18 M569 291 v18" />
        </g>
      </svg>

      <style>{`
        .ev-float { animation: ev-float 7s ease-in-out infinite; }
        .ev-float-slow { animation: ev-float 10s ease-in-out infinite; }
        .ev-drift { animation: ev-drift 12s ease-in-out infinite; }
        @keyframes ev-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes ev-drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(6px,-8px); } }
        @media (prefers-reduced-motion: reduce) {
          .ev-float, .ev-float-slow, .ev-drift { animation: none; }
        }
      `}</style>
    </div>
  );
}
