import { useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Feature card previews — small interactive mockups of each dashboard
   feature, rendered with the design system. Indexed to match the landing
   `features` list (01–06).
   ────────────────────────────────────────────────────────────────────── */

const FRAME_HEIGHT = 150;

const monoLabel: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

/* Shared shell — wraps a preview frame with a consistent interaction hint. */
function PreviewShell({ instruction, children }: {
  instruction: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {children}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--bright)", flexShrink: 0 }} />
        <span style={{ ...monoLabel, color: "var(--deep)", opacity: 0.5 }}>{instruction}</span>
      </div>
    </div>
  );
}

/* ── 01 · Location intelligence — hover to scan the radius ──────────────── */
function LocationIntelPreview() {
  const [scanning, setScanning] = useState(false);
  const dots = [
    { x: 28, y: 32 }, { x: 72, y: 26 }, { x: 80, y: 64 },
    { x: 36, y: 74 }, { x: 60, y: 52 },
  ];
  return (
    <PreviewShell instruction="Hover to scan the area">
      <div
        onMouseEnter={() => setScanning(true)}
        onMouseLeave={() => setScanning(false)}
        style={{
          height: FRAME_HEIGHT, borderRadius: 14,
          position: "relative", overflow: "hidden", cursor: "crosshair",
          background: "var(--soft)",
        }}
      >
        <div
          style={{
            position: "absolute", left: "50%", top: "50%",
            width: scanning ? 116 : 78, height: scanning ? 116 : 78,
            marginLeft: scanning ? -58 : -39, marginTop: scanning ? -58 : -39,
            borderRadius: 999,
            border: "1.5px dashed var(--deep)",
            background: "color-mix(in srgb, var(--bright) 20%, transparent)",
            transition: "all 0.5s var(--transition-color-easing)",
          }}
        />
        {dots.map((d, i) => (
          <span
            key={i}
            style={{
              position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
              width: 9, height: 9, borderRadius: 999,
              background: "var(--bright)", border: "1.5px solid var(--deep)",
              transform: `translate(-50%,-50%) scale(${scanning ? 1 : 0})`,
              transition: `transform 0.35s var(--transition-color-easing) ${i * 0.05}s`,
            }}
          />
        ))}
        <span
          style={{
            position: "absolute", left: "50%", top: "50%",
            width: 13, height: 13, borderRadius: 999,
            background: "var(--deep)", border: "2px solid var(--cream)",
            transform: "translate(-50%,-50%)",
          }}
        />
        <span style={{ ...monoLabel, position: "absolute", bottom: 9, left: 11, color: "var(--deep)", opacity: 0.6 }}>
          {scanning ? "5 competitors found" : "radius idle"}
        </span>
      </div>
    </PreviewShell>
  );
}

/* ── 02 · AI-powered SWOT — click a quadrant to expand ─────────────────── */
function SwotPreview() {
  const [active, setActive] = useState<number | null>(null);
  const tiles = [
    { letter: "S", label: "Strengths", solid: true },
    { letter: "W", label: "Weaknesses", solid: true },
    { letter: "O", label: "Opportunities", solid: false },
    { letter: "T", label: "Threats", solid: false },
  ];
  return (
    <PreviewShell instruction="Click a quadrant to expand">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, height: FRAME_HEIGHT }}>
        {tiles.map((t, i) => {
          const isActive = active === i;
          return (
            <button
              key={i}
              onClick={() => setActive(isActive ? null : i)}
              style={{
                border: "none", cursor: "pointer", borderRadius: 10,
                background: t.solid ? "var(--deep)" : "var(--bright)",
                color: t.solid ? "var(--cream)" : "var(--deep)",
                padding: "0.55rem 0.65rem",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                textAlign: "left",
                transform: isActive ? "scale(0.97)" : "scale(1)",
                transition: "transform 0.2s var(--transition-color-easing)",
              }}
            >
              <span style={{ ...monoLabel, opacity: 0.7 }}>{t.letter} · 0{i + 1}</span>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 700 }}>
                {t.label}
              </span>
              <div
                style={{
                  display: "flex", flexDirection: "column", gap: 3,
                  height: isActive ? 14 : 0, opacity: isActive ? 1 : 0,
                  overflow: "hidden", transition: "all 0.25s var(--transition-color-easing)",
                }}
              >
                <span style={{ height: 2, width: "80%", background: "currentColor", opacity: 0.5, borderRadius: 2 }} />
                <span style={{ height: 2, width: "55%", background: "currentColor", opacity: 0.5, borderRadius: 2 }} />
              </div>
            </button>
          );
        })}
      </div>
    </PreviewShell>
  );
}

/* ── 03 · BVI score — drag the slider to move the gauge ────────────────── */
function BviScorePreview() {
  const [score, setScore] = useState(39);
  const label = score < 40 ? "Challenging" : score < 70 ? "Moderate" : "Strong";
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const bars = [
    { label: "Demand", value: Math.min(100, score + 18) },
    { label: "Location", value: Math.max(0, score - 6) },
  ];
  return (
    <PreviewShell instruction="Drag to move the score">
      <div
        style={{
          height: FRAME_HEIGHT, borderRadius: 14,
          padding: "0.8rem 0.9rem", background: "var(--deep)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
            <svg viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="32" cy="32" r={r} fill="none" stroke="color-mix(in srgb, var(--bright) 22%, transparent)" strokeWidth="7" />
              <circle
                cx="32" cy="32" r={r} fill="none"
                stroke="var(--bright)" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                style={{ transition: "stroke-dasharray 0.2s linear" }}
              />
            </svg>
            <div
              style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 800, fontSize: 14, color: "var(--bright)",
              }}
            >
              {score}
            </div>
          </div>
          <div>
            <div style={{ ...monoLabel, color: "var(--bright)", opacity: 0.7 }}>BVI Score</div>
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, fontWeight: 700, color: "var(--cream)", marginTop: 2 }}>
              {label}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {bars.map((b) => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ ...monoLabel, letterSpacing: "0.08em", color: "var(--cream)", opacity: 0.55, width: 62, flexShrink: 0, whiteSpace: "nowrap" }}>{b.label}</span>
              <div style={{ flex: 1, height: 5, borderRadius: 999, background: "color-mix(in srgb, var(--bright) 18%, transparent)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${b.value}%`, background: "var(--bright)", borderRadius: 999, transition: "width 0.2s linear" }} />
              </div>
            </div>
          ))}
        </div>

        <input
          type="range" min={0} max={100} value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          aria-label="BVI score preview"
          className="bvi-mini-range"
        />

        <style>{`
          .bvi-mini-range {
            -webkit-appearance: none; appearance: none;
            width: 100%; height: 4px; margin: 0;
            background: color-mix(in srgb, var(--bright) 22%, transparent);
            border-radius: 999px; outline: none; cursor: pointer;
          }
          .bvi-mini-range::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 14px; height: 14px; border-radius: 999px;
            background: var(--bright); border: 2px solid var(--deep);
            cursor: grab;
          }
          .bvi-mini-range::-moz-range-thumb {
            width: 12px; height: 12px; border-radius: 999px;
            background: var(--bright); border: 2px solid var(--deep);
            cursor: grab;
          }
        `}</style>
      </div>
    </PreviewShell>
  );
}

/* ── 04 · Strategic roadmap — click a step to mark it done ─────────────── */
function RoadmapPreview() {
  const [done, setDone] = useState<number[]>([]);
  const steps = ["Differentiate the concept", "Set entry pricing", "Target local visibility"];
  const toggle = (i: number) =>
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  return (
    <PreviewShell instruction="Click a step to complete it">
      <div
        style={{
          height: FRAME_HEIGHT, borderRadius: 14,
          padding: "0.9rem 1rem", background: "var(--soft)",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}
      >
        {steps.map((s, i) => {
          const isDone = done.includes(i);
          const isLast = i === steps.length - 1;
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                border: "none", background: "transparent", cursor: "pointer",
                display: "flex", gap: 10, alignItems: "flex-start",
                padding: 0, paddingBottom: isLast ? 0 : 14,
                position: "relative", textAlign: "left",
              }}
            >
              {!isLast && (
                <div style={{ position: "absolute", left: 9.5, top: 20, bottom: 0, width: 1.5, background: "color-mix(in srgb, var(--deep) 22%, transparent)" }} />
              )}
              <div
                style={{
                  width: 20, height: 20, borderRadius: 999, flexShrink: 0, zIndex: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 700,
                  background: isDone ? "var(--bright)" : "var(--mist)", color: "var(--deep)",
                  transition: "background 0.2s var(--transition-color-easing)",
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                style={{
                  paddingTop: 3,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 12, fontWeight: 500, lineHeight: 1.3, color: "var(--deep)",
                  opacity: isDone ? 0.45 : 0.9,
                  textDecoration: isDone ? "line-through" : "none",
                }}
              >
                {s}
              </span>
            </button>
          );
        })}
      </div>
    </PreviewShell>
  );
}

/* ── 05 · Data-driven decisions — hover a competitor row ───────────────── */
function DataDrivenPreview() {
  const [hover, setHover] = useState<number | null>(null);
  const rows = [
    { name: "Kopi Kenangan", dist: "120m", rating: "4.5" },
    { name: "Janji Jiwa", dist: "340m", rating: "4.2" },
    { name: "Fore Coffee", dist: "510m", rating: "4.7" },
    { name: "Kopi Tuku", dist: "780m", rating: "4.4" },
  ];
  return (
    <PreviewShell instruction="Hover a competitor row">
      <div
        style={{
          height: FRAME_HEIGHT, borderRadius: 14,
          padding: 6, background: "var(--soft)",
          display: "flex", flexDirection: "column", gap: 2,
        }}
      >
        {rows.map((r, i) => (
          <div
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{
              display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center",
              padding: "0.42rem 0.6rem", borderRadius: 8, flex: 1,
              background:
                hover === i
                  ? "color-mix(in srgb, var(--bright) 32%, var(--cream))"
                  : i % 2 === 1 ? "var(--cream)" : "transparent",
              transition: "background 0.15s ease",
            }}
          >
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--deep)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.name}
            </span>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--deep)", opacity: 0.55, fontVariantNumeric: "tabular-nums" }}>
              {r.dist}
            </span>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--deep)", fontVariantNumeric: "tabular-nums" }}>
              ★ {r.rating}
            </span>
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

/* ── 06 · Visual analytics — hover a bar to read its value ─────────────── */
function VisualAnalyticsPreview() {
  const bars = [40, 72, 55, 88, 63, 48];
  const peak = bars.indexOf(Math.max(...bars));
  const [hover, setHover] = useState<number>(peak);
  return (
    <PreviewShell instruction="Hover a bar for its value">
      <div
        style={{
          height: FRAME_HEIGHT, borderRadius: 14,
          padding: "1.3rem 0.9rem 0.9rem", background: "var(--soft)",
          display: "flex", alignItems: "flex-end", gap: 6,
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(peak)}
            style={{
              flex: 1, height: `${h}%`, borderRadius: 6, position: "relative", cursor: "pointer",
              background: hover === i ? "var(--bright)" : "var(--deep)",
              transition: "background 0.15s ease",
            }}
          >
            {hover === i && (
              <span
                style={{
                  position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 10, fontWeight: 800, color: "var(--deep)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {h}
              </span>
            )}
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

export const featurePreviews = [
  LocationIntelPreview,
  SwotPreview,
  BviScorePreview,
  RoadmapPreview,
  DataDrivenPreview,
  VisualAnalyticsPreview,
];
