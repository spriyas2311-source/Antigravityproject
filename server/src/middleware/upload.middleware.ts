import multer from 'multer';
import { Request } from 'express';
import { ENV } from '../config/env.js';

// In-memory buffer storage for safe validation and Sharp processing
const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: ENV.MAX_IMAGE_SIZE_MB * 1024 * 1024 // 8MB limit
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Only JPEG, PNG, and WebP images are allowed.`));
    }
  }
});

