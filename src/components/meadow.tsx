export function Sky({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMaxYMin meet" className={className} aria-hidden="true">
      <g fill="#fff" opacity="0.9">
        <ellipse cx="46" cy="36" rx="28" ry="14" />
        <ellipse cx="70" cy="32" rx="22" ry="16" />
        <ellipse cx="24" cy="34" rx="16" ry="11" />
        <ellipse cx="168" cy="22" rx="22" ry="10" />
        <ellipse cx="190" cy="18" rx="16" ry="11" />
      </g>
      <g transform="translate(250 0)">
        <path d="M18 118 C70 78 108 48 168 18" fill="none" stroke="#2f8a52" strokeWidth="5" strokeLinecap="round" />
        <path d="M18 118 C40 96 58 108 72 92" fill="none" stroke="#246b40" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="78" cy="70" rx="22" ry="11" fill="#3aaa62" transform="rotate(-32 78 70)" />
        <ellipse cx="108" cy="48" rx="20" ry="10" fill="#2f9154" transform="rotate(-24 108 48)" />
        <ellipse cx="136" cy="30" rx="18" ry="9" fill="#49b86c" transform="rotate(-16 136 30)" />
        <ellipse cx="58" cy="92" rx="16" ry="8" fill="#237a45" transform="rotate(-48 58 92)" />
        <ellipse cx="96" cy="62" rx="14" ry="7" fill="#67c484" transform="rotate(-20 96 62)" />
        <ellipse cx="150" cy="22" rx="13" ry="6" fill="#8fd49a" transform="rotate(-8 150 22)" />
      </g>
    </svg>
  );
}

export function Meadow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 40 400 300" preserveAspectRatio="xMidYMax meet" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e7c4" />
          <stop offset="1" stopColor="#efd3a0" />
        </linearGradient>
      </defs>
      <path d="M0 118 C80 96 140 150 220 128 C290 110 340 156 400 132 L400 340 L0 340 Z" fill="#f4e4bf" />
      <path d="M0 168 C90 150 160 196 250 176 C310 162 360 198 400 178 L400 340 L0 340 Z" fill="url(#sand)" />
      <g fill="none" stroke="#e4c98a" strokeWidth="2.4" opacity="0.9">
        <rect x="22" y="188" width="28" height="22" rx="3" />
        <rect x="22" y="214" width="28" height="22" rx="3" />
        <rect x="54" y="214" width="28" height="22" rx="3" />
        <rect x="22" y="240" width="60" height="22" rx="3" />
        <rect x="22" y="266" width="28" height="22" rx="3" />
        <rect x="54" y="266" width="28" height="22" rx="3" />
      </g>
      <g fill="#d7c48a" opacity="0.55">
        <ellipse cx="70" cy="312" rx="26" ry="7" />
        <ellipse cx="150" cy="300" rx="18" ry="5" />
        <ellipse cx="210" cy="318" rx="22" ry="6" />
      </g>
      <Grass x={118} y={196} />
      <Grass x={188} y={168} />
      <Grass x={300} y={150} />

      <g transform="translate(18 78)">
        <ellipse cx="52" cy="214" rx="34" ry="7" fill="#e7d2a4" />
        <path d="M34 132 Q22 168 18 196" stroke="#234a96" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M50 132 Q68 150 86 118" stroke="#234a96" strokeWidth="13" strokeLinecap="round" fill="none" />
        <ellipse cx="16" cy="204" rx="9" ry="5" fill="#f3c2a2" />
        <ellipse cx="90" cy="112" rx="8" ry="5" fill="#f3c2a2" transform="rotate(-20 90 112)" />
        <path d="M28 78 Q22 118 40 136 L66 136 Q78 108 68 76 Z" fill="#f07830" />
        <path d="M30 108 Q48 118 68 100" stroke="#14915c" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M62 92 Q86 100 102 78" stroke="#f07830" strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M34 96 Q12 108 4 128" stroke="#f07830" strokeWidth="11" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="132" r="6" fill="#f3c2a2" />
        <circle cx="104" cy="74" r="6" fill="#f3c2a2" />
        <circle cx="50" cy="58" r="24" fill="#f6c7a8" />
        <path d="M28 56 Q30 28 52 26 Q76 28 74 58 Q66 38 50 34 Q36 36 28 56" fill="#6b4228" />
        <path d="M34 40 Q50 32 66 42" stroke="#6b4228" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="42" cy="58" r="2.2" fill="#24155f" />
        <circle cx="58" cy="58" r="2.2" fill="#24155f" />
        <ellipse cx="36" cy="64" rx="4" ry="2.2" fill="#e88998" opacity="0.8" />
        <ellipse cx="64" cy="64" rx="4" ry="2.2" fill="#e88998" opacity="0.8" />
        <path d="M44 68 Q50 74 57 68" stroke="#c4484a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>

      <g transform="translate(228 96)">
        <ellipse cx="48" cy="168" rx="36" ry="7" fill="#e7d2a4" />
        <path d="M28 96 L24 150" stroke="#d46a7c" strokeWidth="12" strokeLinecap="round" />
        <path d="M46 98 L50 150" stroke="#d46a7c" strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="22" cy="156" rx="8" ry="4.5" fill="#f3c2a2" />
        <ellipse cx="52" cy="156" rx="8" ry="4.5" fill="#f3c2a2" />
        <path d="M16 62 Q18 100 34 112 L54 112 Q70 96 64 60 Z" fill="#e07b8c" />
        <path d="M58 78 Q74 70 78 54" stroke="#e07b8c" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="80" cy="50" r="5.5" fill="#f3c2a2" />
        <circle cx="40" cy="46" r="20" fill="#f6c7a8" />
        <path d="M22 44 Q24 22 42 20 Q62 22 60 46 Q52 30 40 26 Q28 28 22 44" fill="#6b4228" />
        <path d="M58 28 Q72 8 66 30" stroke="#6b4228" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="70" cy="12" r="5" fill="#d23b45" />
        <circle cx="34" cy="46" r="1.8" fill="#24155f" />
        <circle cx="47" cy="46" r="1.8" fill="#24155f" />
        <ellipse cx="30" cy="52" rx="3.2" ry="1.8" fill="#e88998" opacity="0.75" />
        <path d="M35 54 Q40 58 46 54" stroke="#c4484a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        <g transform="translate(78 18)">
          <path d="M22 70 L20 118" stroke="#a56a3a" strokeWidth="11" strokeLinecap="round" />
          <path d="M38 72 L42 118" stroke="#a56a3a" strokeWidth="11" strokeLinecap="round" />
          <ellipse cx="18" cy="124" rx="7" ry="4" fill="#f3c2a2" />
          <ellipse cx="44" cy="124" rx="7" ry="4" fill="#f3c2a2" />
          <path d="M12 42 Q14 74 28 86 L46 84 Q58 66 50 40 Z" fill="#c9844a" />
          <circle cx="32" cy="30" r="16" fill="#f6c7a8" />
          <path d="M18 28 Q20 12 34 12 Q50 14 48 30 Q40 18 32 16 Q22 18 18 28" fill="#5c3824" />
          <path d="M22 30 Q32 36 42 28" stroke="#c4484a" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M24 26 Q28 22 26 28" stroke="#24155f" strokeWidth="1.6" fill="none" />
          <path d="M38 26 Q42 22 40 28" stroke="#24155f" strokeWidth="1.6" fill="none" />
          <ellipse cx="32" cy="34" rx="3" ry="2" fill="#e88998" opacity="0.5" />
        </g>
      </g>

      <g transform="translate(250 188)">
        <ellipse cx="62" cy="118" rx="46" ry="12" fill="#b4232c" />
        <ellipse cx="62" cy="112" rx="40" ry="9" fill="#e23b3b" />
        <ellipse cx="62" cy="108" rx="28" ry="6" fill="#f0c14a" />
        <ellipse cx="62" cy="86" rx="30" ry="22" fill="#fffaf4" />
        <path d="M40 78 Q36 96 48 100" stroke="#e7b4c4" strokeWidth="2" fill="none" />
        <circle cx="52" cy="90" r="3.2" fill="#e07b8c" />
        <circle cx="52" cy="90" r="1.2" fill="#f0c14a" />
        <path d="M78 70 Q88 84 84 98" stroke="#3aaa62" strokeWidth="2" fill="none" />
        <circle cx="74" cy="78" r="4" fill="#e07b8c" />
        <circle cx="62" cy="58" r="22" fill="#fffaf4" />
        <path d="M44 50 L34 28 L56 44 Z" fill="#fffaf4" />
        <path d="M80 50 L90 28 L68 44 Z" fill="#fffaf4" />
        <path d="M46 46 L40 32 L54 42 Z" fill="#f3b6c4" />
        <path d="M78 46 L84 32 L70 42 Z" fill="#f3b6c4" />
        <path d="M50 56 Q62 62 74 56" stroke="#c4484a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M46 54 Q62 66 78 54" stroke="#e07b8c" strokeWidth="1.4" fill="none" />
        <circle cx="54" cy="54" r="1.7" fill="#24155f" />
        <circle cx="70" cy="54" r="1.7" fill="#24155f" />
        <path d="M40 58 H28" stroke="#c8b49a" strokeWidth="1" />
        <path d="M40 62 H26" stroke="#c8b49a" strokeWidth="1" />
        <path d="M84 58 H96" stroke="#c8b49a" strokeWidth="1" />
        <path d="M84 62 H98" stroke="#c8b49a" strokeWidth="1" />
        <path d="M86 62 Q108 48 112 22" stroke="#fffaf4" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="114" cy="16" r="7" fill="#d23b45" />
        <circle cx="114" cy="16" r="3" fill="#f0c14a" />
        <circle cx="104" cy="30" r="6" fill="#d23b45" />
        <circle cx="104" cy="30" r="2.6" fill="#f0c14a" />
        <circle cx="96" cy="42" r="5" fill="#d23b45" />
        <circle cx="96" cy="42" r="2.2" fill="#f0c14a" />
        <rect x="46" y="78" width="10" height="16" rx="1.5" fill="#c23b3b" transform="rotate(18 51 86)" />
      </g>
    </svg>
  );
}

function Grass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="#3aaa62">
      <path d="M0 22 Q2 8 0 0 Q4 10 6 22 Z" />
      <path d="M6 22 Q12 6 16 2 Q12 12 10 22 Z" />
      <path d="M8 22 Q6 10 10 4 Q14 12 14 22 Z" />
    </g>
  );
}
