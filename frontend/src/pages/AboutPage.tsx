import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import { HexButton } from "@/components/ui/HexButton";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { SectionEyebrow, MonoLabel } from "@/components/ui/MonoLabel";

/* ──────────────────────────────────────────────────────────────────────────
   Content — founder names/roles are placeholders, swap with real data.
   ────────────────────────────────────────────────────────────────────── */
const founders = [
  { name: "Nama Pendiri 1", role: "Co-Founder" },
  { name: "Nama Pendiri 2", role: "Co-Founder" },
  { name: "Nama Pendiri 3", role: "Co-Founder" },
  { name: "Nama Pendiri 4", role: "Co-Founder" },
  { name: "Nama Pendiri 5", role: "Co-Founder" },
];

/* ──────────────────────────────────────────────────────────────────────────
   Top nav (marketing)
   ────────────────────────────────────────────────────────────────────── */
function AboutNav() {
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
            <Link to="/pricing"   className="mono-nav hover:opacity-60 nav-anchor">Harga</Link>
            <Link to="/about"     className="mono-nav nav-anchor">Tentang</Link>
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
   Founder card — photo frame placeholder + name + role
   ────────────────────────────────────────────────────────────────────── */
function FounderCard({ founder, delay }: { founder: (typeof founders)[number]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="compartment-inner"
      style={{ display: "flex", flexDirection: "column", gap: "0.9rem", padding: "1rem" }}
    >
      {/* Photo frame placeholder — swap for an <img> when photos are ready */}
      <div
        style={{
          aspectRatio: "1 / 1",
          borderRadius: 14,
          background: "var(--soft)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <User size={44} strokeWidth={1.5} style={{ color: "var(--deep)", opacity: 0.28 }} />
      </div>

      <div>
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "1rem", fontWeight: 700, lineHeight: 1.2,
            color: "var(--deep)",
          }}
        >
          {founder.name}
        </div>
        <MonoLabel size="xs" tone="ink" style={{ opacity: 0.6, marginTop: 5, display: "block" }}>
          {founder.role}
        </MonoLabel>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   AboutPage
   ────────────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
      <AboutNav />

      <main
        className="container compartment-stack--loose"
        style={{
          display: "flex", flexDirection: "column",
          paddingTop: "1.5rem", paddingBottom: "1.5rem",
          gap: "clamp(1rem, 2vw, 1.6rem)",
        }}
      >
        {/* ── Company ────────────────────────────────────────────────────── */}
        <section className="compartment">
          <SectionEyebrow anchor="TENTANG KAMI" label="Profil" />

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="display-hero"
            style={{ marginTop: "0.4rem", maxWidth: 900 }}
          >
            Keputusan lokasi,<br />bukan tebakan.
          </motion.h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginTop: "1.8rem", maxWidth: 640 }}>
            <p className="serif-body" style={{ color: "var(--deep)" }}>
              AP Analytics lahir dari satu pertanyaan sederhana: bagaimana jika pemilik UMKM
              bisa tahu apakah sebuah lokasi layak sebelum mereka membuka usaha? Kami membangun
              alat bantu keputusan berbasis AI yang mengubah pertanyaan rumit "apakah lokasi ini
              bagus?" menjadi satu skor, satu peta persaingan, dan satu rencana strategis yang
              bisa langsung dijalankan.
            </p>
            <p className="serif-body" style={{ color: "color-mix(in srgb, var(--deep) 72%, transparent)" }}>
              Dibangun oleh Team Balkon untuk FindIT! 2026, AP Analytics dirancang khusus untuk
              pendiri UMKM Indonesia yang tidak punya anggaran riset pasar, tapi juga tidak bisa
              mengandalkan tebakan.
            </p>
          </div>
        </section>

        {/* ── Founders ───────────────────────────────────────────────────── */}
        <section className="compartment">
          <SectionEyebrow anchor="TIM PENDIRI" label="5 Orang" />

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="display-xl"
            style={{ maxWidth: 720, marginBottom: "2.4rem" }}
          >
            Lima orang di balik AP Analytics.
          </motion.h2>

          <div
            className="founders-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "0.8rem",
            }}
          >
            {founders.map((f, i) => (
              <FounderCard key={i} founder={f} delay={i * 0.06} />
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="compartment-bright" style={{ textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="display-xl" style={{ maxWidth: 720, margin: "0 auto", color: "var(--deep)" }}>
              Coba AP Analytics hari ini.
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
              Jalankan analisis lokasi pertama Anda gratis. Tanpa kartu kredit.
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
            <Link to="/#how"    className="mono-nav hover:opacity-60">Cara Kerja</Link>
            <Link to="/pricing" className="mono-nav hover:opacity-60">Harga</Link>
            <Link to="/about"   className="mono-nav hover:opacity-60">Tentang</Link>
          </div>
        </footer>
      </main>

      <style>{`
        @media (max-width: 768px) {
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
