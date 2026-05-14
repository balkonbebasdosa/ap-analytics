import { parseCsv } from "./csvParser";
import { parseExcel } from "./excelParser";
import { parsePdf } from "./pdfParser";
import type { MenuImportResult } from "./types";

export type { MenuImportResult, ParsedMenuItem } from "./types";

export type MenuFileKind = "csv" | "excel" | "pdf";

/** Resolves the file kind from extension first, then mimetype as a fallback. */
export function detectFileKind(
  filename: string,
  mimetype: string
): MenuFileKind | null {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (ext === "csv") return "csv";
  if (ext === "xlsx" || ext === "xls") return "excel";
  if (ext === "pdf") return "pdf";

  if (mimetype === "text/csv") return "csv";
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimetype === "application/vnd.ms-excel"
  )
    return "excel";
  if (mimetype === "application/pdf") return "pdf";

  return null;
}

export async function parseMenuFile(
  buffer: Buffer,
  kind: MenuFileKind
): Promise<MenuImportResult> {
  switch (kind) {
    case "csv":
      return parseCsv(buffer);
    case "excel":
      return parseExcel(buffer);
    case "pdf":
      return parsePdf(buffer);
  }
}
