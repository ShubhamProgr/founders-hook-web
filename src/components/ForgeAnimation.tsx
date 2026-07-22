// Signature hero element: an animated circuit connecting founders' ideas
// to builders' skills. Pure SVG + CSS (offset-path), no JS dependency.

const paths = [
  "M 90 70 C 300 70, 300 200, 520 90",
  "M 90 200 C 300 200, 300 200, 520 200",
  "M 90 330 C 300 330, 300 200, 520 310",
];

const founderNodes = [
  { cx: 90, cy: 70, label: "Idea" },
  { cx: 90, cy: 200, label: "Startup" },
  { cx: 90, cy: 330, label: "Team need" },
];

const builderNodes = [
  { cx: 520, cy: 90, label: "Skill" },
  { cx: 520, cy: 200, label: "Student" },
  { cx: 520, cy: 310, label: "Portfolio" },
];

export default function ForgeAnimation() {
  return (
    <div className="relative w-full max-w-[620px] mx-auto">
      <svg
        viewBox="0 0 620 400"
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.25" />
          </linearGradient>
          <radialGradient id="nodeGlowPurple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGlowLime" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4FF3F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4FF3F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* connective paths */}
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="1.5"
          />
        ))}

        {/* traveling sparks along each path */}
        {paths.map((d, i) => (
          <circle
            key={`spark-${i}`}
            r="4"
            fill="#D4FF3F"
            style={{
              offsetPath: `path('${d}')`,
              animation: `travel-a ${3.2 + i * 0.6}s ease-in-out ${i * 0.9}s infinite`,
              filter: "drop-shadow(0 0 6px #D4FF3F)",
            }}
          />
        ))}

        {/* founder nodes (left) */}
        {founderNodes.map((n, i) => (
          <g key={`f-${i}`}>
            <circle cx={n.cx} cy={n.cy} r="26" fill="url(#nodeGlowPurple)" />
            <circle
              cx={n.cx}
              cy={n.cy}
              r="6"
              fill="#A855F7"
              style={{
                animation: `pulse-node 2.6s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
            <text
              x={n.cx}
              y={n.cy + 42}
              textAnchor="middle"
              className="fill-muted font-mono"
              fontSize="11"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* builder nodes (right) */}
        {builderNodes.map((n, i) => (
          <g key={`b-${i}`}>
            <circle cx={n.cx} cy={n.cy} r="26" fill="url(#nodeGlowLime)" />
            <circle
              cx={n.cx}
              cy={n.cy}
              r="6"
              fill="#D4FF3F"
              style={{
                animation: `pulse-node 2.6s ease-in-out ${i * 0.4 + 0.3}s infinite`,
              }}
            />
            <text
              x={n.cx}
              y={n.cy + 42}
              textAnchor="middle"
              className="fill-muted font-mono"
              fontSize="11"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* column labels */}
        <text x="90" y="20" textAnchor="middle" className="fill-purple-glow font-mono" fontSize="12" letterSpacing="1.5">
          FOUNDERS
        </text>
        <text x="520" y="20" textAnchor="middle" className="fill-lime font-mono" fontSize="12" letterSpacing="1.5">
          BUILDERS
        </text>
      </svg>
    </div>
  );
}
