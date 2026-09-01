import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { requireAuth } from "../middleware/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Strict Allowed Extensions and MIME types
const ALLOWED_EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp", ".pdf"];
const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // Generate safe unique object key avoiding path traversal
    const safeExt = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `incident-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${safeExt}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);
  const isMimeAllowed = ALLOWED_MIMES.includes(mime);

  // Prevent path traversal & dangerous executable extensions
  if (file.originalname.includes("..") || file.originalname.includes("/") || file.originalname.includes("\\")) {
    return cb(new Error("Invalid file name (path traversal detected)"), false);
  }

  if (isExtAllowed && isMimeAllowed) {
    cb(null, true);
  } else {
    cb(new Error(`Security Error: Unsupported file format (${ext}). Only JPEG, PNG, WebP, and PDF allowed.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

const router = Router();

/**
 * POST /api/uploads — Upload an evidence image or document
 */
router.post("/", requireAuth, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File size exceeds 10 MB limit" });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided in request body" });
    }

    // Build public URL relative to the API server
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(201).json({
      success: true,
      url: fileUrl,
      metadata: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        uploaderId: req.auth.userId,
        uploadedAt: new Date().toISOString()
      }
    });
  });
});

export default router;
