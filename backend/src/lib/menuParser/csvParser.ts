import Papa from "papaparse";
import { mapRowsToItems } from "./columnMapper";
import type { MenuImportResult } from "./types";

export function parseCsv(buffer: Buffer): MenuImportResult {
  const text = buffer.toString("utf-8");
  const result = Papa.parse<string[]>(text, {
    skipEmptyLines: true,
  });

  const rows = (result.data || []).filter(Array.isArray);
  const { items, warnings } = mapRowsToItems(rows);

  if (result.errors && result.errors.length > 0) {
    warnings.push(`CSV parsed with ${result.errors.length} formatting issue(s).`);
  }

  return { items, warnings, source: "csv" };
}
