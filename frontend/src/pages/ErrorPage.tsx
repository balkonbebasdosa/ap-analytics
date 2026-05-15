import { RotateCcw } from "lucide-react";
import { HexButton } from "@/components/ui/HexButton";
import { FallbackScreen } from "@/components/FallbackScreen";

/* Rendered by the top-level ErrorBoundary — lives OUTSIDE the router, so it
   uses plain anchors / window APIs rather than react-router navigation. */
export default function ErrorPage({ error }: { error?: Error | null }) {
  return (
    <FallbackScreen
      code="500"
      eyebrow="Error · Something broke"
      title="Something went wrong."
      description="An unexpected error interrupted the page. Reloading usually fixes it. If it keeps happening, head back home."
      actions={
        <>
          <HexButton variant="solid" onClick={() => window.location.reload()}>
            <RotateCcw size={14} /> Reload page
          </HexButton>
          <HexButton as="a" href="/" variant="outline">
            Go home
          </HexButton>
        </>
      }
    >
      {import.meta.env.DEV && error && (
        <details style={{ marginTop: "2rem", width: "100%", textAlign: "left" }}>
          <summary
            style={{
              cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--deep)",
              opacity: 0.6,
            }}
          >
            Error detail (dev only)
          </summary>
          <pre
            style={{
              marginTop: "0.8rem",
              maxHeight: 280,
              overflow: "auto",
              background: "var(--deep)",
              color: "var(--cream)",
              borderRadius: 14,
              padding: "1rem 1.2rem",
              fontSize: 12,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {error.message}
            {"\n\n"}
            {error.stack}
          </pre>
        </details>
      )}
    </FallbackScreen>
  );
}
