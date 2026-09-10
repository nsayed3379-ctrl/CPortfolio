// One fixed, hand-built illustration for the "What we do" carousel's side
// panel: a small team standing together with a cluster of tech motifs
// around them — an "AI" chip, a chat-bot bubble, gears, a message bubble —
// in the site's blue / cyan palette on a deep-navy panel. Pure SVG + CSS:
// no state, no image request, no library. Accents drift slowly; motion
// stops entirely under prefers-reduced-motion.
export default function EngineeringVisual() {
  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden sm:min-h-[320px] lg:min-h-[460px]">
      <svg
        viewBox="0 0 640 520"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label="Illustration of a team surrounded by AI, chatbot and automation motifs"
      >
        <defs>
          <linearGradient id="ev-panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b1533" />
            <stop offset="55%" stopColor="#0a1024" />
            <stop offset="100%" stopColor="#05070f" />
          </linearGradient>
          <linearGradient id="ev-jacket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4d74ff" />
            <stop offset="100%" stopColor="#2647c9" />
          </linearGradient>
          <linearGradient id="ev-cyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0e7d97" />
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

        {/* ── tech-motif cluster ── */}
        {/* AI chip */}
        <g className="ev-float-slow">
          <rect x="286" y="70" width="92" height="92" rx="14" fill="#0c1226" stroke="#3f6bff" strokeOpacity="0.7" strokeWidth="2" />
          {[24, 46, 68].map((d) => (
            <g key={d} stroke="#3f6bff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round">
              <line x1={286 + d} y1="58" x2={286 + d} y2="70" />
              <line x1={286 + d} y1="162" x2={286 + d} y2="174" />
              <line x1="274" y1={70 + d} x2="286" y2={70 + d} />
              <line x1="378" y1={70 + d} x2="390" y2={70 + d} />
            </g>
          ))}
          <text x="332" y="126" textAnchor="middle" fontSize="30" fontWeight="700" letterSpacing="0.06em" fill="#6f8bff">AI</text>
        </g>

        {/* chat-bot bubble */}
        <g className="ev-float">
          <path d="M470 96 h96 a16 16 0 0 1 16 16 v56 a16 16 0 0 1 -16 16 h-58 l-18 18 v-18 h-20 a16 16 0 0 1 -16 -16 v-56 a16 16 0 0 1 16 -16 z" fill="url(#ev-jacket)" />
          <line x1="518" y1="86" x2="518" y2="96" stroke="#6f8bff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="518" cy="82" r="4" fill="#6f8bff" />
          <circle cx="504" cy="134" r="6" fill="#eaf0ff" />
          <circle cx="532" cy="134" r="6" fill="#eaf0ff" />
          <path d="M504 152 q14 12 28 0" fill="none" stroke="#eaf0ff" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* gears */}
        <g className="ev-spin" style={{ transformOrigin: "560px 60px" }}>
          <path d="M560 40 l6 3 7 -3 3 7 7 3 -1 7 5 5 -5 5 1 7 -7 3 -3 7 -7 -3 -6 3 -3 -7 -7 -3 1 -7 -5 -5 5 -5 -1 -7 7 -3 z" fill="none" stroke="#22d3ee" strokeOpacity="0.8" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="560" cy="60" r="7" fill="none" stroke="#22d3ee" strokeOpacity="0.8" strokeWidth="3" />
        </g>
        <g className="ev-spin-rev" style={{ transformOrigin: "598px 96px" }}>
          <path d="M598 82 l4 2 5 -2 2 5 5 2 -1 5 3 3 -3 3 1 5 -5 2 -2 5 -5 -2 -4 2 -2 -5 -5 -2 1 -5 -3 -3 3 -3 -1 -5 5 -2 z" fill="none" stroke="#3f6bff" strokeOpacity="0.75" strokeWidth="2.5" strokeLinejoin="round" />
        </g>

        {/* message bubble + hollow ring */}
        <g className="ev-float-slow">
          <path d="M494 214 h58 a12 12 0 0 1 12 12 v30 a12 12 0 0 1 -12 12 h-40 l-12 12 v-12 h-6 a12 12 0 0 1 -12 -12 v-30 a12 12 0 0 1 12 -12 z" fill="none" stroke="#22d3ee" strokeOpacity="0.7" strokeWidth="2.5" />
          {[512, 524, 536].map((cx) => (
            <circle key={cx} cx={cx} cy="242" r="3" fill="#22d3ee" fillOpacity="0.85" />
          ))}
        </g>
        <circle cx="470" cy="248" r="14" fill="none" stroke="#3f6bff" strokeOpacity="0.6" strokeWidth="3" className="ev-drift" />

        {/* faint connecting dashes chip → people */}
        <g stroke="#3f6bff" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 8" strokeLinecap="round">
          <path d="M300 160 q-40 60 -70 110" />
          <path d="M360 160 q20 50 40 90" />
        </g>

        {/* ── team ── (feet ~ y 430) */}
        {/* P1 — hands on hips */}
        <g>
          <ellipse cx="128" cy="432" rx="46" ry="10" fill="#05070f" fillOpacity="0.5" />
          <rect x="116" y="392" width="12" height="42" rx="6" fill="#1c274f" />
          <rect x="130" y="392" width="12" height="42" rx="6" fill="#1c274f" />
          <path d="M100 396 q0 -84 28 -84 q28 0 28 84 z" fill="url(#ev-cyan)" />
          <path d="M104 352 q-16 6 -14 30 M152 352 q16 6 14 30" fill="none" stroke="url(#ev-cyan)" strokeWidth="11" strokeLinecap="round" />
          <circle cx="128" cy="292" r="19" fill="#ecdcc9" />
          <path d="M109 288 q2 -26 19 -26 q17 0 19 26 q-8 -12 -19 -12 q-11 0 -19 12 z" fill="#16213f" />
        </g>

        {/* P2 — holding a laptop */}
        <g>
          <ellipse cx="236" cy="434" rx="48" ry="10" fill="#05070f" fillOpacity="0.5" />
          <rect x="224" y="392" width="12" height="44" rx="6" fill="#1c274f" />
          <rect x="238" y="392" width="12" height="44" rx="6" fill="#1c274f" />
          <path d="M206 398 q0 -86 30 -86 q30 0 30 86 z" fill="#e8ecfb" />
          <rect x="212" y="360" width="48" height="30" rx="4" fill="#0b1533" stroke="#22d3ee" strokeOpacity="0.55" />
          <rect x="206" y="388" width="60" height="6" rx="3" fill="#334066" />
          <circle cx="236" cy="288" r="19" fill="#ecdcc9" />
          <path d="M217 286 q0 -28 19 -28 q19 0 19 28 q-6 -10 -19 -10 q-13 0 -19 10 z" fill="#1f2b52" />
        </g>

        {/* P3 — presenting, arms open */}
        <g>
          <ellipse cx="342" cy="436" rx="52" ry="11" fill="#05070f" fillOpacity="0.5" />
          <rect x="330" y="392" width="13" height="46" rx="6.5" fill="#1c274f" />
          <rect x="345" y="392" width="13" height="46" rx="6.5" fill="#1c274f" />
          {/* skirt/dress shape */}
          <path d="M312 400 l14 -78 h30 l14 78 z" fill="url(#ev-jacket)" />
          <path d="M326 322 q16 -8 30 0" fill="none" stroke="#e8ecfb" strokeWidth="10" strokeLinecap="round" />
          <path d="M326 322 q-20 10 -26 40 M356 322 q20 10 26 40" fill="none" stroke="#e8ecfb" strokeWidth="10" strokeLinecap="round" />
          <circle cx="341" cy="300" r="19" fill="#ecdcc9" />
          <path d="M322 302 q0 -30 19 -30 q19 0 19 30 q0 8 -4 14 q2 -18 -15 -18 q-17 0 -15 18 q-4 -6 -4 -14 z" fill="#16213f" />
        </g>

        {/* P4 — hand raised */}
        <g>
          <ellipse cx="446" cy="434" rx="46" ry="10" fill="#05070f" fillOpacity="0.5" />
          <rect x="434" y="392" width="12" height="44" rx="6" fill="#1c274f" />
          <rect x="448" y="392" width="12" height="44" rx="6" fill="#1c274f" />
          <path d="M424 398 q0 -84 22 -84 q22 0 22 84 z" fill="url(#ev-cyan)" />
          <path d="M430 356 q-18 -4 -20 -34" fill="none" stroke="url(#ev-cyan)" strokeWidth="10" strokeLinecap="round" />
          <path d="M462 356 q16 6 14 30" fill="none" stroke="url(#ev-cyan)" strokeWidth="10" strokeLinecap="round" />
          <circle cx="446" cy="294" r="18" fill="#ecdcc9" />
          <path d="M428 292 q1 -25 18 -25 q17 0 18 25 q-7 -11 -18 -11 q-11 0 -18 11 z" fill="#1f2b52" />
        </g>

        {/* small plus accents */}
        <g stroke="#22d3ee" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" className="ev-drift">
          <path d="M92 150 h16 M100 142 v16" />
          <path d="M556 300 h16 M564 292 v16" />
        </g>
      </svg>

      <style>{`
        .ev-float { animation: ev-float 7s ease-in-out infinite; }
        .ev-float-slow { animation: ev-float 10s ease-in-out infinite; }
        .ev-drift { animation: ev-drift 12s ease-in-out infinite; }
        .ev-spin { animation: ev-spin 22s linear infinite; }
        .ev-spin-rev { animation: ev-spin 18s linear infinite reverse; }
        @keyframes ev-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes ev-drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(6px,-8px); } }
        @keyframes ev-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .ev-float, .ev-float-slow, .ev-drift, .ev-spin, .ev-spin-rev { animation: none; }
        }
      `}</style>
    </div>
  );
}
