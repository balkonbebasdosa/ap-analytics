import type { StrategicRoadmap } from "@/types";

interface RoadmapCardProps {
  roadmap: StrategicRoadmap;
}

const SECTIONS: {
  key: keyof StrategicRoadmap;
  letter: string;
  label: string;
  bg: string;
  fg: string;
  node: string;
  nodeText: string;
  line: string;
}[] = [
  {
    key:      "differentiation",
    letter:   "A",
    label:    "Diferensiasi produk",
    bg:       "var(--deep)",
    fg:       "var(--cream)",
    node:     "var(--bright)",
    nodeText: "var(--deep)",
    line:     "color-mix(in srgb, var(--cream) 22%, transparent)",
  },
  {
    key:      "pricing",
    letter:   "B",
    label:    "Strategi harga",
    bg:       "var(--bright)",
    fg:       "var(--deep)",
    node:     "var(--deep)",
    nodeText: "var(--cream)",
    line:     "color-mix(in srgb, var(--deep) 24%, transparent)",
  },
  {
    key:      "marketing",
    letter:   "C",
    label:    "Pemasaran & visibilitas",
    bg:       "var(--bright)",
    fg:       "var(--deep)",
    node:     "var(--deep)",
    nodeText: "var(--cream)",
    line:     "color-mix(in srgb, var(--deep) 22%, transparent)",
  },
];

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0.8rem",
    }} className="roadmap-grid">
      {SECTIONS.map((s, idx) => (
        <div
          key={s.key}
          style={{
            background: s.bg,
            color: s.fg,
            padding: "clamp(1.6rem, 3vw, 2.4rem)",
            borderRadius: 20,
            display: "flex", flexDirection: "column",
            transition: "background 0.3s var(--transition-color-easing)",
          }}
        >
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: s.fg, opacity: 0.7,
            marginBottom: "1.2rem",
          }}>
            {s.letter} · 0{idx + 1}
          </div>

          <h3 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)",
            fontWeight: 700, lineHeight: 1, letterSpacing: "-0.025em",
            color: s.fg,
            marginBottom: "2.2rem",
          }}>
            {s.label}
          </h3>

          <ol style={{ display: "flex", flexDirection: "column", gap: 0, padding: 0, margin: 0, listStyle: "none" }}>
            {roadmap[s.key].map((tip, i) => {
              const isLast = i === roadmap[s.key].length - 1;
              return (
                <li
                  key={i}
                  style={{
                    position: "relative",
                    display: "flex", gap: "0.9rem",
                    paddingBottom: isLast ? 0 : "1.4rem",
                  }}
                >
                  {!isLast && (
                    <div style={{
                      position: "absolute",
                      left: 11, top: 24, bottom: 0,
                      width: 1, background: s.line,
                    }} />
                  )}
                  <div style={{
                    position: "relative", zIndex: 1, flexShrink: 0,
                    width: 22, height: 22, borderRadius: 999,
                    background: s.node, color: s.nodeText,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 10, fontWeight: 700,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{
                    paddingTop: 1,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.55,
                    color: s.fg,
                  }}>
                    {tip}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      ))}

      <style>{`
        @media (max-width: 900px) {
          .roadmap-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
