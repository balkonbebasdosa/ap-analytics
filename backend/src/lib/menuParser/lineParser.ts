import { extractPriceFromLine } from "./priceParser";
import type { ParsedMenuItem } from "./types";

/**
 * Shared between the digital-PDF and OCR paths: takes the text lines of a menu
 * and turns each into a {name, price} candidate. A line with a price but no
 * name, or a name but no price, still comes through tagged low-confidence so
 * the user can fix it in the review step rather than silently losing it.
 */
export function extractItemsFromLines(lines: string[]): ParsedMenuItem[] {
  const items: ParsedMenuItem[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const { name, price } = extractPriceFromLine(line);

    // Skip lines that are clearly not menu rows: no price and no real text.
    if (price == null && (!name || name.length < 2)) continue;
    // Skip section headers etc.: text but no price and no letters worth keeping.
    if (price == null && !/[a-zA-Z]/.test(name)) continue;

    items.push({
      name,
      price: price ?? 0,
      confidence: name && price != null && price > 0 ? "high" : "low",
    });
  }

  return items;
}
