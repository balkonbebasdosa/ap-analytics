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
    period: "to start",
    blurb: "Everything you need to validate your first locations. No card required.",
    features: [
      "3 location analyses",
      "BVI viability score & breakdown",
      "AI-powered SWOT analysis",
      "Competitor map & ranked list",
      "Strategic roadmap",
    ],
    cta: "Get started free",
    href: "/auth?mode=register",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "Rp 25.000",
    period: "month",
    blurb: "For founders comparing many sites. Analyze as much as you need.",
    features: [
      "Unlimited location analyses",
      "Everything in Free",
      "Full analysis history",
      "Export reports to PDF",
      "Priority AI processing",
    ],
    cta: "Get started with Pro",
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
            <Link to="/#how"      className="mono-nav hover:opacity-60 nav-anchor">How</Link>
            <Link to="/#features" className="mono-nav hover:opacity-60 nav-anchor">Features</Link>
            <Link to="/pricing"   className="mono-nav nav-anchor">Pricing</Link>
            <Link to="/auth" className="mono-nav nav-anchor" style={{ opacity: 0.7 }}>Log in</Link>
            <HexButton as="a" href="/auth?mode=register" variant="solid">
              Get started <ArrowRight size={14} />
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
          Most popular
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
          <SectionEyebrow anchor="PRICING" label="Plans" />

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="display-hero"
            style={{ marginTop: "0.4rem" }}
          >
            Start free.<br />Upgrade when you scale.
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
            Two plans, one goal: making location decisions on data, not vibes.
            No hidden fees, cancel anytime.
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
            Prices in Indonesian Rupiah. Pro billing is monthly, cancel any time.
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
              Still deciding? Start with the free plan.
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
              Run your first three analyses on us. Upgrade to Pro the moment you need more.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.8rem" }}>
              <HexButton as="a" href="/auth?mode=register" variant="solid">
                Get started free <ArrowRight size={14} />
              </HexButton>
              <HexButton as="a" href="/" variant="outline">
                Back to home
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
            <Link to="/#how"      className="mono-nav hover:opacity-60">How</Link>
            <Link to="/#features" className="mono-nav hover:opacity-60">Features</Link>
            <Link to="/pricing"   className="mono-nav hover:opacity-60">Pricing</Link>
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
