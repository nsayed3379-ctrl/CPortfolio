// The "What we do" carousel side illustration — floats directly on the
// page background (no card/border of its own), sized to match the text
// card's footprint exactly (same min-height at every breakpoint) so the
// two elements read as equal partners rather than one dominating the
// other. Renders a static illustration from /public/illustrations (a
// licensed Storyset scene, recoloured to the site's blue palette). A
// plain <img> — not next/image — so the SVG is served as-is without the
// image optimizer / dangerouslyAllowSVG.
export default function EngineeringVisual() {
  return (
    <div className="relative h-full min-h-[220px] w-full overflow-hidden sm:min-h-[260px] lg:min-h-[300px]">
      {/* Absolutely positioned (not in normal flow) so it can never grow
          the container from its own intrinsic aspect ratio — the classic
          "percentage-height image in an auto-height box" trap, which was
          blowing this panel (and with it, the stretched grid row and the
          arrow buttons anchored to it) way past the card's height. Same
          fix MediaFrame.tsx uses elsewhere on the site. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/illustrations/digital-presentation.svg"
        alt="Illustration of a team giving a digital presentation with AI and chatbot elements"
        className="absolute inset-0 h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
