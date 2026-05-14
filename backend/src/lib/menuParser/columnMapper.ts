import { parsePrice } from "./priceParser";
import type { ParsedMenuItem } from "./types";

const NAME_HEADER_RE = /\b(name|item|menu|produk|product|nama|dish|makanan|minuman)\b/i;
const PRICE_HEADER_RE = /\b(price|harga|cost|rp|idr|amount|biaya|tarif)\b/i;

/**
 * Turns a sheet of rows (CSV or Excel) into menu items. Detects which column
 * holds the name and which holds the price — first via header keywords, then
 * by falling back to content heuristics for whichever column wasn't matched.
 */
export function mapRowsToItems(rows: string[][]): {
  items: ParsedMenuItem[];
  warnings: string[];
} {
  const warnings: string[] = [];
  const cleaned = rows
    .map((r) => r.map((c) => (c ?? "").toString().trim()))
    .filter((r) => r.some((c) => c !== ""));

  if (cleaned.length === 0) {
    return { items: [], warnings: ["The file contained no readable rows."] };
  }

  const header = cleaned[0];
  const hasHeader =
    header.some((c) => NAME_HEADER_RE.test(c)) ||
    header.some((c) => PRICE_HEADER_RE.test(c));

  let nameCol = -1;
  let priceCol = -1;
  if (hasHeader) {
    nameCol = header.findIndex((c) => NAME_HEADER_RE.test(c));
    priceCol = header.findIndex((c) => PRICE_HEADER_RE.test(c));
  }

  const dataRows = hasHeader ? cleaned.slice(1) : cleaned;
  const colCount = Math.max(...cleaned.map((r) => r.length));

  // Content-based inference for any column the header didn't resolve.
  if (priceCol === -1) priceCol = inferPriceColumn(dataRows, colCount, nameCol);
  if (nameCol === -1) nameCol = inferNameColumn(dataRows, colCount, priceCol);

  if (nameCol === -1 || priceCol === -1) {
    return {
      items: [],
      warnings: [
        "Could not identify a name column and a price column. Make sure the file has those two columns.",
      ],
    };
  }

  const items: ParsedMenuItem[] = [];
  for (const row of dataRows) {
    const name = (row[nameCol] ?? "").trim();
    const price = parsePrice(row[priceCol]) ?? 0;
    if (!name && price === 0) continue;
    items.push({
      name,
      price,
      confidence: name && price > 0 ? "high" : "low",
    });
  }

  if (items.length === 0) {
    warnings.push("No menu items were found in the file.");
  }
  return { items, warnings };
}

function inferPriceColumn(
  rows: string[][],
  colCount: number,
  excludeCol: number
): number {
  let best = -1;
  let bestScore = 0.5; // require a majority of cells to parse as prices
  for (let c = 0; c < colCount; c++) {
    if (c === excludeCol) continue;
    let hits = 0;
    let total = 0;
    for (const row of rows) {
      const cell = (row[c] ?? "").trim();
      if (cell === "") continue;
      total++;
      const p = parsePrice(cell);
      if (p != null && p > 0) hits++;
    }
    const score = total > 0 ? hits / total : 0;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

function inferNameColumn(
  rows: string[][],
  colCount: number,
  excludeCol: number
): number {
  let best = -1;
  let bestScore = 0;
  for (let c = 0; c < colCount; c++) {
    if (c === excludeCol) continue;
    let hits = 0;
    let total = 0;
    for (const row of rows) {
      const cell = (row[c] ?? "").trim();
      if (cell === "") continue;
      total++;
      // A name cell has letters and isn't itself a price.
      if (/[a-zA-Z]/.test(cell) && parsePrice(cell) == null) hits++;
    }
    const score = total > 0 ? hits / total : 0;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}
