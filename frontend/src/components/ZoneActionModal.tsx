import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckSquare, Square, AlertTriangle, MapPin, ChevronRight, ExternalLink } from "lucide-react";

type ZoneLabel = "MERAH" | "KUNING" | "HIJAU" | "UNKNOWN";

interface ZoneActionModalProps {
  zoneLabel: ZoneLabel;
  onClose: () => void;
}

/* ── Per-zone permit checklists ─────────────────────────────────────────── */
const PERMITS: Record<ZoneLabel, { id: string; label: string; note: string; url?: string }[]> = {
  MERAH: [],
  KUNING: [
    {
      id: "nib",
      label: "NIB (Nomor Induk Berusaha)",
      note: "Daftarkan usaha Anda di sistem OSS",
      url: "https://oss.go.id",
    },
    {
      id: "imbpbg",
      label: "IMB / PBG (Persetujuan Bangunan Gedung)",
      note: "Ajukan ke Dinas PKPUKP DKI Jakarta. Pastikan desain sesuai KDB & KLB zona campuran.",
    },
    {
      id: "siup",
      label: "SIUP / Izin Usaha Perdagangan",
      note: "Terbitkan melalui OSS setelah NIB aktif. Sesuaikan dengan KBLI bidang usaha.",
      url: "https://oss.go.id",
    },
    {
      id: "lingkungan",
      label: "Surat Pernyataan Pengelolaan Lingkungan (SPPL)",
      note: "Wajib untuk usaha skala kecil-menengah di kawasan campuran. Upload di sistem OSS.",
      url: "https://oss.go.id",
    },
    {
      id: "rekomtek",
      label: "Rekomendasi Teknis Dinas CKTRP",
      note: "Diperlukan jika kegiatan usaha mengubah fungsi ruang atau melibatkan renovasi fasad.",
      url: "https://cktrp.jakarta.go.id",
    },
  ],
  HIJAU: [
    {
      id: "nib",
      label: "NIB (Nomor Induk Berusaha)",
      note: "Daftarkan usaha Anda di sistem OSS",
      url: "https://oss.go.id",
    },
    {
      id: "imbpbg",
      label: "IMB / PBG (Persetujuan Bangunan Gedung)",
      note: "Proses di Dinas PKPUKP DKI Jakarta. Zona K1/K3 mendukung KDB tinggi untuk komersial.",
    },
    {
      id: "siup",
      label: "SIUP / Izin Usaha Perdagangan",
      note: "Terbitkan melalui OSS setelah NIB aktif. Sesuaikan dengan KBLI bidang usaha.",
      url: "https://oss.go.id",
    },
  ],
  UNKNOWN: [
    {
      id: "rdtr",
      label: "Verifikasi status zona ke portal RDTR",
      note: "Cek peruntukan lahan di peta resmi Jakarta",
      url: "https://jakartasatu.jakarta.go.id",
    },
    {
      id: "konsultasi",
      label: "Konsultasi langsung ke Dinas CKTRP DKI",
      note: "Bawa koordinat titik lokasi dan rencana bisnis.",
      url: "https://cktrp.jakarta.go.id",
    },
    {
      id: "nib",
      label: "Siapkan NIB (Nomor Induk Berusaha) via OSS",
      note: "NIB bisa disiapkan paralel sambil menunggu klarifikasi zona.",
      url: "https://oss.go.id",
    },
  ],
};

/* ── Per-zone appeal / action steps ─────────────────────────────────────── */
const APPEAL_STEPS: Record<ZoneLabel, { step: string; detail: string }[]> = {
  MERAH: [
    {
      step: "Kumpulkan dokumen bukti lokasi & rencana bisnis",
      detail: "Sertakan foto lokasi, rencana tapak, dan proyeksi penggunaan lahan.",
    },
    {
      step: "Ajukan permohonan Perubahan Peruntukan ke Dinas CKTRP",
      detail: "Dinas CKTRP DKI Jakarta (Jl. Abdul Muis No. 66). Proses minimal 3–6 bulan dan tidak dijamin.",
    },
    {
      step: "Ikut sesi konsultasi publik RDTR",
      detail: "Pemda DKI membuka konsultasi revisi RDTR berkala. Jadwal ada di situs Bappeda DKI.",
    },
    {
      step: "Pertimbangkan lokasi alternatif",
      detail: "Zona MERAH memiliki peluang banding yang sangat kecil. Lokasi zona HIJAU / KUNING lebih aman.",
    },
  ],
  KUNING: [
    {
      step: "Pastikan rencana usaha sesuai peruntukan K5 / W4",
      detail: "Jenis usaha harus masuk kategori yang diizinkan pada zona campuran sesuai RDTR.",
    },
    {
      step: "Ajukan KKPR (Kesesuaian Kegiatan Pemanfaatan Ruang)",
      detail: "Wajib untuk usaha yang membutuhkan perubahan fisik bangunan. Proses via sistem OSS.",
    },
    {
      step: "Jika ditolak, ajukan banding ke BKPRD DKI",
      detail: "Badan Koordinasi Penataan Ruang Daerah adalah lembaga banding untuk kasus zonasi.",
    },
  ],
  HIJAU: [
    {
      step: "Tidak ada banding yang diperlukan",
      detail: "Zona HIJAU sudah sesuai RDTR untuk usaha komersial. Fokus pada pengurusan izin operasional.",
    },
    {
      step: "Pastikan semua izin operasional terpenuhi",
      detail: "NIB, IMB/PBG, SIUP, dan izin sektoral khusus (mis. izin pangan jika F&B) harus aktif.",
    },
  ],
  UNKNOWN: [
    {
      step: "Jangan buka usaha sebelum status zona dikonfirmasi",
      detail: "Beroperasi di zona yang belum terverifikasi berisiko penertiban walaupun terlihat legal.",
    },
    {
      step: "Hubungi Dinas CKTRP DKI Jakarta",
      detail: "Telepon: (021) 3848490 · Alamat: Jl. Abdul Muis No. 66, Jakarta Pusat.",
    },
    {
      step: "Cek portal RDTR Jakarta",
      detail: "jakartasatu.jakarta.go.id · Masukkan koordinat untuk melihat peruntukan lahan.",
    },
  ],
};

const ZONE_COLOR: Record<ZoneLabel, { panel: string; ink: string; accent: string }> = {
  MERAH:   { panel: "var(--deep)",   ink: "var(--cream)",  accent: "var(--bright)" },
  KUNING:  { panel: "var(--bright)", ink: "var(--deep)",   accent: "var(--deep)" },
  HIJAU:   { panel: "var(--deep)",   ink: "var(--cream)",  accent: "var(--bright)" },
  UNKNOWN: { panel: "var(--soft)",   ink: "var(--deep)",   accent: "var(--deep)" },
};

const ZONE_TITLE: Record<ZoneLabel, string> = {
  MERAH:   "Zona Merah — Tindakan & Panduan",
  KUNING:  "Zona Kuning — Tindakan & Panduan",
  HIJAU:   "Zona Hijau — Tindakan & Panduan",
  UNKNOWN: "Status Zonasi Tidak Diketahui",
};

const monoStyle: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
  textTransform: "uppercase",
};

export default function ZoneActionModal({ zoneLabel, onClose }: ZoneActionModalProps) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const permits = PERMITS[zoneLabel];
  const appeals = APPEAL_STEPS[zoneLabel];
  const colors  = ZONE_COLOR[zoneLabel];

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    /* backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "color-mix(in srgb, var(--deep) 55%, transparent)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--cream)",
          borderRadius: 24,
          width: "100%", maxWidth: 680,
          maxHeight: "90vh", overflowY: "auto",
          display: "flex", flexDirection: "column",
          boxShadow: "0 24px 80px color-mix(in srgb, var(--deep) 30%, transparent)",
        }}
      >
        {/* header */}
        <div
          style={{
            background: colors.panel, color: colors.ink,
            borderRadius: "24px 24px 0 0",
            padding: "1.6rem 1.8rem 1.4rem",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ ...monoStyle, color: colors.ink, opacity: 0.7, marginBottom: "0.5rem" }}>
              PANDUAN TINDAKAN
            </div>
            <h2 style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em",
              color: colors.ink, margin: 0,
            }}>
              {ZONE_TITLE[zoneLabel]}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "color-mix(in srgb, currentColor 12%, transparent)",
              border: "none", cursor: "pointer",
              borderRadius: 999, padding: 8,
              color: colors.ink, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <div style={{ padding: "1.6rem 1.8rem", display: "flex", flexDirection: "column", gap: "1.8rem" }}>

          {/* ── Section A: Checklist Izin ─────────────────────────────────── */}
          {zoneLabel === "MERAH" ? (
            <div
              style={{
                background: "color-mix(in srgb, var(--deep) 8%, var(--cream))",
                border: "1px solid color-mix(in srgb, var(--deep) 18%, transparent)",
                borderRadius: 16, padding: "1.2rem 1.4rem",
                display: "flex", gap: "0.9rem",
              }}
            >
              <AlertTriangle size={18} style={{ color: "var(--deep)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ ...monoStyle, color: "var(--deep)", marginBottom: "0.5rem" }}>
                  Zona Dilarang — Tidak Ada Izin yang Tersedia
                </div>
                <p style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.9rem", lineHeight: 1.55, color: "var(--deep)", margin: 0,
                }}>
                  Kawasan ini ditetapkan sebagai Jalur Hijau / RTH berdasarkan <strong>Perda DKI No. 8/2007 Pasal 38</strong>.
                  Tidak ada mekanisme perizinan yang dapat mengizinkan usaha komersial di zona ini.
                  Pembukaan usaha berisiko penertiban Satpol PP dan pembongkaran paksa tanpa ganti rugi.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ ...monoStyle, color: "var(--deep)", marginBottom: "0.9rem" }}>
                A · Checklist Perizinan
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {permits.map((p) => {
                  const done = !!checked[p.id];
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggle(p.id)}
                      style={{
                        background: done
                          ? "color-mix(in srgb, var(--bright) 18%, var(--cream))"
                          : "var(--soft)",
                        border: `1px solid ${done ? "var(--bright)" : "color-mix(in srgb, var(--deep) 16%, transparent)"}`,
                        borderRadius: 12, padding: "0.85rem 1rem",
                        cursor: "pointer", textAlign: "left",
                        display: "flex", gap: "0.75rem", alignItems: "flex-start",
                        transition: "background 0.15s ease, border-color 0.15s ease",
                      }}
                    >
                      <div style={{ flexShrink: 0, marginTop: 1, color: done ? "var(--deep)" : "color-mix(in srgb, var(--deep) 40%, transparent)" }}>
                        {done ? <CheckSquare size={16} /> : <Square size={16} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap",
                        }}>
                          <span style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: "0.88rem", fontWeight: 600, color: "var(--deep)",
                            textDecoration: done ? "line-through" : "none",
                            opacity: done ? 0.6 : 1,
                          }}>
                            {p.label}
                          </span>
                          {p.url && !done && (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 3,
                                background: "var(--deep)", color: "var(--bright)",
                                borderRadius: 999, padding: "1px 8px",
                                fontFamily: "'Inter', system-ui, sans-serif",
                                fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                                textDecoration: "none",
                                flexShrink: 0,
                              }}
                            >
                              Buka <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                        <div style={{
                          fontFamily: "'Inter', system-ui, sans-serif",
                          fontSize: "0.78rem", lineHeight: 1.5,
                          color: "color-mix(in srgb, var(--deep) 65%, transparent)",
                          marginTop: "0.2rem",
                        }}>
                          {p.note}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Section B: Proses Banding / Tindakan ─────────────────────── */}
          <div>
            <div style={{ ...monoStyle, color: "var(--deep)", marginBottom: "0.9rem" }}>
              B · {zoneLabel === "HIJAU" ? "Langkah Berikutnya" : "Proses Banding & Tindakan"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {appeals.map((a, i) => {
                const isLast = i === appeals.length - 1;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex", gap: "0.8rem",
                      paddingBottom: isLast ? 0 : "1.2rem",
                      position: "relative",
                    }}
                  >
                    {!isLast && (
                      <div style={{
                        position: "absolute", left: 11, top: 24, bottom: 0,
                        width: 1.5, background: "color-mix(in srgb, var(--deep) 18%, transparent)",
                      }} />
                    )}
                    <div style={{
                      flexShrink: 0, zIndex: 1, position: "relative",
                      width: 24, height: 24, borderRadius: 999,
                      background: "var(--deep)", color: "var(--cream)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <div style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: "0.9rem", fontWeight: 600, color: "var(--deep)",
                        marginBottom: "0.25rem",
                      }}>
                        {a.step}
                      </div>
                      <div style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: "0.8rem", lineHeight: 1.55,
                        color: "color-mix(in srgb, var(--deep) 65%, transparent)",
                      }}>
                        {a.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Reference links ──────────────────────────────────────────── */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "0.5rem",
            padding: "0.85rem 1rem",
            background: "var(--soft)",
            borderRadius: 12,
          }}>
            <span style={{ ...monoStyle, fontSize: "0.6rem", color: "var(--deep)", opacity: 0.5, alignSelf: "center", marginRight: 4 }}>
              TAUTAN RESMI:
            </span>
            {[
              { label: "OSS", url: "https://oss.go.id" },
              { label: "RDTR Jakarta", url: "https://jakartasatu.jakarta.go.id" },
              { label: "Dinas CKTRP DKI", url: "https://cktrp.jakarta.go.id" },
              { label: "Perda No. 8/2007", url: "https://peraturan.bpk.go.id/Details/35432/perda-prov-dki-jakarta-no-8-tahun-2007" },
            ].map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: "var(--deep)", color: "var(--bright)",
                  borderRadius: 999, padding: "4px 10px",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                  textDecoration: "none",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {l.label} <ExternalLink size={8} />
              </a>
            ))}
          </div>

          {/* ── Section C: Cari Lokasi Lain ──────────────────────────────── */}
          <div
            style={{
              background: "var(--deep)",
              borderRadius: 16,
              padding: "1.4rem 1.6rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "1.2rem", flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
              <MapPin size={18} style={{ color: "var(--bright)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ ...monoStyle, color: "var(--bright)", marginBottom: "0.4rem" }}>
                  C · Cari Lokasi Lain
                </div>
                <p style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.85rem", lineHeight: 1.5,
                  color: "var(--cream)", margin: 0, maxWidth: 360,
                }}>
                  Tidak puas dengan lokasi ini? Jalankan analisis baru dengan titik lokasi yang berbeda.
                </p>
              </div>
            </div>
            <button
              onClick={() => { onClose(); navigate("/survey"); }}
              style={{
                background: "var(--bright)", color: "var(--deep)",
                border: "none", cursor: "pointer",
                borderRadius: 999, padding: "10px 20px",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
                display: "flex", alignItems: "center", gap: 6,
                whiteSpace: "nowrap",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Mulai Analisis Baru <ChevronRight size={13} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
