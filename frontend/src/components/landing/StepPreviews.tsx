import { MapPin } from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
   "How it works" step demos — small product-demo snapshots that animate
   into place when their card expands. Each takes `active` (card hovered).
   Indexed to match the landing `steps` list (01–04).
   ────────────────────────────────────────────────────────────────────── */

const DEMO_HEIGHT = 132;

const monoLabel: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 8.5,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const easing = "var(--transition-color-easing)";

/* ── 01 · Describe your business — a form filling itself in ────────────── */
function DescribeBusinessDemo({ active }: { active: boolean }) {
  const categories = ["F&B", "Retail", "Service"];
  return (
    <div
      style={{
        height: DEMO_HEIGHT, borderRadius: 12, background: "var(--soft)",
        padding: "0.7rem 0.8rem", display: "flex", flexDirection: "column", gap: 9,
      }}
    >
      <div>
        <div style={{ ...monoLabel, color: "var(--deep)", opacity: 0.5, marginBottom: 4 }}>Business name</div>
        <div
          style={{
            background: "var(--cream)", borderRadius: 8, padding: "0.4rem 0.55rem",
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 600,
            color: "var(--deep)", whiteSpace: "nowrap", overflow: "hidden",
          }}
        >
          <span style={{ opacity: active ? 1 : 0.35, transition: `opacity 0.4s ${easing}` }}>
            {active ? "Warung Kopi Nusantara" : "Type your name…"}
          </span>
        </div>
      </div>
      <div>
        <div style={{ ...monoLabel, color: "var(--deep)", opacity: 0.5, marginBottom: 4 }}>Category</div>
        <div style={{ display: "flex", gap: 4 }}>
          {categories.map((c, idx) => {
            const on = active && idx === 0;
            return (
              <span
                key={c}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
                  background: on ? "var(--deep)" : "var(--cream)",
                  color: on ? "var(--bright)" : "var(--deep)",
                  opacity: on ? 1 : 0.6,
                  transition: `background 0.3s ${easing}, color 0.3s ${easing}, opacity 0.3s ${easing}`,
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── 02 · Drop your pin — a pin drops onto the map ─────────────────────── */
function DropPinDemo({ active }: { active: boolean }) {
  return (
    <div
      style={{
        height: DEMO_HEIGHT, borderRadius: 12, background: "var(--soft)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* faux streets */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "38%", height: 6, background: "color-mix(in srgb, var(--deep) 8%, transparent)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "62%", width: 6, background: "color-mix(in srgb, var(--deep) 8%, transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "22%", height: 5, background: "color-mix(in srgb, var(--deep) 8%, transparent)" }} />

      {/* drop shadow / target */}
      <div
        style={{
          position: "absolute", left: "44%", top: "62%",
          width: 14, height: 5, borderRadius: 999,
          background: "color-mix(in srgb, var(--deep) 28%, transparent)",
          transform: `translate(-50%,-50%) scaleX(${active ? 1 : 0.4})`,
          opacity: active ? 1 : 0,
          transition: `all 0.4s ${easing} 0.1s`,
        }}
      />
      {/* pin */}
      <div
        style={{
          position: "absolute", left: "44%", top: active ? "62%" : "12%",
          transform: "translate(-50%,-100%)",
          opacity: active ? 1 : 0,
          transition: "top 0.5s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.25s ease",
        }}
      >
        <MapPin size={28} fill="var(--deep)" color="var(--cream)" strokeWidth={1.5} />
      </div>

      <span style={{ ...monoLabel, position: "absolute", bottom: 9, left: 11, color: "var(--deep)", opacity: 0.55 }}>
        {active ? "Pin set · -7.782, 110.367" : "Click the map"}
      </span>
    </div>
  );
}

/* ── 03 · Set your impact radius — the radius ring scales with the slider ─ */
function RadiusDemo({ active }: { active: boolean }) {
  return (
    <div
      style={{
        height: DEMO_HEIGHT, borderRadius: 12, background: "var(--soft)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            position: "absolute", left: "50%", top: "50%",
            width: active ? 88 : 34, height: active ? 88 : 34,
            marginLeft: active ? -44 : -17, marginTop: active ? -44 : -17,
            borderRadius: 999, border: "1.5px dashed var(--deep)",
            background: "color-mix(in srgb, var(--bright) 22%, transparent)",
            transition: `all 0.5s ${easing}`,
          }}
        />
        <div
          style={{
            position: "absolute", left: "50%", top: "50%",
            width: 11, height: 11, marginLeft: -5.5, marginTop: -5.5,
            borderRadius: 999, background: "var(--deep)", border: "2px solid var(--cream)",
          }}
        />
      </div>
      <div style={{ padding: "0 0.85rem 0.8rem" }}>
        <div style={{ position: "relative", height: 5, borderRadius: 999, background: "var(--mist)" }}>
          <div
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: active ? "72%" : "20%", background: "var(--bright)", borderRadius: 999,
              transition: `width 0.5s ${easing}`,
            }}
          />
          <div
            style={{
              position: "absolute", top: "50%", left: active ? "72%" : "20%",
              width: 13, height: 13, marginTop: -6.5, marginLeft: -6.5,
              borderRadius: 999, background: "var(--bright)", border: "2px solid var(--deep)",
              transition: `left 0.5s ${easing}`,
            }}
          />
        </div>
        <div style={{ ...monoLabel, color: "var(--deep)", opacity: 0.55, marginTop: 7 }}>
          {active ? "Radius · 5.0 km" : "Drag to set radius"}
        </div>
      </div>
    </div>
  );
}

/* ── 04 · Read your dashboard — the report loads in ────────────────────── */
function DashboardDemo({ active }: { active: boolean }) {
  const bars = [68, 81, 45];
  return (
    <div
      style={{
        height: DEMO_HEIGHT, borderRadius: 12, background: "var(--deep)",
        padding: "0.75rem 0.85rem", display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ ...monoLabel, color: "var(--bright)", opacity: 0.7 }}>Business Viability Index</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em",
            color: "var(--bright)",
            opacity: active ? 1 : 0.25,
            transition: `opacity 0.4s ${easing}`,
          }}
        >
          {active ? 72 : "—"}
        </span>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, fontWeight: 500, color: "var(--cream)", opacity: 0.5 }}>
          /100
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: "auto" }}>
        {bars.map((v, idx) => (
          <div
            key={idx}
            style={{
              height: 5, borderRadius: 999, overflow: "hidden",
              background: "color-mix(in srgb, var(--bright) 18%, transparent)",
            }}
          >
            <div
              style={{
                height: "100%", width: active ? `${v}%` : "0%",
                background: "var(--bright)", borderRadius: 999,
                transition: `width 0.5s ${easing} ${idx * 0.08}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const stepPreviews = [
  DescribeBusinessDemo,
  DropPinDemo,
  RadiusDemo,
  DashboardDemo,
];
