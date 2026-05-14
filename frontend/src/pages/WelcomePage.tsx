import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { ArrowRight } from "lucide-react";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { HexButton } from "@/components/ui/HexButton";
import { MonoLabel, SectionEyebrow } from "@/components/ui/MonoLabel";

const STEPS = [
  { num: "01", title: "Business identity",   desc: "Tell us about your business category, concept, and key offerings." },
  { num: "02", title: "Products & goals",    desc: "List what you sell with prices, and pick the strategic goals to optimize for." },
  { num: "03", title: "Location & radius",   desc: "Drop a pin and set the competitive zone, anywhere from 0.5 km to 10 km." },
  { num: "04", title: "AI analysis",         desc: "Our AI scans competitors and generates your full analytics report." },
];

export default function WelcomePage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
      <Navbar />

      <main className="container" style={{
        display: "flex", flexDirection: "column",
        gap: "clamp(1rem, 2vw, 1.6rem)",
        paddingTop: "1.5rem", paddingBottom: "3rem",
      }}>

        {/* ── Hero compartment ─────────────────────────────────────────── */}
        <section className="compartment">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionEyebrow anchor="AI BUSINESS LOCATION SURVEYOR" />

            <h1 className="display-hero" style={{ textAlign: "left", maxWidth: 1100 }}>
              Welcome back,<br />
              <span style={{ color: "var(--bright)" }}>{firstName}</span>.
            </h1>

            <p className="serif-body" style={{
              marginTop: "1.6rem", maxWidth: 600,
              color: "color-mix(in srgb, var(--deep) 75%, transparent)",
            }}>
              Run a new analysis or pick up where you left off. Each consult takes
              about a minute end-to-end.
            </p>

            <div style={{
              marginTop: "2rem",
              display: "flex", flexWrap: "wrap", gap: "0.8rem",
            }}>
              <HexButton as="a" href="/survey" variant="solid">
                Start new consult <ArrowRight size={14} />
              </HexButton>
              <HexButton as="a" href="/history" variant="outline">
                Past consults
              </HexButton>
            </div>
          </motion.div>
        </section>

        {/* ── Steps compartment ────────────────────────────────────────── */}
        <section className="compartment">
          <SectionEyebrow anchor="HOW A CONSULT FLOWS" label="01 / 01" />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.8rem",
          }} className="welcome-steps">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="compartment-inner"
                style={{
                  display: "flex", flexDirection: "column",
                  gap: "1rem", minHeight: "15rem",
                }}
              >
                <MonoLabel size="xs" tone="ink" style={{ opacity: 0.55 }}>{step.num}</MonoLabel>
                <div className="font-display" style={{
                  fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                  fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em",
                  color: "var(--deep)",
                }}>
                  {step.num}
                </div>
                <h3 style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.2,
                  letterSpacing: "-0.01em", color: "var(--deep)",
                }}>
                  {step.title}
                </h3>
                <p className="serif-body" style={{ fontSize: "0.92rem", opacity: 0.78 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      <style>{`
        @media (max-width: 1024px) { .welcome-steps { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px)  { .welcome-steps { grid-template-columns: 1fr !important; } }
      `}</style>
    </PaletteScope>
  );
}
