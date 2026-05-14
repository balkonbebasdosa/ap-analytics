import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HexButton } from "@/components/ui/HexButton";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { SectionEyebrow, MonoLabel } from "@/components/ui/MonoLabel";
import { featurePreviews } from "@/components/landing/FeaturePreviews";
import { stepPreviews } from "@/components/landing/StepPreviews";

/* ──────────────────────────────────────────────────────────────────────────
   Content
   ────────────────────────────────────────────────────────────────────── */

const stats = [
  { value: "0.5–10km", label: "Jangkauan scan" },
  { value: "Real-time", label: "Data tempat" },
  { value: "0 IDR",    label: "Selamanya" },
];

const steps = [
  { num: "01", title: "Jelaskan bisnis Anda",   desc: "Kategori, konsep, dan produk unggulan. Kami tangkap gambaran bisnis Anda." },
  { num: "02", title: "Tandai lokasi Anda",     desc: "Tandai lokasi rencana di peta. Kami scan sekelilingnya." },
  { num: "03", title: "Tentukan radius dampak", desc: "Dari 0,5 km hingga 10 km — zona persaingan yang Anda pedulikan." },
  { num: "04", title: "Baca dashboard Anda",    desc: "Skor BVI, peta pesaing, SWOT, dan roadmap strategis — seketika." },
];

const features = [
  { num: "01", title: "Intelijen Lokasi",        desc: "Tandai pin dan langsung scan lanskap persaingan dalam radius pilihan Anda." },
  { num: "02", title: "Identifikasi Celah Anda", desc: "Menganalisis pesaing dan menghasilkan SWOT khusus bisnis Anda." },
  { num: "03", title: "Skor BVI",                desc: "Skor kelayakan prediktif berdasarkan kepadatan persaingan dan sinyal lokasi." },
  { num: "04", title: "Roadmap Strategis",       desc: "Langkah nyata soal diferensiasi, harga, dan alokasi anggaran pemasaran." },
  { num: "05", title: "Keputusan Berbasis Data", desc: "Data Google Places real-time — intelijen pesaing yang akurat, tanpa tebak-tebakan." },
  { num: "06", title: "Analitik Visual",         desc: "Grafik dan dashboard yang menyampaikan insight dalam sekejap." },
];

/* ──────────────────────────────────────────────────────────────────────────
   Decorative — floating BVI preview card
   ────────────────────────────────────────────────────────────────────── */
function FloatingScorePreview() {
  const pct = 54;
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -3 }}
      transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
      className="animate-float pointer-events-none absolute bottom-20 left-6 z-10 hidden lg:block xl:left-20"
      style={{
        width: 220,
        background: "var(--bright)",
        color: "var(--deep)",
        borderRadius: 20,
        padding: "1.1rem 1.1rem 0.95rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
        <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r={r} fill="none" stroke="color-mix(in srgb, var(--deep) 18%, transparent)" strokeWidth="12" />
            <circle
              cx="50" cy="50" r={r} fill="none"
              stroke="var(--deep)" strokeWidth="12"
              strokeLinecap="butt"
              strokeDasharray={`${dash} ${circ}`}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 800, fontSize: 14,
            color: "var(--deep)",
          }}>
            {pct}
          </div>
        </div>
        <div>
          <MonoLabel size="xs" tone="current">BVI Score</MonoLabel>
          <div style={{
            marginTop: 4,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 12, lineHeight: 1.3, fontWeight: 500,
            color: "var(--deep)",
          }}>
            Cukup layak — diferensiasi adalah kuncinya.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FloatingSticker() {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
      animate={{ opacity: 1, rotate: -6, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      className="animate-float-sticky pointer-events-none absolute right-8 top-24 z-10 hidden lg:block xl:right-24"
    >
      <span className="pill-mono" style={{ background: "var(--deep)", color: "var(--bright)" }}>
        gratis selamanya ✦
      </span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Top nav (marketing — only on landing)
   ────────────────────────────────────────────────────────────────────── */
function LandingNav() {
  return (
    <nav
      className="paper-surface"
      style={{
        position: "sticky", top: 0, zIndex: 50,
        padding: "0.7rem 0",
      }}
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
          <Link
            to="/"
            className="brand-logo"
            style={{ fontSize: "1.25rem", textDecoration: "none" }}
          >
            ap-analysis.
          </Link>

          <div className="landing-nav-actions" style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
            <a href="#how"      className="mono-nav hover:opacity-60 nav-anchor">Cara Kerja</a>
            <a href="#features" className="mono-nav hover:opacity-60 nav-anchor">Fitur</a>
            <a href="#start"    className="mono-nav hover:opacity-60 nav-anchor">Mulai</a>
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
   Step card — collapsed by default, expands on hover to reveal a demo
   ────────────────────────────────────────────────────────────────────── */
function StepCard({
  step, index, delay,
}: {
  step: { num: string; title: string; desc: string };
  index: number;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [textWidth, setTextWidth] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const Demo = stepPreviews[index];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Freeze the text column at the collapsed card width so it never reflows —
     when a card shrinks, the card edge clips the text instead of resizing it. */
  useLayoutEffect(() => {
    if (isMobile) { setTextWidth(null); return; }
    const measure = () => {
      const el = cardRef.current;
      if (!el || hovered) return;
      const cs = getComputedStyle(el);
      const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      setTextWidth(el.clientWidth - pad);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile, hovered]);

  /* On touch/mobile there's no hover — the demo is always shown, stacked below. */
  const expanded = isMobile || hovered;

  const textColStyle: React.CSSProperties = isMobile
    ? { flex: "0 0 auto", width: "100%" }
    : textWidth != null
      ? { flex: "0 0 auto", width: textWidth }
      : { flex: "1 1 0%", minWidth: 0 };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="compartment-inner step-card"
      style={{
        flex: isMobile ? "0 0 auto" : hovered ? "2.4 1 0%" : "1 1 0%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "1.2rem" : hovered ? "1.4rem" : "0rem",
        minHeight: isMobile ? "auto" : "16rem",
        overflow: "hidden",
        background: expanded ? "var(--soft)" : "var(--cream)",
        transition:
          "flex 0.4s var(--transition-color-easing), gap 0.4s var(--transition-color-easing), background 0.3s var(--transition-color-easing)",
        cursor: "default",
      }}
    >
      {/* Text column — frozen width on desktop so it clips rather than reflows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", ...textColStyle }}>
        <MonoLabel size="xs" tone="ink" style={{ opacity: 0.55 }}>{step.num}</MonoLabel>
        <div
          className="font-display"
          style={{
            fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: "var(--deep)",
          }}
        >
          {step.num}
        </div>
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "1.05rem",
            fontWeight: 600,
            lineHeight: 1.2,
            color: "var(--deep)",
          }}
        >
          {step.title}
        </div>
        <p className="serif-body" style={{ fontSize: "0.92rem", lineHeight: 1.5, opacity: 0.78 }}>
          {step.desc}
        </p>

        <div style={{ marginTop: isMobile ? "0.2rem" : "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--bright)", flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--deep)", opacity: 0.5,
          }}>
            {isMobile ? "Pratinjau langkah" : hovered ? "Pratinjau langsung" : "Arahkan untuk melihat"}
          </span>
        </div>
      </div>

      {/* Demo column — expands to the right on hover (desktop) / stacks below (mobile) */}
      <div
        style={{
          flex: isMobile ? "0 0 auto" : hovered ? "0 0 240px" : "0 0 0px",
          width: isMobile ? "100%" : "auto",
          display: "flex", alignItems: "center",
          overflow: "hidden",
          opacity: expanded ? 1 : 0,
          transition: "flex 0.4s var(--transition-color-easing), opacity 0.3s ease",
        }}
      >
        <div style={{ width: isMobile ? "100%" : 240 }}>
          <Demo active={expanded} />
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   LandingPage
   ────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
      <LandingNav />

      <main className="container compartment-stack--loose" style={{ display: "flex", flexDirection: "column", paddingTop: "1.5rem", paddingBottom: "1.5rem", gap: "clamp(1rem, 2vw, 1.6rem)" }}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          id="hero"
          className="compartment"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "var(--mist)",
            padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 3rem)",
            minHeight: "78vh",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <FloatingSticker />
          <FloatingScorePreview />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 10, maxWidth: 1100, textAlign: "center" }}
          >
            <div style={{ marginBottom: "2.2rem" }}>
              <span className="pill-mono" style={{ background: "var(--deep)", color: "var(--bright)" }}>
                <span style={{
                  display: "inline-block", width: 6, height: 6,
                  borderRadius: 999, background: "var(--bright)",
                }} />
                AI Intelijen Lokasi Bisnis
              </span>
            </div>

            <h1 className="display-hero">
              Tahu sebelum<br />kamu buka.
            </h1>

            <p
              className="serif-body"
              style={{
                marginTop: "2rem",
                maxWidth: 560,
                marginLeft: "auto",
                marginRight: "auto",
                color: "color-mix(in srgb, var(--deep) 75%, transparent)",
              }}
            >
              AP Analytics mengevaluasi lokasi bisnis Anda menggunakan data pesaing nyata
              dan wawasan strategis dari AI — sepenuhnya gratis.
            </p>

            <div
              style={{
                marginTop: "2rem",
                display: "flex", flexWrap: "wrap",
                alignItems: "center", justifyContent: "center",
                gap: "clamp(1.2rem, 3vw, 2.4rem)",
              }}
            >
              {[
                { src: "/images/ugmHitam.png", alt: "UGM", height: 48 },
                { src: "/images/DTETI.png", alt: "DTETI", height: 48 },
                { src: "/images/AiConnect.png", alt: "AI Connect", height: 32 },
                { src: "/images/FINDIT.png", alt: "FindIT", height: 48 },
              ].map((logo) => (
                <img
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  style={{ height: logo.height, width: "auto", objectFit: "contain" }}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: "3rem",
                display: "flex", flexWrap: "wrap",
                alignItems: "center", justifyContent: "center",
                gap: "0.8rem",
              }}
            >
              <HexButton as="a" href="/auth?mode=register" variant="solid">
                Mulai analisis gratis <ArrowRight size={14} />
              </HexButton>
              <HexButton as="a" href="#how" variant="outline">
                Cara kerjanya
              </HexButton>
            </div>

            {/* Stat strip — single compartment-inner with 4 nested wells */}
            <div
              className="compartment-inner"
              style={{
                marginTop: "4rem",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.6rem",
                background: "var(--cream)",
                padding: "0.8rem",
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="compartment-well"
                  style={{
                    padding: "1.1rem 1rem",
                    textAlign: "left",
                  }}
                >
                  <div
                    className="font-display"
                    style={{
                      fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      color: "var(--deep)",
                    }}
                  >
                    {s.value}
                  </div>
                  <MonoLabel size="xs" tone="ink" style={{ marginTop: "0.55rem", display: "block", opacity: 0.7 }}>
                    {s.label}
                  </MonoLabel>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── What it is ──────────────────────────────────────────────── */}
        <section id="about" className="compartment">
          <SectionEyebrow anchor="APA INI" label="01 / 04" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem, 4vw, 4rem)",
              alignItems: "start",
            }}
            className="about-grid"
          >
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="display-xl"
            >
              Mesin kelayakan prediktif untuk lokasi yang akan Anda pertaruhkan.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="compartment-inner"
              style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
            >
              <p className="serif-body" style={{ color: "var(--deep)" }}>
                AP Analytics mengubah pertanyaan rumit "apakah lokasi ini bagus?" menjadi
                satu angka, peta persaingan, dan rencana strategis yang bisa langsung dijalankan.
              </p>
              <p className="serif-body" style={{ color: "color-mix(in srgb, var(--deep) 72%, transparent)" }}>
                Dibuat untuk pendiri UMKM Indonesia yang tidak mampu menyewa konsultan riset pasar,
                tapi juga tidak bisa asal tebak. Tandai pin. Atur radius. Dapatkan semua yang
                biasanya ditagih oleh konsultan.
              </p>
              <div style={{ marginTop: "0.4rem" }}>
                <HexButton as="a" href="#start" variant="outline">
                  Lihat aksinya <ArrowUpRight size={14} />
                </HexButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────── */}
        <section id="how" className="compartment">
          <SectionEyebrow anchor="CARA KERJA" label="02 / 04" />

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="display-xl"
            style={{ maxWidth: 820, marginBottom: "2.4rem" }}
          >
            Empat langkah. Satu laporan. Sekitar satu menit.
          </motion.h2>

          <div
            style={{
              display: "flex",
              gap: "0.8rem",
              alignItems: "stretch",
            }}
            className="step-grid"
          >
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} delay={i * 0.06} />
            ))}
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────── */}
        <section id="features" className="compartment">
          <SectionEyebrow anchor="APA YANG ANDA DAPAT" label="03 / 04" />

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="display-xl"
            style={{ maxWidth: 820, marginBottom: "2.4rem" }}
          >
            Semua yang biasanya ditagih oleh konsultan lokasi.
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.8rem",
            }}
            className="feature-grid"
          >
            {features.map((f, i) => {
              const Preview = featurePreviews[i];
              return (
                <motion.div
                  key={f.num}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.06 }}
                  className="compartment-inner"
                  style={{
                    display: "flex", flexDirection: "column",
                    gap: "0.7rem",
                    transition: "transform 0.25s ease",
                  }}
                >
                  <MonoLabel size="xs" tone="ink" style={{ opacity: 0.55 }}>{f.num}</MonoLabel>
                  <h3
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      color: "var(--deep)",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p className="serif-body" style={{ fontSize: "0.92rem", opacity: 0.78 }}>
                    {f.desc}
                  </p>
                  {Preview && <Preview />}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── CTA / Start — the BRIGHT pop panel (rare emphasis) ──────── */}
        <section id="start" className="compartment-bright" style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="pill-mono"
              style={{
                background: "var(--deep)", color: "var(--bright)",
                marginBottom: "1.6rem",
              }}
            >
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--bright)" }} />
              MULAI SEKARANG · 04 / 04
            </span>
            <h2 className="display-hero" style={{ maxWidth: 1100, margin: "0 auto", color: "var(--deep)" }}>
              Analisis lokasi<br />Anda hari ini.
            </h2>
            <p
              className="serif-body"
              style={{
                marginTop: "1.6rem",
                maxWidth: 520,
                marginLeft: "auto",
                marginRight: "auto",
                color: "color-mix(in srgb, var(--deep) 78%, transparent)",
              }}
            >
              Gratis. Tanpa kartu kredit. Laporan instan. Bergabunglah dengan pendiri
              UMKM yang mengambil keputusan lokasi berdasarkan data, bukan perasaan.
            </p>
            <div
              style={{
                marginTop: "2.4rem",
                display: "flex", flexWrap: "wrap",
                justifyContent: "center", gap: "0.8rem",
              }}
            >
              <HexButton as="a" href="/auth?mode=register" variant="solid">
                Mulai gratis <ArrowRight size={14} />
              </HexButton>
              <HexButton
                as="a" href="/auth" variant="outline"
              >
                Masuk
              </HexButton>
            </div>
          </motion.div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────── */}
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
            <a href="#how"      className="mono-nav hover:opacity-60">Cara Kerja</a>
            <a href="#features" className="mono-nav hover:opacity-60">Fitur</a>
            <a href="#start"    className="mono-nav hover:opacity-60">Mulai</a>
          </div>
        </footer>

      </main>

      <style>{`
        @media (max-width: 1024px) {
          .step-grid    { flex-direction: column !important; }
          .step-card    { flex: 0 0 auto !important; }
          .feature-grid { grid-template-columns: 1fr 1fr !important; }
          .about-grid   { grid-template-columns: 1fr !important; gap: 1.4rem !important; }
        }
        @media (max-width: 768px) {
          .nav-anchor      { display: none !important; }
          .landing-footer  {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.7rem !important;
          }
        }
        @media (max-width: 640px) {
          .feature-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PaletteScope>
  );
}
