import { Router, ErrorRequestHandler } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth";
import { importMenu } from "../controllers/menuImportController";

const router = Router();

router.use(requireAuth);

// In-memory upload — the file is parsed and discarded, never written to disk.
// multer's own limits enforce upload size (express.json's limit does not apply
// to multipart/form-data).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

router.post("/", upload.single("file"), importMenu);

const handleUploadError: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large (maximum 10 MB)."
        : `Upload error: ${err.message}`;
    res.status(400).json({ error: message });
    return;
  }
  next(err);
};

router.use(handleUploadError);

export default router;
