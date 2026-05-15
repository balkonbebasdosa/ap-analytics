import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { HexButton } from "@/components/ui/HexButton";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { SectionEyebrow, MonoLabel } from "@/components/ui/MonoLabel";

/* ──────────────────────────────────────────────────────────────────────────
   Content
   ────────────────────────────────────────────────────────────────────── */
const tiers = [
  {
    id: "free",
    name: "Free",
    price: "Rp 0",
    period: "untuk mulai",
    blurb: "Semua yang kamu butuhkan untuk memvalidasi lokasi pertamamu. Tanpa kartu kredit.",
    features: [
      "3 analisis lokasi",
      "Skor kelayakan BVI & rincian",
      "Analisis SWOT berbasis AI",
      "Peta pesaing & daftar ranking",
      "Peta jalan strategis",
    ],
    cta: "Mulai gratis",
    href: "/auth?mode=register",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "Rp 25.000",
    period: "bulan",
    blurb: "Untuk pendiri yang membandingkan banyak lokasi. Analisis sebanyak yang kamu butuhkan.",
    features: [
      "Analisis lokasi tak terbatas",
      "Semua fitur di Free",
      "Riwayat analisis lengkap",
      "Ekspor laporan ke PDF",
      "Pemrosesan AI prioritas",
    ],
    cta: "Mulai dengan Pro",
    href: "/auth?mode=register",
    featured: true,
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Top nav (marketing)
   ────────────────────────────────────────────────────────────────────── */
function PricingNav() {
  return (
    <nav
      className="paper-surface"
      style={{ position: "sticky", top: 0, zIndex: 50, padding: "0.7rem 0" }}
    >
      <div className="container">
        <div
          className="compartment-well"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.55rem 0.9rem 0.55rem 1.4rem",
            background: "var(--mist)",
            borderRadius: 999,
          }}
        >
          <Link to="/" className="brand-logo" style={{ fontSize: "1.25rem", textDecoration: "none" }}>
            ap-analysis.
          </Link>

          <div className="landing-nav-actions" style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
            <Link to="/#how"      className="mono-nav hover:opacity-60 nav-anchor">Cara Kerja</Link>
            <Link to="/#features" className="mono-nav hover:opacity-60 nav-anchor">Fitur</Link>
            <Link to="/pricing"   className="mono-nav nav-anchor">Harga</Link>
            <Link to="/about"     className="mono-nav hover:opacity-60 nav-anchor">Tentang</Link>
            <Link to="/auth" className="mono-nav nav-anchor" style={{ opacity: 0.7 }}>Masuk</Link>
            <HexButton as="a" href="/auth?mode=register" variant="solid">
              Mulai sekarang <ArrowRight size={14} />
            </HexButton>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Pricing card
   ────────────────────────────────────────────────────────────────────── */
function PricingCard({ tier, delay }: { tier: (typeof tiers)[number]; delay: number }) {
  const featured = tier.featured;
  const ink = "var(--deep)";
  const subInk = "color-mix(in srgb, var(--deep) 72%, transparent)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={featured ? "compartment-bright" : "compartment-inner"}
      style={{
        display: "flex", flexDirection: "column",
        padding: "clamp(1.8rem, 3.5vw, 2.6rem)",
        position: "relative",
      }}
    >
      {featured && (
        <span
          className="pill-mono"
          style={{
            position: "absolute", top: "clamp(1.8rem, 3.5vw, 2.6rem)", right: "clamp(1.8rem, 3.5vw, 2.6rem)",
            background: "var(--deep)", color: "var(--bright)",
          }}
        >
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--bright)" }} />
          Paling populer
        </span>
      )}

      <MonoLabel size="md" tone="ink" letterSpacing="0.18em" style={{ opacity: 0.65 }}>
        {tier.name}
      </MonoLabel>

      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "1.2rem" }}>
        <span
          className="font-display"
          style={{
            fontSize: "clamp(2.6rem, 5vw, 3.6rem)",
            fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em",
            color: ink,
          }}
        >
          {tier.price}
        </span>
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.95rem", fontWeight: 600,
            color: subInk,
          }}
        >
          /{tier.period}
        </span>
      </div>

      <p
        className="serif-body"
        style={{ marginTop: "0.9rem", color: subInk, minHeight: "3rem" }}
      >
        {tier.blurb}
      </p>

      <hr
        style={{
          border: "none",
          borderTop: `1px solid ${featured ? "color-mix(in srgb, var(--deep) 18%, transparent)" : "color-mix(in srgb, var(--deep) 12%, transparent)"}`,
          margin: "1.6rem 0",
        }}
      />

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.8rem", flex: 1 }}>
        {tier.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
            <span
              style={{
                flexShrink: 0,
                width: 20, height: 20, borderRadius: 999,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: featured ? "var(--deep)" : "var(--bright)",
                color: featured ? "var(--bright)" : "var(--deep)",
                marginTop: 1,
              }}
            >
              <Check size={12} strokeWidth={3} />
            </span>
            <span
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "0.95rem", fontWeight: 500, lineHeight: 1.4,
                color: ink,
              }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <HexButton
          as="a"
          href={tier.href}
          variant={featured ? "solid" : "outline"}
        >
          {tier.cta} <ArrowRight size={14} />
        </HexButton>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PricingPage
   ────────────────────────────────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
      <PricingNav />

      <main
        className="container compartment-stack--loose"
        style={{
          display: "flex", flexDirection: "column",
          paddingTop: "1.5rem", paddingBottom: "1.5rem",
          gap: "clamp(1rem, 2vw, 1.6rem)",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <section className="compartment" style={{ textAlign: "center" }}>
          <SectionEyebrow anchor="HARGA" label="Paket" />

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="display-hero"
            style={{ marginTop: "0.4rem" }}
          >
            Mulai gratis.<br />Tingkatkan saat kamu berkembang.
          </motion.h1>

          <p
            className="serif-body"
            style={{
              marginTop: "1.6rem",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
              color: "color-mix(in srgb, var(--deep) 75%, transparent)",
            }}
          >
            Dua paket, satu tujuan: keputusan lokasi berdasarkan data, bukan insting.
            Tanpa biaya tersembunyi, batalkan kapan saja.
          </p>
        </section>

        {/* ── Tiers ──────────────────────────────────────────────────────── */}
        <section className="compartment">
          <div
            className="pricing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.8rem",
              alignItems: "stretch",
            }}
          >
            {tiers.map((tier, i) => (
              <PricingCard key={tier.id} tier={tier} delay={i * 0.08} />
            ))}
          </div>

          <p
            style={{
              marginTop: "1.4rem",
              textAlign: "center",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.82rem", fontWeight: 500,
              color: "color-mix(in srgb, var(--deep) 60%, transparent)",
            }}
          >
            Harga dalam Rupiah Indonesia. Tagihan Pro bulanan, batalkan kapan saja.
          </p>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="compartment-bright" style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-xl" style={{ maxWidth: 720, margin: "0 auto", color: "var(--deep)" }}>
              Masih ragu? Mulai dengan paket gratis.
            </h2>
            <p
              className="serif-body"
              style={{
                marginTop: "1.2rem",
                maxWidth: 480,
                marginLeft: "auto",
                marginRight: "auto",
                color: "color-mix(in srgb, var(--deep) 78%, transparent)",
              }}
            >
              Jalankan tiga analisis pertamamu secara gratis. Tingkatkan ke Pro saat kamu butuh lebih.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.8rem" }}>
              <HexButton as="a" href="/auth?mode=register" variant="solid">
                Mulai gratis <ArrowRight size={14} />
              </HexButton>
              <HexButton as="a" href="/" variant="outline">
                Kembali ke beranda
              </HexButton>
            </div>
          </motion.div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer
          className="compartment-well landing-footer"
          style={{
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between",
            gap: "1rem", padding: "1rem 1.6rem",
          }}
        >
          <span className="brand-logo" style={{ fontSize: "1.15rem" }}>
            ap-analysis.
          </span>
          <MonoLabel size="xs" tone="ink" style={{ opacity: 0.6 }}>
            © 2026 AP Analytics · Team Balkon · FindIT! 2026
          </MonoLabel>
          <div style={{ display: "flex", gap: "1.4rem" }}>
            <Link to="/#how"      className="mono-nav hover:opacity-60">Cara Kerja</Link>
            <Link to="/#features" className="mono-nav hover:opacity-60">Fitur</Link>
            <Link to="/pricing"   className="mono-nav hover:opacity-60">Harga</Link>
            <Link to="/about"     className="mono-nav hover:opacity-60">Tentang</Link>
          </div>
        </footer>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .pricing-grid   { grid-template-columns: 1fr !important; }
          .landing-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.7rem !important;
          }
        }
      `}</style>
    </PaletteScope>
  );
}
