import type {
  CSSProperties, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, ChangeEvent,
} from "react";

/* ──────────────────────────────────────────────────────────────────────────
   MonoInput — single-line text/number/email input
   ────────────────────────────────────────────────────────────────────── */
interface MonoInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerStyle?: CSSProperties;
}

export function MonoInput({ prefix, suffix, containerStyle, style, ...rest }: MonoInputProps) {
  if (!prefix && !suffix) {
    return <input {...rest} className={`mono-input ${rest.className ?? ""}`.trim()} style={style} />;
  }
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "0.6rem",
        background: "var(--mist)",
        border: "none",
        borderRadius: 14,
        padding: "0 18px",
        transition: "background 200ms ease, box-shadow 200ms ease",
        ...containerStyle,
      }}
    >
      {prefix && (
        <span style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--deep)", opacity: 0.6,
        }}>
          {prefix}
        </span>
      )}
      <input
        {...rest}
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          padding: "14px 0",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 16, fontWeight: 400,
          color: "var(--deep)",
          ...style,
        }}
      />
      {suffix}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MonoTextarea
   ────────────────────────────────────────────────────────────────────── */
type MonoTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function MonoTextarea(props: MonoTextareaProps) {
  return (
    <textarea
      {...props}
      className={`mono-input ${props.className ?? ""}`.trim()}
      style={{
        resize: "vertical",
        minHeight: "7rem",
        lineHeight: 1.5,
        fontFamily: "'Inter', system-ui, sans-serif",
        ...props.style,
      }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PillToggle — Shelby-style multiselect / category pill
   ────────────────────────────────────────────────────────────────────── */
interface PillToggleProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  style?: CSSProperties;
}

export function PillToggle({ active, onClick, children, style }: PillToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pill-toggle ${active ? "is-active" : ""}`}
      style={style}
    >
      {children}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   RangeSlider — radius / range input with live readout
   ────────────────────────────────────────────────────────────────────── */
interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  ticks?: { value: number; label: string }[];
}

export function RangeSlider({
  min, max, step = 1, value, onChange, format, ticks,
}: RangeSliderProps) {
  const display = format ? format(value) : String(value);
  const scaleTicks = ticks ?? [];
  const useTickScale = scaleTicks.length > 1;
  const sliderMin = useTickScale ? 0 : min;
  const sliderMax = useTickScale ? scaleTicks.length - 1 : max;
  const sliderStep = useTickScale ? 0.01 : step;

  const valueToScale = (rawValue: number) => {
    if (!useTickScale) return rawValue;
    const orderedTicks = scaleTicks;
    if (rawValue <= orderedTicks[0].value) return 0;
    for (let i = 0; i < orderedTicks.length - 1; i += 1) {
      const start = orderedTicks[i].value;
      const end = orderedTicks[i + 1].value;
      if (rawValue <= end) {
        return i + (rawValue - start) / (end - start);
      }
    }
    return orderedTicks.length - 1;
  };

  const scaleToValue = (scaledValue: number) => {
    if (!useTickScale) return scaledValue;
    const orderedTicks = scaleTicks;
    const lowerIndex = Math.min(Math.floor(scaledValue), orderedTicks.length - 2);
    const upperIndex = lowerIndex + 1;
    const localProgress = scaledValue - lowerIndex;
    const rawValue = orderedTicks[lowerIndex].value +
      (orderedTicks[upperIndex].value - orderedTicks[lowerIndex].value) * localProgress;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(max, Math.max(min, steppedValue));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
        fontWeight: 700,
        lineHeight: 1, letterSpacing: "-0.04em",
        color: "var(--deep)",
      }}>
        {display}
      </div>
      <input
        type="range"
        className="range-slider"
        min={sliderMin} max={sliderMax} step={sliderStep}
        value={valueToScale(value)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(scaleToValue(Number(e.target.value)))}
      />
      {ticks && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {ticks.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange(t.value)}
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 10, fontWeight: 500, letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: value === t.value ? "var(--deep)" : "color-mix(in srgb, var(--deep) 55%, transparent)",
                transition: "color 200ms ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   InputLabel — mono caps field label
   ────────────────────────────────────────────────────────────────────── */
interface InputLabelProps {
  children: ReactNode;
  hint?: ReactNode;
  required?: boolean;
}

export function InputLabel({ children, hint, required }: InputLabelProps) {
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <label style={{
        display: "block",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--deep)",
        marginBottom: hint ? "0.3rem" : 0,
      }}>
        {children}
        {required && <span style={{ marginLeft: 6, color: "var(--bright)" }}>•</span>}
      </label>
      {hint && (
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 13, fontWeight: 300, fontStyle: "italic",
          color: "color-mix(in srgb, var(--deep) 65%, transparent)",
          lineHeight: 1.4,
        }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Fieldset — section grouping with mono-cap heading + ink rule
   ────────────────────────────────────────────────────────────────────── */
interface FieldsetProps {
  anchor: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

export function Fieldset({ anchor, title, description, children }: FieldsetProps) {
  return (
    <section className="compartment">
      <div style={{ marginBottom: description ? "0.6rem" : "1.6rem" }}>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--deep)",
          opacity: 0.6,
          marginBottom: "0.5rem",
        }}>
          {anchor}
        </div>
        <h3 style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
          fontWeight: 700, letterSpacing: "-0.02em",
          color: "var(--deep)", lineHeight: 1.1,
          margin: 0,
        }}>
          {title}
        </h3>
      </div>
      {description && (
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 400, fontSize: "1rem", lineHeight: 1.55,
          color: "color-mix(in srgb, var(--deep) 72%, transparent)",
          marginBottom: "1.6rem", maxWidth: 640,
        }}>
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
