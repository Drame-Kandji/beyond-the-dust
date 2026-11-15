/** Sojourner + the Pathfinder lander's ramp and camera mast: original line art (viewBox 0 0 200 120). */
export function Art_sojourner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* ground */}
      <path d="M4 108 H196" strokeDasharray="2 5" />
      {/* lander: petal, camera mast and rear ramp */}
      <path d="M6 84 H34" />
      <path d="M14 84 V36 M8 26 h14 v10 h-14z M22 31 h3" />
      <path d="M30 84 L46 106" />
      <path d="M8 84 Q12 92 20 90 Q26 94 30 88" />
      {/* rover: solar panel, body, antenna */}
      <path d="M72 58 H152 V62 H72z" />
      <path d="M82 62 V78 H142 V62" />
      <path d="M92 58 V22" />
      <circle cx="92" cy="21" r="1.5" />
      {/* front cameras and laser stripes */}
      <path d="M142 66 h5 v6 h-5" />
      <path d="M148 75 L162 84 M148 75 L160 90" strokeDasharray="2 3" />
      {/* APXS at the back */}
      <path d="M82 72 L64 76 L58 82 M52 82 h10 v6 h-10z" />
      {/* rocker-bogie and six wheels (side view: three) */}
      <path d="M140 98 V82 L114 76 L94 86 L108 98 M94 86 L76 98" />
      <circle cx="76" cy="98" r="10" />
      <circle cx="108" cy="98" r="10" />
      <circle cx="140" cy="98" r="10" />
      <circle cx="114" cy="76" r="2.5" />
    </svg>
  );
}
