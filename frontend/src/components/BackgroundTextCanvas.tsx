// BackgroundTextCanvas.tsx
// Renders floating, ultra-low-opacity text fragments from the CreatorVerse
// product spec behind all glassmorphism panels — purely decorative.

const TEXT_NODES: {
  text: string;
  x: number;   // % from left
  y: number;   // % from top
  size: number; // px
  opacity: number;
  rotate: number; // deg
  duration: number; // float animation seconds
  delay: number;
  mono?: boolean;
  accent?: boolean; // purple highlight
}[] = [
  // ── Module names ─────────────────────────────────────────────────
  { text: 'Audience Council',      x: 2,  y: 8,  size: 11, opacity: 0.07, rotate: -2,  duration: 18, delay: 0,   accent: true  },
  { text: 'Creator Multiverse',    x: 72, y: 5,  size: 13, opacity: 0.06, rotate: 1,   duration: 22, delay: 1.5, accent: true  },
  { text: 'Brand Oracle',          x: 55, y: 88, size: 12, opacity: 0.07, rotate: -1,  duration: 20, delay: 0.8, accent: true  },
  { text: 'AI Advisor',            x: 5,  y: 78, size: 10, opacity: 0.06, rotate: 2,   duration: 16, delay: 2,   accent: true  },
  { text: 'Opportunities',         x: 82, y: 62, size: 11, opacity: 0.05, rotate: -3,  duration: 24, delay: 3,   accent: true  },
  { text: 'Revenue Intelligence',  x: 30, y: 3,  size: 10, opacity: 0.05, rotate: 0,   duration: 19, delay: 1   },
  { text: 'Analytics Engine',      x: 85, y: 28, size: 10, opacity: 0.05, rotate: 1,   duration: 21, delay: 2.5 },
  { text: 'Creator Score',         x: 15, y: 48, size: 10, opacity: 0.06, rotate: -1,  duration: 17, delay: 0.5 },

  // ── Product flow steps ───────────────────────────────────────────
  { text: 'Connect Social Accounts', x: 6,  y: 16, size: 9, opacity: 0.04, rotate: 0,  duration: 25, delay: 4, mono: true },
  { text: 'Collect Creator Data',    x: 62, y: 14, size: 9, opacity: 0.04, rotate: 0,  duration: 23, delay: 2, mono: true },
  { text: 'Prediction Model',        x: 88, y: 46, size: 9, opacity: 0.04, rotate: 0,  duration: 20, delay: 1, mono: true },
  { text: 'Scenario Generator',      x: 3,  y: 60, size: 9, opacity: 0.04, rotate: 0,  duration: 22, delay: 3, mono: true },
  { text: 'Expected Outcomes',       x: 50, y: 92, size: 9, opacity: 0.04, rotate: 0,  duration: 18, delay: 0, mono: true },
  { text: 'Actionable Recommendations', x: 70, y: 82, size: 9, opacity: 0.04, rotate: 0, duration: 21, delay: 2, mono: true },

  // ── Metrics / numbers ────────────────────────────────────────────
  { text: '+45% Growth',        x: 18,  y: 24, size: 14, opacity: 0.06, rotate: -4,  duration: 15, delay: 1   },
  { text: '₹2.1L/month',        x: 78,  y: 18, size: 15, opacity: 0.05, rotate: 2,   duration: 17, delay: 3   },
  { text: '85 / 100',           x: 42,  y: 7,  size: 22, opacity: 0.04, rotate: -1,  duration: 20, delay: 0   },
  { text: '78%',                x: 90,  y: 72, size: 26, opacity: 0.05, rotate: 3,   duration: 14, delay: 1.5 },
  { text: '₹1.28L',             x: 8,   y: 86, size: 20, opacity: 0.05, rotate: -2,  duration: 19, delay: 0.5 },
  { text: '40% Students',       x: 58,  y: 58, size: 10, opacity: 0.05, rotate: -1,  duration: 22, delay: 2   },
  { text: '35% Professionals',  x: 25,  y: 70, size: 10, opacity: 0.04, rotate: 1,   duration: 20, delay: 3.5, mono: true },
  { text: '38% more engagement',x: 46,  y: 32, size: 9,  opacity: 0.04, rotate: -2,  duration: 18, delay: 1.5, mono: true },

  // ── Data sources ─────────────────────────────────────────────────
  { text: 'YouTube',    x: 2,  y: 38, size: 11, opacity: 0.05, rotate: 90, duration: 28, delay: 0   },
  { text: 'Instagram',  x: 93, y: 10, size: 11, opacity: 0.05, rotate: 90, duration: 28, delay: 1   },
  { text: 'TikTok',     x: 93, y: 52, size: 11, opacity: 0.04, rotate: 90, duration: 26, delay: 2   },
  { text: 'LinkedIn',   x: 2,  y: 68, size: 11, opacity: 0.04, rotate: 90, duration: 26, delay: 0.5 },
  { text: 'X',          x: 48, y: 96, size: 11, opacity: 0.04, rotate: 90, duration: 24, delay: 1.5 },

  // ── AI insight snippets ──────────────────────────────────────────
  { text: 'Audience Quality',   x: 35, y: 18, size: 9,  opacity: 0.04, rotate: 0,  duration: 22, delay: 2.5, mono: true },
  { text: 'Revenue Opportunities', x: 10, y: 55, size: 9, opacity: 0.04, rotate: 0, duration: 20, delay: 1, mono: true },
  { text: 'Engagement Patterns', x: 66, y: 38, size: 9,  opacity: 0.04, rotate: 0,  duration: 23, delay: 3, mono: true },
  { text: 'Growth Trends',      x: 55, y: 72, size: 9,  opacity: 0.04, rotate: 0,  duration: 19, delay: 0, mono: true },
  { text: 'Watch Time',         x: 80, y: 88, size: 9,  opacity: 0.04, rotate: 0,  duration: 21, delay: 2, mono: true },
  { text: 'Superfans',          x: 22, y: 92, size: 10, opacity: 0.05, rotate: -2, duration: 16, delay: 1 },
  { text: 'Brand Health Score', x: 42, y: 82, size: 9,  opacity: 0.04, rotate: 1,  duration: 24, delay: 3 },

  // ── Formula fragments ────────────────────────────────────────────
  { text: 'Consistency × 25%',    x: 68, y: 94, size: 9, opacity: 0.04, rotate: 0,  duration: 22, delay: 1, mono: true },
  { text: 'Market Demand × Audience Interest', x: 5, y: 95, size: 8, opacity: 0.03, rotate: 0, duration: 25, delay: 2, mono: true },
  { text: 'Simulation Engine →',   x: 36, y: 44, size: 9, opacity: 0.04, rotate: -1, duration: 20, delay: 0, mono: true },
];

export default function BackgroundTextCanvas() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {TEXT_NODES.map((node, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            fontSize: `${node.size}px`,
            opacity: node.opacity,
            transform: `rotate(${node.rotate}deg)`,
            fontFamily: node.mono
              ? "'Fira Code', 'Courier New', monospace"
              : "'Inter', system-ui, sans-serif",
            fontWeight: node.accent ? 700 : 400,
            color: node.accent ? '#c4b5fd' : '#ffffff',
            whiteSpace: 'nowrap',
            letterSpacing: node.mono ? '0.05em' : '0.02em',
            animation: `float ${node.duration}s ease-in-out ${node.delay}s infinite`,
            // Soft text glow for accented labels
            textShadow: node.accent
              ? '0 0 20px rgba(168,85,247,0.4)'
              : 'none',
          }}
        >
          {node.text}
        </span>
      ))}
    </div>
  );
}
