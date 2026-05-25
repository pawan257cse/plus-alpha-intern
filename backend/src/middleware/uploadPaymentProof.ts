import multer, { type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "payments");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => cb(null, uploadDir),
  filename: (_req, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

export const uploadPaymentProof = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ok = /^(image\/(jpeg|png|webp|gif)|application\/pdf)$/i.test(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error("Only images (JPEG, PNG, WebP, GIF) or PDF allowed"));
  },
});
