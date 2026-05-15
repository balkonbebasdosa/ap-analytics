import type { ReactNode } from "react";
import { PaletteScope } from "@/components/ui/PaletteScope";

/* ──────────────────────────────────────────────────────────────────────────
   Shared shell for full-page fallback states (404, crash, etc.) — keeps the
   landing-page visual language: paper surface, mist compartment, mono pill.
   ────────────────────────────────────────────────────────────────────── */
interface FallbackScreenProps {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  actions: ReactNode;
  children?: ReactNode;
}

export function FallbackScreen({
  code, eyebrow, title, description, actions, children,
}: FallbackScreenProps) {
  return (
    <PaletteScope
      palette="green"
      as="div"
      className="paper-surface"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <main
        className="container"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <section
          className="compartment"
          style={{
            width: "100%",
            maxWidth: 720,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          <span
            className="pill-mono"
            style={{ background: "var(--deep)", color: "var(--bright)", marginBottom: "1.8rem" }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--bright)" }} />
            {eyebrow}
          </span>

          <div className="display-hero" style={{ lineHeight: 0.9 }}>{code}</div>

          <h1 className="display-xl" style={{ marginTop: "1rem", maxWidth: 520 }}>{title}</h1>

          <p
            className="serif-body"
            style={{
              marginTop: "1rem",
              maxWidth: 460,
              color: "color-mix(in srgb, var(--deep) 75%, transparent)",
            }}
          >
            {description}
          </p>

          <div
            style={{
              marginTop: "2.4rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.8rem",
              justifyContent: "center",
            }}
          >
            {actions}
          </div>

          {children}
        </section>
      </main>
    </PaletteScope>
  );
}
