// One fixed, hand-built illustration for the "What we do" carousel's side
// panel — a layered "full-stack engineering" scene (glass app window + a
// live-looking chart, an AI node constellation behind it, floating code
// glyphs) in the site's electric/cyan palette on a deep navy panel.
// Pure SVG + CSS: no state, no image request, no library. Motion is a
// slow float that stops entirely under prefers-reduced-motion.
export default function EngineeringVisual() {
  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden sm:min-h-[320px] lg:min-h-[460px]">
      <svg
        viewBox="0 0 640 520"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label="Illustration of a product dashboard with an AI model connecting to it"
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
          <linearGradient id="ev-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4d74ff" />
            <stop offset="100%" stopColor="#2e5eff" />
          </linearGradient>
          <linearGradient id="ev-bar2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <radialGradient id="ev-glow-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2e5eff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2e5eff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ev-glow-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ev-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6f8bff" />
            <stop offset="60%" stopColor="#2e5eff" />
            <stop offset="100%" stopColor="#16256b" />
          </radialGradient>
          <pattern id="ev-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#ffffff" fillOpacity="0.05" />
          </pattern>
        </defs>

        {/* panel + ambient */}
        <rect width="640" height="520" fill="url(#ev-panel)" />
        <rect width="640" height="520" fill="url(#ev-dots)" />
        <circle cx="120" cy="90" r="220" fill="url(#ev-glow-a)" />
        <circle cx="560" cy="470" r="240" fill="url(#ev-glow-b)" />

        {/* AI node constellation (behind the window) */}
        <g className="ev-drift" opacity="0.9">
          <g stroke="#3f6bff" strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round">
            <line x1="470" y1="70" x2="360" y2="150" />
            <line x1="470" y1="70" x2="585" y2="150" />
            <line x1="360" y1="150" x2="470" y2="250" />
            <line x1="585" y1="150" x2="470" y2="250" />
            <line x1="470" y1="250" x2="410" y2="120" />
          </g>
          {[
            [470, 70],
            [360, 150],
            [585, 150],
            [470, 250],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="18" fill="#0b1533" stroke="#3f6bff" strokeOpacity="0.5" />
              <circle cx={x} cy={y} r="5.5" fill={i % 2 ? "#22d3ee" : "#4d74ff"} />
            </g>
          ))}
          {/* central hub */}
          <circle cx="470" cy="160" r="70" fill="url(#ev-glow-a)" />
          <circle cx="470" cy="160" r="30" fill="url(#ev-hub)" stroke="#8aa2ff" strokeOpacity="0.6" strokeWidth="1.5" />
          <text
            x="470"
            y="165"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            letterSpacing="0.12em"
            fill="#eaf0ff"
          >
            AI
          </text>
        </g>

        {/* floating glass app window */}
        <g className="ev-float">
          <rect x="70" y="150" width="420" height="280" rx="18" fill="#0c1226" stroke="#ffffff" strokeOpacity="0.12" />
          <rect x="70" y="150" width="420" height="280" rx="18" fill="url(#ev-glass)" />
          {/* title bar */}
          <path d="M70 168 a18 18 0 0 1 18 -18 h384 a18 18 0 0 1 18 18 v16 h-420 z" fill="#ffffff" fillOpacity="0.05" />
          <circle cx="92" cy="166" r="4" fill="#ffffff" fillOpacity="0.28" />
          <circle cx="106" cy="166" r="4" fill="#ffffff" fillOpacity="0.28" />
          <circle cx="120" cy="166" r="4" fill="#ffffff" fillOpacity="0.28" />
          {/* sidebar */}
          <rect x="70" y="184" width="92" height="246" fill="#ffffff" fillOpacity="0.03" />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x="86"
              y={210 + i * 30}
              width={i === 1 ? 42 : 58}
              height="9"
              rx="4.5"
              fill="#ffffff"
              fillOpacity={i === 0 ? 0.22 : 0.1}
            />
          ))}
          {/* content header */}
          <rect x="186" y="206" width="180" height="11" rx="5.5" fill="#ffffff" fillOpacity="0.18" />
          <rect x="186" y="226" width="110" height="8" rx="4" fill="#ffffff" fillOpacity="0.09" />
          {/* chart */}
          <g transform="translate(186 400)">
            {[
              { h: 96, g: "url(#ev-bar)" },
              { h: 52, g: "url(#ev-bar2)" },
              { h: 70, g: "url(#ev-bar)" },
              { h: 60, g: "url(#ev-bar2)" },
              { h: 128, g: "url(#ev-bar)" },
            ].map((b, i) => (
              <rect key={i} x={i * 46} y={-b.h} width="30" height={b.h} rx="6" fill={b.g} />
            ))}
            <line x1="-6" y1="0" x2="236" y2="0" stroke="#ffffff" strokeOpacity="0.14" />
          </g>
          {/* stat pill */}
          <rect x="360" y="196" width="112" height="44" rx="10" fill="#ffffff" fillOpacity="0.04" stroke="#ffffff" strokeOpacity="0.1" />
          <rect x="372" y="208" width="46" height="8" rx="4" fill="#22d3ee" fillOpacity="0.8" />
          <rect x="372" y="222" width="70" height="7" rx="3.5" fill="#ffffff" fillOpacity="0.12" />
        </g>

        {/* floating code glyphs */}
        <g className="ev-float-slow" fill="none" stroke="#4d74ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          <path d="M120 70 l-16 14 l16 14" />
          <path d="M150 70 l16 14 l-16 14" />
        </g>
        <g className="ev-float-slow" opacity="0.7">
          <rect x="524" y="330" width="86" height="30" rx="8" fill="#0b1533" stroke="#22d3ee" strokeOpacity="0.4" />
          <rect x="536" y="341" width="40" height="8" rx="4" fill="#22d3ee" fillOpacity="0.7" />
        </g>
      </svg>

      <style>{`
        .ev-float { animation: ev-float 7s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
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
