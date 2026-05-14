import type { CSSProperties, ReactNode } from "react";

type Tone = "ink" | "current" | "muted";
type Size = "xs" | "sm" | "md";

interface MonoLabelProps {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
  letterSpacing?: string;
  className?: string;
  style?: CSSProperties;
  as?: "span" | "div" | "p";
}

const sizeMap: Record<Size, { fontSize: string; tracking: string }> = {
  xs: { fontSize: "0.66rem", tracking: "0.14em" },
  sm: { fontSize: "0.72rem", tracking: "0.08em" },
  md: { fontSize: "0.85rem", tracking: "0.04em" },
};

const toneMap: Record<Tone, string> = {
  ink:     "var(--deep)",
  current: "var(--current-color-100)",
  muted:   "color-mix(in srgb, var(--deep) 60%, transparent)",
};

export function MonoLabel({
  children,
  tone = "ink",
  size = "sm",
  letterSpacing,
  className = "",
  style,
  as: Tag = "span",
}: MonoLabelProps) {
  const s = sizeMap[size];
  return (
    <Tag
      className={className}
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: letterSpacing ?? s.tracking,
        fontSize: s.fontSize,
        lineHeight: 1.2,
        color: toneMap[tone],
        transition: "color var(--transition-color-duration) var(--transition-color-easing)",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

interface SectionEyebrowProps {
  anchor: string;
  label?: string;
}

export function SectionEyebrow({ anchor, label }: SectionEyebrowProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.7rem",
        marginBottom: "1.4rem",
        background: "var(--deep)",
        color: "var(--bright)",
        borderRadius: 999,
        padding: "0.45rem 1rem",
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.7rem", fontWeight: 700,
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: "var(--bright)",
        }}
      >
        {anchor}
      </span>
      {label && (
        <span
          style={{
            marginLeft: "0.3rem",
            paddingLeft: "0.7rem",
            borderLeft: "1px solid color-mix(in srgb, var(--bright) 35%, transparent)",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.68rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--bright)",
            opacity: 0.75,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
