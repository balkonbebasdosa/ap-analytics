import { useState } from "react";
import { ExternalLink, ChevronRight, AlertTriangle, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import type { ZoneResult } from "@/types";
import ZoneActionModal from "./ZoneActionModal";

interface ZoneHeroSectionProps {
  zone: ZoneResult;
}

type ZoneLabel = "MERAH" | "KUNING" | "HIJAU" | "UNKNOWN";

/* ── Zone configuration ─────────────────────────────────────────────────── */
const ZONE_CONFIG: Record<ZoneLabel, {
  bg: string; fg: string; accentBg: string;
  riskBadge: string; riskBg: string;
  Icon: React.ElementType;
  title: string; subtitle: string;
  headline: string;
  regulation: string; regulationUrl: string;
  keyMessage: string;
  permits: string[];
  links: { label: string; url: string; note: string }[];
  actionLabel: string;
}> = {
  MERAH: {
    bg:         "#F87171",
    fg:         "#2B0F0F",
    accentBg:   "rgba(127, 29, 29, 0.12)",
    riskBadge:  "DILARANG",
    riskBg:     "#7F1D1D",
    Icon:       AlertTriangle,
    title:      "Zona Merah",
    subtitle:   "Jalur Hijau / Ruang Terbuka Hijau · Kawasan Lindung",
    headline:   "Usaha komersial dilarang di lokasi ini.",
    regulation: "Perda DKI No. 8/2007 · Pasal 38 · Kawasan Lindung & RTH",
    regulationUrl: "https://peraturan.bpk.go.id/Details/35432/perda-prov-dki-jakarta-no-8-tahun-2007",
    keyMessage: "Kawasan ini ditetapkan sebagai Ruang Terbuka Hijau (RTH) yang dilindungi. Tidak ada mekanisme perizinan yang dapat mengizinkan kegiatan usaha komersial di zona ini. Beroperasi di sini berisiko penertiban oleh Satpol PP dan pembongkaran paksa tanpa ganti rugi.",
    permits:    [],
    links: [
      { label: "Perda DKI No. 8/2007", url: "https://peraturan.bpk.go.id/Details/35432/perda-prov-dki-jakarta-no-8-tahun-2007", note: "Teks lengkap peraturan zonasi DKI Jakarta" },
      { label: "Portal RDTR Jakarta", url: "https://jakartasatu.jakarta.go.id", note: "Cek peruntukan lahan secara mandiri" },
      { label: "Dinas CKTRP DKI", url: "https://cktrp.jakarta.go.id", note: "Konsultasi resmi perubahan peruntukan" },
    ],
    actionLabel: "Lihat Opsi & Proses Banding",
  },
  KUNING: {
    bg:         "#FACC15",
    fg:         "#2F2600",
    accentBg:   "rgba(113, 63, 18, 0.14)",
    riskBadge:  "BERSYARAT",
    riskBg:     "#713F12",
    Icon:       AlertCircle,
    title:      "Zona Kuning",
    subtitle:   "Kawasan Penggunaan Campuran · Izin Komersial Bersyarat",
    headline:   "Usaha diizinkan dengan perizinan lengkap.",
    regulation: "Perda DKI No. 8/2007 · Peruntukan W4/K5 · Kawasan Campuran",
    regulationUrl: "https://peraturan.bpk.go.id/Details/35432/perda-prov-dki-jakarta-no-8-tahun-2007",
    keyMessage: "Lokasi ini berada di kawasan campuran yang mengizinkan kegiatan komersial dengan syarat perizinan terpenuhi. Pastikan NIB, IMB/PBG, dan SIUP aktif sebelum membuka usaha. Izin dapat dicabut jika penggunaan tidak sesuai rencana tapak.",
    permits:    ["NIB via OSS (oss.go.id)", "IMB / PBG · Dinas PKPUKP DKI", "SIUP sesuai KBLI bidang usaha", "SPPL (Surat Pernyataan Lingkungan)"],
    links: [
      { label: "Sistem OSS (NIB)", url: "https://oss.go.id", note: "Daftar NIB dan izin usaha secara online" },
      { label: "Portal RDTR Jakarta", url: "https://jakartasatu.jakarta.go.id", note: "Verifikasi peruntukan zona secara mandiri" },
      { label: "Perda DKI No. 8/2007", url: "https://peraturan.bpk.go.id/Details/35432/perda-prov-dki-jakarta-no-8-tahun-2007", note: "Dasar hukum peruntukan lahan DKI" },
    ],
    actionLabel: "Lihat Checklist Izin Lengkap",
  },
  HIJAU: {
    bg:         "#86EFAC",
    fg:         "#12351F",
    accentBg:   "rgba(22, 101, 52, 0.14)",
    riskBadge:  "DIIZINKAN",
    riskBg:     "#166534",
    Icon:       CheckCircle,
    title:      "Zona Hijau",
    subtitle:   "Kawasan Komersial · Sesuai RDTR untuk Usaha Perdagangan & Jasa",
    headline:   "Lokasi ini sesuai peruntukan komersial.",
    regulation: "Perda DKI No. 8/2007 · Peruntukan K1/K3 · Perdagangan & Jasa",
    regulationUrl: "https://peraturan.bpk.go.id/Details/35432/perda-prov-dki-jakarta-no-8-tahun-2007",
    keyMessage: "Kawasan ini ditetapkan untuk kegiatan perdagangan dan jasa berdasarkan RDTR DKI Jakarta. Risiko zonasi sangat rendah. Tetap lengkapi semua perizinan operasional sebelum membuka usaha. Kepatuhan izin melindungi usaha Anda dari penutupan.",
    permits:    ["NIB via OSS (oss.go.id)", "IMB / PBG · Dinas PKPUKP DKI", "SIUP sesuai KBLI bidang usaha"],
    links: [
      { label: "Sistem OSS (NIB)", url: "https://oss.go.id", note: "Daftar NIB dan izin usaha secara online" },
      { label: "Portal RDTR Jakarta", url: "https://jakartasatu.jakarta.go.id", note: "Konfirmasi peruntukan zona lokasi Anda" },
      { label: "Perda DKI No. 8/2007", url: "https://peraturan.bpk.go.id/Details/35432/perda-prov-dki-jakarta-no-8-tahun-2007", note: "Teks lengkap peraturan zonasi DKI Jakarta" },
    ],
    actionLabel: "Lihat Panduan Izin Operasional",
  },
  UNKNOWN: {
    bg:         "var(--soft)",
    fg:         "var(--deep)",
    accentBg:   "color-mix(in srgb, var(--deep) 8%, transparent)",
    riskBadge:  "TIDAK DIKETAHUI",
    riskBg:     "var(--deep)",
    Icon:       HelpCircle,
    title:      "Validasi Zonasi Diperlukan",
    subtitle:   "Data RDTR Tidak Tersedia · Verifikasi Manual Dibutuhkan",
    headline:   "Status zona lokasi ini belum dapat ditentukan.",
    regulation: "RDTR DKI Jakarta · Portal: jakartasatu.jakarta.go.id",
    regulationUrl: "https://jakartasatu.jakarta.go.id",
    keyMessage: "Data RDTR tidak tersedia untuk titik ini. Jangan buka usaha sebelum status zona dikonfirmasi. Beroperasi di zona yang belum terverifikasi berisiko penertiban walaupun terlihat legal. Verifikasi ke portal RDTR Jakarta atau konsultasi langsung ke Dinas CKTRP DKI Jakarta.",
    permits:    ["Verifikasi status zona ke portal RDTR", "Konsultasi ke Dinas CKTRP DKI Jakarta", "Siapkan NIB via OSS secara paralel"],
    links: [
      { label: "Portal RDTR Jakarta", url: "https://jakartasatu.jakarta.go.id", note: "Masukkan koordinat untuk cek peruntukan" },
      { label: "Sistem OSS (NIB)", url: "https://oss.go.id", note: "Siapkan NIB sambil menunggu konfirmasi zona" },
      { label: "Dinas CKTRP DKI", url: "https://cktrp.jakarta.go.id", note: "Konsultasi resmi status peruntukan lahan" },
    ],
    actionLabel: "Panduan Verifikasi & Langkah Selanjutnya",
  },
};

const monoStyle: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: 700, letterSpacing: "0.12em",
  textTransform: "uppercase",
};

export default function ZoneHeroSection({ zone }: ZoneHeroSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const cfg = ZONE_CONFIG[zone.zone_label] ?? ZONE_CONFIG.UNKNOWN;
  const { Icon } = cfg;

  return (
    <>
      <section
        className="compartment"
        style={{
          background: cfg.bg,
          color: cfg.fg,
          transition: "background 0.3s var(--transition-color-easing)",
        }}
      >
        {/* ── Top row: eyebrow + risk badge ─────────────────────────────── */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: "0.8rem",
          marginBottom: "1.8rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexWrap: "wrap" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: cfg.accentBg,
              color: cfg.fg,
              borderRadius: 999, padding: "0.35rem 0.9rem",
              ...monoStyle, fontSize: "0.68rem",
            }}>
              VALIDASI ZONASI RDTR · {zone.zone_label}
            </span>
            <span style={{
              background: cfg.riskBg,
              color: "var(--cream)",
              borderRadius: 999, padding: "0.35rem 0.9rem",
              ...monoStyle, fontSize: "0.65rem",
            }}>
              {cfg.riskBadge}
            </span>
          </div>
          <a
            href={cfg.regulationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              color: cfg.fg, opacity: 0.6,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", textDecoration: "none",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; }}
          >
            {cfg.regulation} <ExternalLink size={10} />
          </a>
        </div>

        {/* ── Main content: icon + title + message ─────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(1.5rem, 3vw, 3rem)",
          alignItems: "start",
        }} className="zone-hero-grid">

          {/* Left column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.8rem" }}>
              <Icon size={28} style={{ color: cfg.riskBg, flexShrink: 0 }} />
              <div>
                <h2 style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.035em",
                  color: cfg.fg, margin: 0,
                }}>
                  {cfg.title}
                </h2>
                <div style={{
                  ...monoStyle, fontSize: "0.65rem",
                  color: cfg.fg, opacity: 0.6,
                  marginTop: "0.4rem",
                }}>
                  {cfg.subtitle}
                  {zone.zone_name && zone.zone_name !== "Tidak Ada Data" && (
                    <span style={{ marginLeft: 6 }}>· {zone.zone_name}</span>
                  )}
                </div>
              </div>
            </div>

            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)", fontWeight: 500,
              lineHeight: 1.6, letterSpacing: "-0.005em",
              color: cfg.fg, opacity: 0.9, margin: "0 0 1.6rem",
              maxWidth: 520,
            }}>
              {cfg.keyMessage}
            </p>

            {/* Zone ratio pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {[
                { label: `RTH ${Math.round(zone.green_zone_ratio * 100)}%` },
                { label: `Komersial ${Math.round(zone.commercial_ratio * 100)}%` },
                { label: `Campuran ${Math.round(zone.mixed_use_ratio * 100)}%` },
              ].map((p) => (
                <span
                  key={p.label}
                  style={{
                    background: cfg.accentBg,
                    color: cfg.fg,
                    border: `1px solid color-mix(in srgb, ${cfg.fg} 22%, transparent)`,
                    borderRadius: 999, padding: "3px 10px",
                    ...monoStyle, fontSize: "0.6rem", opacity: 0.85,
                  }}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Permits summary */}
            {cfg.permits.length > 0 && (
              <div style={{
                background: cfg.accentBg,
                borderRadius: 16, padding: "1.2rem 1.4rem",
              }}>
                <div style={{ ...monoStyle, fontSize: "0.65rem", color: cfg.fg, opacity: 0.65, marginBottom: "0.8rem" }}>
                  {zone.zone_label === "HIJAU" ? "Izin yang tetap diperlukan" : "Izin yang dibutuhkan"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {cfg.permits.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: 999, flexShrink: 0,
                        background: cfg.riskBg,
                      }} />
                      <span style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: 13, fontWeight: 500, color: cfg.fg, opacity: 0.88,
                      }}>
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gov reference links */}
            <div style={{
              background: cfg.accentBg,
              borderRadius: 16, padding: "1.2rem 1.4rem",
            }}>
              <div style={{ ...monoStyle, fontSize: "0.65rem", color: cfg.fg, opacity: 0.65, marginBottom: "0.8rem" }}>
                Referensi resmi
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {cfg.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "0.6rem",
                      textDecoration: "none",
                      transition: "opacity 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <ExternalLink size={12} style={{ color: cfg.fg, flexShrink: 0, marginTop: 2, opacity: 0.6 }} />
                    <div>
                      <div style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: 13, fontWeight: 700, color: cfg.fg,
                        letterSpacing: "0.01em",
                      }}>
                        {link.label}
                      </div>
                      <div style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: 11, color: cfg.fg, opacity: 0.6,
                        marginTop: 1,
                      }}>
                        {link.note}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => setModalOpen(true)}
              style={{
                background: cfg.riskBg,
                color: "var(--cream)",
                border: "none", cursor: "pointer",
                borderRadius: 999, padding: "12px 22px",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 7,
                alignSelf: "flex-start",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {cfg.actionLabel} <ChevronRight size={13} />
            </button>

          </div>
        </div>
      </section>

      {modalOpen && (
        <ZoneActionModal
          zoneLabel={zone.zone_label}
          onClose={() => setModalOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 800px) {
          .zone-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
