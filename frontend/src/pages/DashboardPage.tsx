import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { businessApi } from "@/lib/api";
import type { BusinessProfile, AnalysisResult, Competitor } from "@/types";
import Navbar from "@/components/Navbar";
import SwotCard from "@/components/SwotCard";
import ScoreDisplay from "@/components/ScoreDisplay";
import RoadmapCard from "@/components/RoadmapCard";
import CompetitorMap from "@/components/CompetitorMap";
import ZoneBanner from "@/components/ZoneBanner";
import { MapPin, ArrowLeft, Download, Calendar, Star, ArrowRight } from "lucide-react";
import { formatDistance, formatPrice, getScoreTier } from "@/lib/utils";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { HexButton } from "@/components/ui/HexButton";
import { MonoLabel } from "@/components/ui/MonoLabel";

/* ──────────────────────────────────────────────────────────────────────────
   Hero compartment — title bar (action row) + identity + metrics grid
   ────────────────────────────────────────────────────────────────────── */
function DashboardHero({
  profile, result, competitors, consultNum,
}: {
  profile: BusinessProfile; result: AnalysisResult;
  competitors: Competitor[]; consultNum: number | null;
}) {
  const tier = getScoreTier(result.successScore);

  const metrics = [
    { val: String(competitors.length),                       label: "Competitors" },
    { val: `${(profile.radiusMeters / 1000).toFixed(1)}km`,  label: "Search radius" },
    { val: String(result.scoreBreakdown.locationAppeal),     label: "Location appeal" },
    { val: String(result.scoreBreakdown.marketDemand),       label: "Market demand" },
  ];

  return (
    <section
      className="compartment"
      style={{
        background: "var(--mist)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Title-bar action row — deep-emphasis strip */}
      <div
        className="compartment-header"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "1.4rem",
        }}
      >
        <Link
          to="/history"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--bright)", textDecoration: "none",
            opacity: 0.85,
          }}
        >
          <ArrowLeft size={13} />
          All analyses
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {consultNum && (
            <span style={{
              display: "inline-flex", alignItems: "center",
              background: "var(--bright)", color: "var(--deep)",
              padding: "4px 12px", borderRadius: 999,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              Consult #{consultNum}
            </span>
          )}
          <button
            onClick={() => window.print()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "color-mix(in srgb, var(--bright) 18%, transparent)",
              border: "none",
              borderRadius: 999,
              padding: "5px 12px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--bright)",
              cursor: "pointer",
              transition: "background 200ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bright)"; e.currentTarget.style.color = "var(--deep)"; }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "color-mix(in srgb, var(--bright) 18%, transparent)";
              e.currentTarget.style.color = "var(--bright)";
            }}
          >
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Identity block */}
      <div className="compartment-inner" style={{ marginBottom: "1rem" }}>
        <MonoLabel size="md" tone="current" letterSpacing="0.18em" style={{ marginBottom: "1rem", display: "block", opacity: 0.7 }}>
          {profile.category}
        </MonoLabel>
        <h1 style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "clamp(2.4rem, 6vw, 5.4rem)",
          fontWeight: 800,
          lineHeight: 0.95, letterSpacing: "-0.04em",
          color: "var(--deep)",
          marginBottom: "1rem",
        }}>
          {profile.name}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", marginTop: "0.8rem" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--deep)", opacity: 0.65,
          }}>
            <MapPin size={12} />
            {result.address || `${profile.latitude.toFixed(4)}, ${profile.longitude.toFixed(4)}`}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--deep)", opacity: 0.65,
          }}>
            <Calendar size={12} />
            {new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      {/* Metric strip — 4 nested wells inside an inner panel */}
      <div
        className="compartment-inner"
        style={{
          padding: "0.6rem",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
        }}
      >
        {metrics.map((s, i) => (
          <div key={s.label} className="compartment-well" style={{ padding: "1rem 1.1rem" }}>
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
              fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em",
              color: i === 0 ? "var(--deep)" : i === 1 ? "var(--deep)" : "var(--deep)",
              marginBottom: 8,
            }}>
              {s.val}
            </div>
            <MonoLabel size="xs" tone="ink" style={{ opacity: 0.65 }}>{s.label}</MonoLabel>
          </div>
        ))}
      </div>

      {/* Tier indicator pill (bottom-right) */}
      <div style={{
        position: "absolute",
        top: "1.2rem",
        right: "1.4rem",
        background: tier.panel,
        color: tier.ink,
        padding: "4px 14px",
        borderRadius: 999,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase",
        transition: "background 0.3s var(--transition-color-easing)",
        zIndex: 1,
        display: "none",
      }} />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Section shell — every section is a mist compartment
   ────────────────────────────────────────────────────────────────────── */
function Section({
  anchor, count, title, description, children,
}: {
  anchor: string; count: string; title: string;
  description?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className="compartment">
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        gap: "0.7rem", marginBottom: "1.2rem",
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "0.6rem",
          background: "var(--deep)", color: "var(--bright)",
          borderRadius: 999, padding: "0.4rem 0.95rem",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          {anchor}
          <span style={{
            paddingLeft: "0.6rem",
            borderLeft: "1px solid color-mix(in srgb, var(--bright) 35%, transparent)",
            fontWeight: 500, opacity: 0.8, letterSpacing: "0.12em",
            fontSize: 10,
          }}>
            {count}
          </span>
        </span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="display-xl"
        style={{ maxWidth: 820, marginBottom: description ? "0.8rem" : "1.8rem" }}
      >
        {title}
      </motion.h2>
      {description && (
        <p className="serif-body" style={{
          maxWidth: 700, marginBottom: "1.8rem",
          color: "color-mix(in srgb, var(--deep) 75%, transparent)",
        }}>
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Competitor ledger row — alternating soft/cream stripe
   ────────────────────────────────────────────────────────────────────── */
function CompetitorRow({ c, alt }: { c: Competitor; alt: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto auto",
        gap: "1rem", alignItems: "center",
        padding: "0.85rem 1.1rem",
        borderRadius: 12,
        background: alt ? "var(--soft)" : "transparent",
      }}
    >
      <div>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 14, fontWeight: 600, color: "var(--deep)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {c.name}
        </div>
        <MonoLabel size="xs" tone="ink" style={{ opacity: 0.55, marginTop: 2, display: "block" }}>
          {c.type.replace(/_/g, " ")}
        </MonoLabel>
      </div>
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: 12, color: "color-mix(in srgb, var(--deep) 65%, transparent)",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {c.vicinity}
      </div>
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
        color: "var(--deep)",
        fontVariantNumeric: "tabular-nums",
        textAlign: "right",
      }}>
        {formatDistance(c.distanceMeters)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", minWidth: 52 }}>
        {c.rating ? (
          <>
            <Star style={{ width: 12, height: 12, fill: "var(--bright)", color: "var(--bright)", flexShrink: 0 }} />
            <span style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 12, fontWeight: 700, color: "var(--deep)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {c.rating}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 14, color: "color-mix(in srgb, var(--deep) 30%, transparent)" }}>—</span>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   DashboardPage
   ────────────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<BusinessProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    Promise.all([businessApi.get(profileId), businessApi.list()])
      .then(([{ data }, { data: listData }]) => {
        setProfile(data.profile);
        setAllProfiles(listData.profiles ?? []);
      })
      .catch(() => setError("Failed to load analysis results."))
      .finally(() => setIsLoading(false));
  }, [profileId]);

  const consultNum = profile
    ? allProfiles.findIndex((p) => p.id === profile.id) + 1 || 1
    : null;

  if (isLoading) {
    return (
      <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
        <Navbar />
        <main className="container" style={{ paddingTop: "1.5rem" }}>
          <div className="compartment" style={{ minHeight: 320 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[{ w: "30%", h: 18 }, { w: "70%", h: 64 }, { w: "100%", h: 12 }].map((s, i) => (
                <div
                  key={i}
                  style={{
                    width: s.w, height: s.h,
                    background: "var(--soft)",
                    borderRadius: 10,
                    animation: `pulse 1.6s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </main>
        <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
      </PaletteScope>
    );
  }

  if (error || !profile || !profile.analysisResult) {
    return (
      <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
        <Navbar />
        <main className="container" style={{ paddingTop: "1.5rem" }}>
          <div className="compartment" style={{ textAlign: "center" }}>
            <MonoLabel size="md" tone="ink" style={{ opacity: 0.7 }}>
              {error || "Analysis not available."}
            </MonoLabel>
            <div style={{ marginTop: 24 }}>
              <HexButton as="a" href="/history" variant="outline">Back to history</HexButton>
            </div>
          </div>
        </main>
      </PaletteScope>
    );
  }

  const result = profile.analysisResult as AnalysisResult;
  const competitors = result.competitors || [];
  const displayed = showAll ? competitors : competitors.slice(0, 12);

  return (
    <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
      {result.zone && <ZoneBanner zone={result.zone} />}
      <Navbar consultLabel={consultNum ? `Consult #${consultNum}` : undefined} />

      <main className="container" style={{
        display: "flex", flexDirection: "column",
        gap: "clamp(1rem, 2vw, 1.6rem)",
        paddingTop: "1rem", paddingBottom: "3rem",
      }}>

        <DashboardHero
          profile={profile}
          result={result}
          competitors={competitors}
          consultNum={consultNum}
        />

        {/* ── 01 BVI Score ─────────────────────────────────────────────── */}
        <Section
          anchor="A · BVI SCORE"
          count="01 / 04"
          title="Business viability index."
          description="A weighted composite of demand, location, uniqueness, and competition. Strongest metric highlighted in bright green; the rest in deep green."
        >
          <ScoreDisplay
            score={result.successScore}
            breakdown={result.scoreBreakdown}
            summary={result.summary}
          />
        </Section>

        {/* ── 02 SWOT ──────────────────────────────────────────────────── */}
        <Section
          anchor="B · SWOT"
          count="02 / 04"
          title="Strengths, weaknesses, opportunities, threats."
          description="Four quadrants. Bright tiles = positive signals. Deep tiles = friction and risk."
        >
          <SwotCard swot={result.swot} />
        </Section>

        {/* ── 03 Competitors ───────────────────────────────────────────── */}
        <Section
          anchor="C · COMPETITORS"
          count="03 / 04"
          title="What's already in the radius."
          description="Pink dots are competing businesses; the dark dot is your candidate location."
        >
          <div className="compartment-stack--tight" style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <CompetitorMap
              latitude={profile.latitude}
              longitude={profile.longitude}
              radiusMeters={profile.radiusMeters}
              competitors={competitors}
              zone={result.zone}
            />

            {competitors.length > 0 && (
              <div className="compartment-inner" style={{ padding: "0.6rem" }}>
                {/* Header strip */}
                <div
                  className="compartment-header"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr auto auto",
                    gap: "1rem",
                    padding: "0.55rem 1.1rem",
                    marginBottom: "0.4rem",
                    borderRadius: 12,
                  }}
                >
                  {["Business", "Address", "Distance", "Rating"].map((h) => (
                    <div
                      key={h}
                      style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: 10, fontWeight: 700,
                        color: "var(--bright)", opacity: 0.85,
                        textTransform: "uppercase", letterSpacing: "0.14em",
                        textAlign: h === "Distance" || h === "Rating" ? "right" : "left",
                      }}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Striped rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  {displayed.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <CompetitorRow c={c} alt={i % 2 === 1} />
                    </motion.div>
                  ))}
                </div>

                {competitors.length > 12 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    style={{
                      marginTop: "1rem",
                      display: "block", width: "100%",
                      background: "var(--soft)",
                      border: "none",
                      borderRadius: 12,
                      padding: "11px 24px",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: "var(--deep)",
                      cursor: "pointer",
                      transition: "background 200ms, color 200ms",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--deep)"; e.currentTarget.style.color = "var(--bright)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--soft)"; e.currentTarget.style.color = "var(--deep)"; }}
                  >
                    {showAll ? "Show fewer" : `Show all ${competitors.length} competitors`}
                  </button>
                )}
              </div>
            )}

            {competitors.length === 0 && (
              <div className="compartment-inner" style={{ padding: "3rem 0", textAlign: "center" }}>
                <MonoLabel tone="ink" style={{ opacity: 0.5 }}>No competitors found in this radius</MonoLabel>
              </div>
            )}
          </div>
        </Section>

        {/* ── 04 Strategic Roadmap ─────────────────────────────────────── */}
        <Section
          anchor="D · ROADMAP"
          count="04 / 04"
          title="What to do about it."
          description="Three pillars for differentiation, pricing, and visibility — concrete next moves for this location."
        >
          <RoadmapCard roadmap={result.strategicRoadmap} />
        </Section>

        {/* ── 05 Products (conditional) ────────────────────────────────── */}
        {profile.products.length > 0 && (
          <Section anchor="E · PRODUCTS" count="05 / —" title="Catalog snapshot.">
            <div className="compartment-inner" style={{ padding: "0.6rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {profile.products.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0.85rem 1.1rem",
                      borderRadius: 12,
                      background: i % 2 === 1 ? "var(--soft)" : "transparent",
                    }}
                  >
                    <span style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 14, fontWeight: 600, color: "var(--deep)",
                    }}>
                      {p.name}
                    </span>
                    <span style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
                      background: "var(--deep)",
                      color: "var(--bright)",
                      padding: "5px 12px",
                      borderRadius: 999,
                    }}>
                      {formatPrice(p.price)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          className="compartment-well"
          style={{
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between",
            gap: "1rem", padding: "1rem 1.6rem",
          }}
        >
          <span className="brand-logo" style={{ fontSize: "1.15rem" }}>
            ap-analysis.
          </span>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <HexButton as="a" href="/history" variant="outline">All reports</HexButton>
            <HexButton as="a" href="/survey" variant="solid">
              New analysis <ArrowRight size={14} />
            </HexButton>
          </div>
        </footer>

      </main>
    </PaletteScope>
  );
}
