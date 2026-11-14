/** Curiosity — original line-art silhouette (viewBox 0 0 200 120, stroke=currentColor). */
export function Art_curiosity({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* body and deck */}
      <path d="M48 58 H146 V78 H48 Z" />
      <path d="M44 58 H150" />
      {/* mast with Mastcam / ChemCam head */}
      <path d="M128 58 V20" />
      <path d="M118 10 h24 v12 h-24z" />
      <circle cx="146" cy="13" r="3" />
      <path d="M128 36 h10 M128 36 l-8 2" />
      {/* MMRTG at the back, angled with fins */}
      <path d="M48 64 L34 50 M40 70 L26 56 M34 50 L26 56 M48 64 L40 70" />
      <path d="M31 53 l-5 -5 M37 59 l-5 -5 M43 65 l-5 -5" />
      {/* high-gain antenna */}
      <path d="M70 58 V50 M60 47 L80 43" />
      {/* robotic arm with turret */}
      <path d="M146 68 L166 56 L178 78 M172 78 h12 v8 h-12z M178 86 v6" />
      {/* rocker-bogie and six wheels */}
      <path d="M98 78 L56 92 M98 78 L122 86 L100 98 M122 86 L144 98" />
      <circle cx="52" cy="100" r="11" />
      <circle cx="100" cy="100" r="11" />
      <circle cx="148" cy="100" r="11" />
      <circle cx="52" cy="100" r="3" />
      <circle cx="100" cy="100" r="3" />
      <circle cx="148" cy="100" r="3" />
    </svg>
  );
}
