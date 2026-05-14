import type { CSSProperties, ReactNode } from "react";

export type Palette = "green" | "pink";

interface PaletteScopeProps {
  palette: Palette;
  as?: "div" | "section" | "header" | "footer" | "main" | "article" | "aside";
  className?: string;
  style?: CSSProperties;
  id?: string;
  children: ReactNode;
}

export function PaletteScope({
  palette,
  as: Tag = "section",
  className = "",
  style,
  id,
  children,
}: PaletteScopeProps) {
  return (
    <Tag id={id} data-palette={palette} className={className} style={style}>
      {children}
    </Tag>
  );
}
