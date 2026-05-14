import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

/* Despite the name, this component now renders a smooth rounded-rect button.
   Kept under "HexButton" for import compatibility — to be renamed later. */

type Variant = "outline" | "solid";

interface HexCommon {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

type HexAsButton = HexCommon &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; href?: never };

type HexAsAnchor = HexCommon &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

export type HexButtonProps = HexAsButton | HexAsAnchor;

export const HexButton = forwardRef<HTMLElement, HexButtonProps>(function HexButton(
  props,
  ref,
) {
  const { children, variant = "outline", className = "", ...rest } = props as HexCommon & {
    as?: "a" | "button";
    href?: string;
  } & Record<string, unknown>;

  const cls = `hex-btn ${variant === "solid" ? "hex-btn--solid" : "hex-btn--outline"} ${className}`.trim();

  if ((rest as { as?: string }).as === "a") {
    const { as: _as, ...anchorRest } = rest as { as?: string };
    void _as;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={cls}
        {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <span className="hex-btn__label">{children}</span>
      </a>
    );
  }

  const { as: _as, ...buttonRest } = rest as { as?: string };
  void _as;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cls}
      {...(buttonRest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span className="hex-btn__label">{children}</span>
    </button>
  );
});
