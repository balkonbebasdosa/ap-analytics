import * as XLSX from "xlsx";
import { mapRowsToItems } from "./columnMapper";
import type { MenuImportResult } from "./types";

export function parseExcel(buffer: Buffer): MenuImportResult {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return {
      items: [],
      warnings: ["The spreadsheet has no sheets."],
      source: "excel",
    };
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });

  const { items, warnings } = mapRowsToItems(rows);
  if (workbook.SheetNames.length > 1) {
    warnings.push(
      `Only the first sheet ("${sheetName}") was imported; the file has ${workbook.SheetNames.length} sheets.`
    );
  }

  return { items, warnings, source: "excel" };
}
