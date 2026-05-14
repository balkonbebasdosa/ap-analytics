import type { SwotAnalysis } from "@/types";

interface SwotCardProps {
  swot: SwotAnalysis;
}

/* Deep panels (S, W) + bright/mist tints (O, T). Single green family. Solid for primary (S, W),
   tinted for secondary (O, T) — so each row has one solid + one tint. */
const QUADRANTS: {
  key: keyof SwotAnalysis;
  letter: string;
  label: string;
  bg: string;
  fg: string;
  divider: string;
  countNoun: string;
}[] = [
  { key: "strengths",     letter: "S", label: "Kekuatan",     bg: "var(--deep)", fg: "var(--cream)",
    divider: "color-mix(in srgb, var(--cream) 18%, transparent)",  countNoun: "keunggulan" },
  { key: "weaknesses",    letter: "W", label: "Kelemahan",    bg: "var(--deep)",  fg: "var(--cream)",
    divider: "color-mix(in srgb, var(--cream) 18%, transparent)",   countNoun: "kekurangan" },
  { key: "opportunities", letter: "O", label: "Peluang", bg: "var(--bright)",  fg: "var(--deep)",
    divider: "color-mix(in srgb, var(--deep) 18%, transparent)", countNoun: "kesempatan" },
  { key: "threats",       letter: "T", label: "Ancaman",       bg: "var(--bright)",   fg: "var(--deep)",
    divider: "color-mix(in srgb, var(--deep) 18%, transparent)",  countNoun: "risiko" },
];

export default function SwotCard({ swot }: SwotCardProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.8rem",
    }} className="swot-grid">
      {QUADRANTS.map((q, i) => {
        const items = swot[q.key];
        return (
          <div
            key={q.key}
            style={{
              background: q.bg,
              color: q.fg,
              padding: "clamp(1.6rem, 3vw, 2.4rem)",
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              borderRadius: 20,
              transition: "background 0.3s var(--transition-color-easing)",
            }}
          >
            {/* Mono eyebrow */}
            <div style={{ marginBottom: "1.4rem" }}>
              <span style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: q.fg, opacity: 0.7,
              }}>
                {q.letter} · 0{i + 1}
              </span>
            </div>

            {/* Big display label */}
            <h3 style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "clamp(2rem, 3.6vw, 2.8rem)",
              fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.03em",
              color: q.fg,
              marginBottom: "0.6rem",
            }}>
              {q.label}
            </h3>

            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: q.fg, opacity: 0.55,
              marginBottom: "1.8rem",
            }}>
              {items.length} {q.countNoun} utama
            </p>

            <ul style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1, margin: 0, padding: 0, listStyle: "none" }}>
              {items.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    paddingTop:    idx === 0 ? 0 : "1rem",
                    paddingBottom: idx < items.length - 1 ? "1rem" : 0,
                    borderBottom:  idx < items.length - 1 ? `1px solid ${q.divider}` : "none",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 300, fontSize: "1rem", lineHeight: 1.55,
                    color: q.fg,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <style>{`
        @media (max-width: 700px) {
          .swot-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
