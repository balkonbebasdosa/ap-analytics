import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { detectFileKind, parseMenuFile } from "../lib/menuParser";

/**
 * Parses an uploaded menu file (CSV / Excel / PDF) into {name, price} candidates.
 * Stateless: nothing is persisted here — the frontend reviews the result and
 * saves it later as part of the business profile.
 */
export async function importMenu(req: AuthRequest, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        error: "No file uploaded. Attach a CSV, Excel, or PDF file.",
      });
      return;
    }

    const kind = detectFileKind(file.originalname, file.mimetype);
    if (!kind) {
      res.status(400).json({
        error: "Unsupported file type. Use CSV, Excel (.xlsx/.xls), or PDF.",
      });
      return;
    }

    const result = await parseMenuFile(file.buffer, kind);
    res.json(result);
  } catch (err) {
    console.error("importMenu error:", err);
    res.status(500).json({
      error:
        "Failed to read the file. It may be corrupted or in an unexpected format.",
    });
  }
}
