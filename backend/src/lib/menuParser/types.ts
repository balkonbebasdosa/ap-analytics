export interface ParsedMenuItem {
  name: string;
  price: number;
  confidence: "high" | "low";
}

export type MenuImportSource = "csv" | "excel" | "pdf-text" | "pdf-scanned";

export interface MenuImportResult {
  items: ParsedMenuItem[];
  warnings: string[];
  source: MenuImportSource;
}
