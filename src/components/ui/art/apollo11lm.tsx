/** Original line-art silhouette of the Apollo 11 LM descent stage (viewBox 0 0 200 120, stroke=currentColor). */
export function Art_apollo11lm({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* octagonal body and top deck */}
      <path d="M66 46 H134 L142 54 V70 L134 76 H66 L58 70 V54 Z" />
      <path d="M58 54 H142 M74 40 h52 v6 M82 40 v-4 M118 40 v-4" />
      {/* descent engine */}
      <path d="M92 76 L86 90 H114 L108 76" />
      {/* side legs, struts and footpads */}
      <path d="M58 58 L30 104 M58 72 L42 84 M142 58 L170 104 M142 72 L158 84" />
      <path d="M20 106 h20 M160 106 h20" />
      {/* front leg with ladder */}
      <path d="M100 76 V104 M90 106 h20" />
      <path d="M93 78 V100 M107 78 V100 M93 84 h14 M93 90 h14 M93 96 h14" />
      {/* porch */}
      <path d="M90 46 V36 M110 46 V36 M88 36 h24" />
      {/* contact probe and ground */}
      <path d="M180 106 l8 -6" />
      <path d="M8 110 H192" strokeDasharray="2 5" />
    </svg>
  );
}
