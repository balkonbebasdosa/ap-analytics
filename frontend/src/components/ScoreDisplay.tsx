import type { ScoreBreakdown } from "@/types";
import { getScoreLabel, getScoreTier } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  breakdown: ScoreBreakdown;
  summary: string;
}

const METRICS: { key: keyof ScoreBreakdown; label: string; desc: string }[] = [
  {
    key:   "marketDemand",
    label: "Permintaan pasar",
    desc:  "Kepadatan populasi, lalu lintas pejalan kaki, dan perilaku pembelian dalam radius Anda.",
  },
  {
    key:   "locationAppeal",
    label: "Daya tarik lokasi",
    desc:  "Visibilitas jalan, akses transportasi, arus pejalan kaki, dan perdagangan di sekitar.",
  },
  {
    key:   "conceptUniqueness",
    label: "Keunikan konsep",
    desc:  "Seberapa berbeda konsep Anda dibandingkan pesaing di sekitar.",
  },
  {
    key:   "competitionDensity",
    label: "Kepadatan pesaing",
    desc:  "Jumlah, kedekatan, dan penilaian bisnis yang bersaing dalam radius Anda.",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Big colored hero panel (Shelby calculator card translation)
   ────────────────────────────────────────────────────────────────────── */
function ScoreHero({ score }: { score: number }) {
  const tier = getScoreTier(score);

  return (
    <div style={{
      background: tier.panel,
      borderRadius: 28,
      padding: "clamp(3rem, 6vw, 5.5rem) clamp(1.6rem, 4vw, 3.5rem)",
      position: "relative",
      transition: "background 0.3s var(--transition-color-easing)",
    }}>
      {/* Mono eyebrow */}
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: tier.ink, opacity: 0.7,
      }}>
        Indeks Kelayakan Bisnis
      </div>

      {/* Massive score */}
      <div style={{
        marginTop: "1.5rem",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "clamp(7rem, 18vw, 14rem)",
        fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.05em",
        color: tier.ink,
        display: "flex", alignItems: "baseline", gap: "0.4rem",
      }}>
        <span>{score}</span>
        <span style={{
          fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
          fontWeight: 500, opacity: 0.55,
        }}>/100</span>
      </div>

      <div style={{
        marginTop: "1rem",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: tier.ink, opacity: 0.85,
      }}>
        {getScoreLabel(score)}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Horizontal metric bar — mono label left, fill, mono number right
   ────────────────────────────────────────────────────────────────────── */
function MetricBar({ label, desc, value, accent, stripeAlt }: {
  label: string; desc: string; value: number; accent?: boolean; stripeAlt?: boolean;
}) {
  return (
    <div
      className="compartment-inner"
      style={{
        padding: "1.3rem 1.4rem",
        background: stripeAlt ? "var(--soft)" : "var(--cream)",
        borderRadius: 16,
      }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1rem", alignItems: "baseline",
        marginBottom: "0.9rem",
      }}>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--deep)",
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em",
          lineHeight: 1, color: "var(--deep)",
          fontVariantNumeric: "tabular-nums",
        }}>
          {value}
          <span style={{ fontSize: "0.95rem", opacity: 0.5, marginLeft: 4 }}>/100</span>
        </div>
      </div>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill ${accent ? "score-bar-fill--accent" : ""}`}
          style={{ transform: `scaleX(${value / 100})` }}
        />
      </div>
      <p style={{
        marginTop: "0.8rem",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 400, fontSize: "0.92rem", lineHeight: 1.5,
        color: "color-mix(in srgb, var(--deep) 70%, transparent)",
        maxWidth: 640,
      }}>
        {desc}
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ScoreDisplay
   ────────────────────────────────────────────────────────────────────── */
export default function ScoreDisplay({ score, breakdown, summary }: ScoreDisplayProps) {
  const maxValue = Math.max(...METRICS.map((m) => breakdown[m.key]));

  return (
    <div className="compartment-stack" style={{ gap: "0.8rem" }}>
      <ScoreHero score={score} />

      {/* Metric bars — striped compartment-inner panels */}
      <div className="compartment-inner" style={{ padding: "0.6rem", background: "var(--mist)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {METRICS.map((m, i) => (
            <MetricBar
              key={m.key}
              label={m.label}
              desc={m.desc}
              value={breakdown[m.key]}
              /* Strongest metric gets the bright pop — single highlight */
              accent={breakdown[m.key] === maxValue}
              stripeAlt={i % 2 === 1}
            />
          ))}
        </div>
      </div>

      {/* Market insight panel — the rare deep-emphasis moment */}
      <div
        className="compartment-deep"
        style={{
          padding: "clamp(1.8rem, 4vw, 2.8rem) clamp(1.6rem, 4vw, 3rem)",
        }}>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--bright)",
          marginBottom: "1rem",
        }}>
          Wawasan pasar
        </div>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 500, fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
          lineHeight: 1.55, letterSpacing: "-0.005em",
          color: "var(--cream)", margin: 0, maxWidth: 800,
        }}>
          {summary}
        </p>
      </div>
    </div>
  );
}
