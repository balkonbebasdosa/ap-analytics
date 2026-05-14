import type { ZoneResult } from "@/types";

interface ZoneBannerProps {
  zone: ZoneResult;
}

const CONFIG = {
  MERAH: {
    bg:    "var(--deep)",
    fg:    "var(--cream)",
    pillBg: "color-mix(in srgb, var(--cream) 14%, transparent)",
    label:  "Zona Merah: Jalur Hijau / RTH",
    desc:   "Usaha komersial dilarang (Perda DKI No. 8/2007). Risiko penertiban Satpol PP.",
  },
  KUNING: {
    bg:    "var(--bright)",
    fg:    "var(--deep)",
    pillBg: "color-mix(in srgb, var(--deep) 14%, transparent)",
    label:  "Zona Kuning: Penggunaan Campuran",
    desc:   "Izin usaha komersial bersyarat. Pastikan IMB dan izin usaha sesuai peruntukan.",
  },
  HIJAU: {
    bg:    "var(--deep)",
    fg:    "var(--cream)",
    pillBg: "color-mix(in srgb, var(--cream) 14%, transparent)",
    label:  "Zona Hijau: Kawasan Komersial",
    desc:   "Lokasi sesuai RDTR untuk usaha perdagangan dan jasa. Aman dari risiko zonasi.",
  },
  UNKNOWN: {
    bg:    "var(--cream)",
    fg:    "var(--deep)",
    pillBg: "color-mix(in srgb, var(--deep) 12%, transparent)",
    label:  "Validasi Zonasi RDTR",
    desc:   "Data zonasi tidak tersedia. Verifikasi manual di portal RDTR Jakarta.",
  },
} as const;

export default function ZoneBanner({ zone }: ZoneBannerProps) {
  const cfg = CONFIG[zone.zone_label] ?? CONFIG.UNKNOWN;

  return (
    <div style={{
      background: cfg.bg,
      color: cfg.fg,
      transition: "background 0.3s var(--transition-color-easing)",
    }}>
      <div className="container" style={{
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between",
        gap: "1rem", padding: "0.9rem 0",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          <span style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: cfg.fg, opacity: 0.85,
          }}>
            {cfg.label}
            {zone.zone_name && zone.zone_name !== "Tidak Ada Data" && (
              <span style={{ marginLeft: 8, opacity: 0.6 }}> · {zone.zone_name}</span>
            )}
          </span>
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300, fontStyle: "italic",
            fontSize: "0.8rem", lineHeight: 1.45,
            color: cfg.fg, opacity: 0.78, margin: 0,
          }}>
            {cfg.desc}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
          {[
            { label: `RTH ${Math.round(zone.green_zone_ratio * 100)}%` },
            { label: `Komersial ${Math.round(zone.commercial_ratio * 100)}%` },
            { label: `Campuran ${Math.round(zone.mixed_use_ratio * 100)}%` },
          ].map((p) => (
            <span
              key={p.label}
              style={{
                background: cfg.pillBg,
                color: cfg.fg,
                border: `1px solid ${cfg.fg}`,
                borderRadius: 999, padding: "3px 10px",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
