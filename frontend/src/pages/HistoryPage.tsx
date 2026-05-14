import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { businessApi } from "@/lib/api";
import type { BusinessProfile, AnalysisResult } from "@/types";
import Navbar from "@/components/Navbar";
import { MapPin, Calendar, ArrowRight, PlusCircle, Trash2 } from "lucide-react";
import { getScoreLabel, getScoreTier } from "@/lib/utils";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { HexButton } from "@/components/ui/HexButton";
import { MonoLabel } from "@/components/ui/MonoLabel";

/* Zone label → tone mapping. All within the green family. */
const ZONE_CHIP: Record<string, { bg: string; fg: string }> = {
  MERAH:  { bg: "var(--deep)",   fg: "var(--bright)" },
  KUNING: { bg: "var(--bright)", fg: "var(--deep)" },
  HIJAU:  { bg: "var(--mist)",   fg: "var(--deep)" },
};

const STATUS_CHIP: Record<BusinessProfile["status"], { bg: string; fg: string }> = {
  COMPLETED:  { bg: "var(--deep)",   fg: "var(--bright)" },
  PROCESSING: { bg: "var(--bright)", fg: "var(--deep)" },
  FAILED:     { bg: "var(--deep)",   fg: "var(--bright)" },
  PENDING:    { bg: "var(--soft)",   fg: "var(--deep)" },
};

function StatusPill({ status }: { status: BusinessProfile["status"] }) {
  const s = STATUS_CHIP[status];
  return (
    <span style={{
      background: s.bg, color: s.fg,
      borderRadius: 999, padding: "3px 10px",
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}>
      {status}
    </span>
  );
}

function SectionHeader({ anchor, count }: { anchor: string; count?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.6rem",
      background: "var(--deep)", color: "var(--bright)",
      borderRadius: 999, padding: "0.4rem 0.95rem",
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
      textTransform: "uppercase",
      marginBottom: "1.2rem",
    }}>
      {anchor}
      {count && (
        <span style={{
          paddingLeft: "0.6rem",
          borderLeft: "1px solid color-mix(in srgb, var(--bright) 35%, transparent)",
          fontWeight: 500, opacity: 0.8, letterSpacing: "0.12em",
          fontSize: 10,
        }}>
          {count}
        </span>
      )}
    </span>
  );
}

export default function HistoryPage() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    businessApi.list()
      .then(({ data }) => setProfiles(data.profiles))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this analysis?")) return;
    await businessApi.delete(id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
      <Navbar />

      <main className="container" style={{
        display: "flex", flexDirection: "column",
        gap: "clamp(1rem, 2vw, 1.6rem)",
        paddingTop: "1.5rem", paddingBottom: "3rem",
      }}>

        {/* Hero compartment */}
        <section className="compartment">
          <div style={{
            display: "flex", flexWrap: "wrap",
            alignItems: "flex-end", justifyContent: "space-between",
            gap: "1.5rem",
          }}>
            <div>
              <SectionHeader anchor="YOUR ANALYSES" />
              <h1 className="display-xl">Past consults.</h1>
              <p className="serif-body" style={{
                marginTop: "0.8rem",
                color: "color-mix(in srgb, var(--deep) 72%, transparent)",
                maxWidth: 520,
              }}>
                Every location you've analyzed lives here. Open one to see its score
                and roadmap, or delete it to clear the board.
              </p>
            </div>
            <HexButton as="a" href="/survey" variant="solid">
              <PlusCircle size={14} /> New consult
            </HexButton>
          </div>
        </section>

        {/* Results compartment */}
        <section className="compartment">
          <SectionHeader anchor="ALL ANALYSES" count={profiles.length > 0 ? `${profiles.length} TOTAL` : "—"} />

          {isLoading ? (
            <div className="compartment-inner" style={{ padding: "4rem 0", display: "flex", justifyContent: "center" }}>
              <div style={{
                width: 28, height: 28,
                border: "3px solid var(--mist)", borderTopColor: "var(--deep)",
                borderRadius: "50%", animation: "spin 0.7s linear infinite",
              }} />
            </div>
          ) : profiles.length === 0 ? (
            <div
              className="compartment-inner"
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "4rem 2rem", textAlign: "center",
              }}
            >
              <div style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em",
                color: "var(--deep)", marginBottom: "1rem",
              }}>
                —
              </div>
              <MonoLabel size="md" tone="ink" style={{ marginBottom: "0.6rem" }}>No analyses yet</MonoLabel>
              <p className="serif-body" style={{
                color: "color-mix(in srgb, var(--deep) 70%, transparent)",
                marginBottom: "1.6rem",
              }}>
                Run your first consult to see results here.
              </p>
              <HexButton as="a" href="/survey" variant="solid">
                Start your first analysis <ArrowRight size={14} />
              </HexButton>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.8rem",
            }} className="history-grid">
              {profiles.map((profile, i) => {
                const result = profile.analysisResult as AnalysisResult | null;
                const score = result?.successScore;
                const tier = score !== undefined ? getScoreTier(score) : null;

                return (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="compartment-inner"
                    style={{
                      display: "flex", flexDirection: "column",
                      gap: "0.9rem",
                      transition: "background 200ms",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--soft)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cream)"; }}
                  >
                    {/* Top: identity + score */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.7rem" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <MonoLabel size="xs" tone="ink" style={{ marginBottom: "0.4rem", display: "block", opacity: 0.6 }}>
                          {profile.category}
                        </MonoLabel>
                        <h3 style={{
                          fontFamily: "'Inter', system-ui, sans-serif",
                          fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.15,
                          letterSpacing: "-0.02em",
                          color: "var(--deep)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {profile.name}
                        </h3>
                      </div>
                      {score !== undefined && tier && (
                        <div style={{
                          flexShrink: 0,
                          background: tier.panel,
                          color: tier.ink,
                          padding: "8px 12px",
                          textAlign: "center",
                          minWidth: 64,
                          borderRadius: 14,
                        }}>
                          <div style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: "1.5rem", fontWeight: 800, lineHeight: 1,
                            letterSpacing: "-0.04em", color: tier.ink,
                          }}>{score}</div>
                          <div style={{
                            marginTop: 2,
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: tier.ink, opacity: 0.7,
                          }}>{getScoreLabel(score).split(" ")[0]}</div>
                        </div>
                      )}
                    </div>

                    {/* Chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      <StatusPill status={profile.status} />
                      {result?.zone && result.zone.zone_label !== "UNKNOWN" && (() => {
                        const zc = ZONE_CHIP[result.zone.zone_label];
                        return (
                          <span style={{
                            background: zc.bg, color: zc.fg,
                            borderRadius: 999, padding: "3px 10px",
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}>
                            {result.zone.zone_label}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Meta */}
                    <div className="compartment-well" style={{ padding: "0.65rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: 11, fontWeight: 500, letterSpacing: "0.04em",
                        color: "var(--deep)", opacity: 0.72,
                      }}>
                        <MapPin size={11} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {result?.address || `${profile.latitude.toFixed(4)}, ${profile.longitude.toFixed(4)}`}
                        </span>
                      </div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: 11, fontWeight: 500, letterSpacing: "0.04em",
                        color: "var(--deep)", opacity: 0.72,
                      }}>
                        <Calendar size={11} style={{ flexShrink: 0 }} />
                        {new Date(profile.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{
                      marginTop: "0.2rem",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: "0.5rem",
                    }}>
                      {profile.status === "COMPLETED" ? (
                        <Link
                          to={`/dashboard/${profile.id}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: "var(--deep)",
                            color: "var(--bright)",
                            borderRadius: 999,
                            padding: "8px 16px",
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                            textTransform: "uppercase", textDecoration: "none",
                            transition: "background 200ms",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--deep) 84%, var(--bright))"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--deep)"; }}
                        >
                          View report <ArrowRight size={11} />
                        </Link>
                      ) : (
                        <StatusPill status={profile.status} />
                      )}
                      <button
                        onClick={() => handleDelete(profile.id)}
                        aria-label="Delete analysis"
                        style={{
                          background: "transparent", border: "none", cursor: "pointer",
                          padding: 6, borderRadius: 999,
                          color: "var(--deep)", opacity: 0.5,
                          transition: "background 200ms, opacity 200ms",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bright)"; e.currentTarget.style.opacity = "1"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = "0.5"; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      <style>{`
        @media (max-width: 1024px) { .history-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px)  { .history-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </PaletteScope>
  );
}
