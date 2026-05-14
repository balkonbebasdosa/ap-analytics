/**
 * Parses a price string into a number. Built for Indonesian Rupiah formatting,
 * where "." is the thousands separator ("Rp 35.000" = 35000), but also tolerates
 * US-style input ("35,000.50") so imported files from any source still work.
 * Returns null when no plausible price is found.
 */
export function parsePrice(raw: unknown): number | null {
  if (raw == null) return null;
  if (typeof raw === "number") return isFinite(raw) && raw >= 0 ? raw : null;

  let s = String(raw).trim();
  // Strip currency markers and anything that is not a digit or separator.
  s = s.replace(/rp\.?/gi, "").replace(/idr/gi, "").replace(/[^\d.,]/g, "");
  if (!s) return null;

  const hasDot = s.includes(".");
  const hasComma = s.includes(",");
  let normalized: string;

  if (hasDot && hasComma) {
    // The rightmost separator is the decimal point; the other is thousands.
    const decSep = s.lastIndexOf(".") > s.lastIndexOf(",") ? "." : ",";
    const thouSep = decSep === "." ? "," : ".";
    normalized = s.split(thouSep).join("").replace(decSep, ".");
  } else if (hasDot || hasComma) {
    const sep = hasDot ? "." : ",";
    const parts = s.split(sep);
    if (parts.length === 2 && parts[0].length > 0 && parts[1].length === 3) {
      // Single separator + 3-digit tail = thousands separator ("35.000").
      normalized = parts.join("");
    } else if (parts.length === 2 && parts[1].length > 0 && parts[1].length <= 2) {
      // Single separator + 1-2 digit tail = decimal ("35.5", "35,50").
      normalized = parts.join(".");
    } else {
      // Multiple separators ("1.500.000") = all thousands separators.
      normalized = parts.join("");
    }
  } else {
    normalized = s;
  }

  const n = Number(normalized);
  return isFinite(n) && n >= 0 ? n : null;
}

/**
 * Finds the most likely price token inside a free-text line (e.g. a menu row
 * like "Kopi Susu Spesial ........ Rp 25.000") and returns the parsed price
 * plus the line with that token removed (the candidate item name).
 */
export function extractPriceFromLine(
  line: string
): { name: string; price: number | null } {
  const tokenRe = /(?:rp\.?\s*)?\d[\d.,]*/gi;
  const matches = [...line.matchAll(tokenRe)];

  let chosen: RegExpMatchArray | null = null;
  // Prefer the rightmost token that parses to a positive price and looks like
  // money (has "rp", a separator, or 3+ digits) rather than an incidental number.
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const price = parsePrice(m[0]);
    const looksLikeMoney =
      /rp/i.test(m[0]) || /[.,]/.test(m[0]) || /\d{3,}/.test(m[0]);
    if (price != null && price > 0 && looksLikeMoney) {
      chosen = m;
      break;
    }
  }

  if (!chosen) return { name: cleanName(line), price: null };

  const name = cleanName(
    line.slice(0, chosen.index) + line.slice(chosen.index! + chosen[0].length)
  );
  return { name, price: parsePrice(chosen[0]) };
}

/** Trims leader dots/dashes and surrounding punctuation left over after price removal. */
function cleanName(s: string): string {
  return s
    .replace(/[.\-–—_·•]{2,}/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s.\-–—_:|]+|[\s.\-–—_:|]+$/g, "")
    .trim();
}
