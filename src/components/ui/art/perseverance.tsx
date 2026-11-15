/** Perseverance — original line-art silhouette (viewBox 0 0 200 120, stroke=currentColor). */
export function Art_perseverance({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* body and deck */}
      <path d="M46 56 H144 V76 H46 Z" />
      <path d="M42 56 H148" />
      {/* tall mast with the SuperCam / Mastcam-Z head */}
      <path d="M130 56 V16" />
      <path d="M118 6 h26 v12 h-26z" />
      <circle cx="148" cy="10" r="3.2" />
      <path d="M122 18 v4 M140 18 v4" />
      {/* MMRTG at the back, with fins */}
      <path d="M46 62 L32 48 M38 68 L24 54 M32 48 L24 54 M46 62 L38 68" />
      <path d="M29 51 l-5 -5 M35 57 l-5 -5 M41 63 l-5 -5" />
      {/* UHF antenna (cylinder) and high-gain antenna */}
      <path d="M62 56 V44 h8 v12" />
      <path d="M84 56 V49 M75 46 L93 42" />
      {/* robotic arm stretched forward, turret with the coring drill */}
      <path d="M144 66 L164 50 L184 58 M180 52 h10 v12 h-10z M190 58 h5" />
      {/* rocker-bogie and six (thicker) wheels */}
      <path d="M96 76 L54 90 M96 76 L120 84 L98 96 M120 84 L142 96" />
      <circle cx="50" cy="99" r="12" />
      <circle cx="98" cy="99" r="12" />
      <circle cx="146" cy="99" r="12" />
      <path d="M50 92 v14 M98 92 v14 M146 92 v14" />
    </svg>
  );
}
