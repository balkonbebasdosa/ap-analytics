import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { ZoneResult } from "@/types";
import ZoneActionModal from "./ZoneActionModal";

interface ZoneBannerProps {
  zone: ZoneResult;
}

type ZoneLabel = "MERAH" | "KUNING" | "HIJAU" | "UNKNOWN";

const CONFIG: Record<ZoneLabel, {
  bg: string; fg: string; pillBg: string;
  label: string; sublabel: string;
  desc: string; regulation: string;
  risk: string; actionLabel: string;
}> = {
  MERAH: {
    bg:      "var(--deep)",
    fg:      "var(--cream)",
    pillBg:  "color-mix(in srgb, var(--cream) 14%, transparent)",
    label:   "Zona Merah",
    sublabel: "Jalur Hijau / RTH — Kawasan Lindung",
    desc:    "Usaha komersial dilarang keras. Risiko penertiban Satpol PP dan pembongkaran paksa tanpa ganti rugi.",
    regulation: "Perda DKI No. 8/2007 · Pasal 38 — Kawasan Lindung & RTH",
    risk:    "DILARANG",
    actionLabel: "Lihat Opsi & Banding",
  },
  KUNING: {
    bg:      "var(--bright)",
    fg:      "var(--deep)",
    pillBg:  "color-mix(in srgb, var(--deep) 14%, transparent)",
    label:   "Zona Kuning",
    sublabel: "Kawasan Campuran — Izin Bersyarat",
    desc:    "Usaha komersial diperbolehkan dengan perizinan lengkap. Wajib memiliki NIB, IMB/PBG, dan SIUP sesuai peruntukan.",
    regulation: "Perda DKI No. 8/2007 · Peruntukan W4/K5 — Kawasan Campuran",
    risk:    "BERSYARAT",
    actionLabel: "Lihat Checklist Izin",
  },
  HIJAU: {
    bg:      "var(--deep)",
    fg:      "var(--cream)",
    pillBg:  "color-mix(in srgb, var(--cream) 14%, transparent)",
    label:   "Zona Hijau",
    sublabel: "Kawasan Komersial — Sesuai RDTR",
    desc:    "Lokasi sesuai peruntukan perdagangan dan jasa. Tetap lengkapi NIB, IMB/PBG, dan SIUP sebelum operasional.",
    regulation: "Perda DKI No. 8/2007 · Peruntukan K1/K3 — Perdagangan & Jasa",
    risk:    "DIIZINKAN",
    actionLabel: "Lihat Panduan Izin",
  },
  UNKNOWN: {
    bg:      "var(--cream)",
    fg:      "var(--deep)",
    pillBg:  "color-mix(in srgb, var(--deep) 12%, transparent)",
    label:   "Validasi Zonasi RDTR",
    sublabel: "Data Tidak Tersedia — Verifikasi Diperlukan",
    desc:    "Data RDTR belum tersedia untuk titik ini. Verifikasi manual ke portal RDTR Jakarta sebelum membuka usaha.",
    regulation: "RDTR DKI Jakarta · Portal: jakartasatu.jakarta.go.id",
    risk:    "TIDAK DIKETAHUI",
    actionLabel: "Panduan Verifikasi",
  },
};

const monoStyle: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: 700, letterSpacing: "0.12em",
  textTransform: "uppercase",
};

export default function ZoneBanner({ zone }: ZoneBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const cfg = CONFIG[zone.zone_label] ?? CONFIG.UNKNOWN;

  return (
    <>
      <div style={{
        background: cfg.bg,
        color: cfg.fg,
        transition: "background 0.3s var(--transition-color-easing)",
        borderBottom: `1px solid color-mix(in srgb, ${cfg.fg} 12%, transparent)`,
      }}>
        <div className="container" style={{
          padding: "1.1rem 0 1.2rem",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between",
          gap: "1rem",
        }}>

          {/* Left: labels + description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1, minWidth: 0 }}>
            {/* Eyebrow: regulation basis */}
            <span style={{
              ...monoStyle, fontSize: "0.66rem",
              color: cfg.fg, opacity: 0.55,
            }}>
              {cfg.regulation}
              {zone.zone_name && zone.zone_name !== "Tidak Ada Data" && (
                <span style={{ marginLeft: 8, opacity: 0.7 }}>· {zone.zone_name}</span>
              )}
            </span>

            {/* Main label row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span style={{
                ...monoStyle, fontSize: "0.8rem",
                color: cfg.fg,
              }}>
                {cfg.label}
              </span>
              {/* Risk badge */}
              <span style={{
                background: cfg.pillBg,
                color: cfg.fg,
                border: `1px solid ${cfg.fg}`,
                borderRadius: 999, padding: "2px 9px",
                ...monoStyle, fontSize: "0.62rem",
                opacity: 0.9,
              }}>
                {cfg.risk}
              </span>
            </div>

            {/* Sublabel */}
            <span style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em",
              color: cfg.fg, opacity: 0.72,
            }}>
              {cfg.sublabel}
            </span>

            {/* Description */}
            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300, fontStyle: "italic",
              fontSize: "0.8rem", lineHeight: 1.5,
              color: cfg.fg, opacity: 0.8, margin: 0,
              maxWidth: 640,
            }}>
              {cfg.desc}
            </p>
          </div>

          {/* Right: ratio pills + CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.6rem" }}>
            {/* Ratio pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
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
                    ...monoStyle, fontSize: "0.6rem",
                    opacity: 0.85,
                  }}
                >
                  {p.label}
                </span>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={() => setModalOpen(true)}
              style={{
                background: cfg.fg,
                color: cfg.bg,
                border: "none", cursor: "pointer",
                borderRadius: 999, padding: "8px 16px",
                ...monoStyle, fontSize: "0.65rem",
                display: "flex", alignItems: "center", gap: 5,
                transition: "opacity 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.82"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {cfg.actionLabel} <ChevronRight size={11} />
            </button>
          </div>

        </div>
      </div>

      {modalOpen && (
        <ZoneActionModal
          zoneLabel={zone.zone_label}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
