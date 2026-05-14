import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-deep";
  if (score >= 45) return "text-deep";
  return "text-bright";
}

export function getScoreBg(score: number): string {
  if (score >= 70) return "bg-bright";
  if (score >= 45) return "bg-mist";
  return "bg-deep";
}

/* Score tier — single green family, three depths.
   High = bright pop (the highlighted bar from the reference).
   Mid  = mist neutral (the muted bars).
   Low  = deep panel with bright text (dark/alert via depth, not chroma).      */
export function getScoreTier(score: number): {
  panel: string;
  ink: string;
  fill: string;
} {
  if (score >= 70) return { panel: "#9fe878", ink: "#1f2e15", fill: "#1f2e15" }; /* bright + deep */
  if (score >= 45) return { panel: "#d3deb6", ink: "#1f2e15", fill: "#1f2e15" }; /* mist   + deep */
  return                   { panel: "#1f2e15", ink: "#9fe878", fill: "#9fe878" }; /* deep   + bright */
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Highly Viable";
  if (score >= 65) return "Viable";
  if (score >= 50) return "Moderately Viable";
  if (score >= 35) return "Challenging";
  return "High Risk";
}
