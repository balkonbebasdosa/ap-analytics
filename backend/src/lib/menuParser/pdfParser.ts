import { extractItemsFromLines } from "./lineParser";
import type { MenuImportResult } from "./types";

// Below this much extracted text, the PDF has no usable text layer (it's a
// scan or an image) and can't be parsed without OCR.
const SCANNED_TEXT_THRESHOLD = 20;

interface TextItem {
  str: string;
  transform: number[];
}

/** Reconstructs text lines from positioned PDF text items by clustering on the y-axis. */
function itemsToLines(items: TextItem[]): string[] {
  const positioned = items
    .filter((it) => it.str && it.str.trim() !== "")
    .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }));

  if (positioned.length === 0) return [];

  positioned.sort((a, b) => b.y - a.y || a.x - b.x);

  const lines: string[] = [];
  let currentY = positioned[0].y;
  let bucket: typeof positioned = [];

  const flush = () => {
    if (bucket.length === 0) return;
    bucket.sort((a, b) => a.x - b.x);
    lines.push(bucket.map((p) => p.str).join(" ").replace(/\s{2,}/g, " ").trim());
    bucket = [];
  };

  for (const p of positioned) {
    if (Math.abs(p.y - currentY) > 4) {
      flush();
      currentY = p.y;
    }
    bucket.push(p);
  }
  flush();

  return lines.filter((l) => l !== "");
}

export async function parsePdf(buffer: Buffer): Promise<MenuImportResult> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableFontFace: true,
  }).promise;

  const allLines: string[] = [];
  let totalTextLength = 0;

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const lines = itemsToLines(content.items as TextItem[]);
    for (const l of lines) totalTextLength += l.length;
    allLines.push(...lines);
    page.cleanup();
  }

  await doc.destroy();

  // Scanned PDF: no embedded text layer, nothing to extract.
  if (totalTextLength < SCANNED_TEXT_THRESHOLD) {
    return {
      items: [],
      warnings: [
        "This PDF has no text layer — it looks like a scan or an image. Please re-export it as a digital PDF, or import the menu via CSV or Excel instead.",
      ],
      source: "pdf-scanned",
    };
  }

  const items = extractItemsFromLines(allLines);
  const warnings: string[] = [];
  if (items.length === 0) {
    warnings.push(
      "Text was extracted but no menu items could be identified. The layout may be unusual — try CSV/Excel import."
    );
  }

  return { items, warnings, source: "pdf-text" };
}
