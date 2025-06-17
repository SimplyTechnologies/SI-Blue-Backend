// upload.ts
import multer, { FileFilterCallback, MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';
import imageType from 'image-type';
import { ResponseHandler } from '../handlers/errorHandler';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, and WebP image types are allowed.'));
  }
  cb(null, true);
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
}).single('avatar');

export const avatarUploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  upload(req, res, (err: unknown): void => {
    if (err) {
      if (err instanceof MulterError || err instanceof Error) {
        ResponseHandler.badRequest(res, err.message);
        return;
      }
      next(err);
      return;
    }
    next();
  });
};

// Deep validation helper
export async function validateFileBuffer(file: Express.Multer.File): Promise<void> {
  if (!file.buffer) throw new Error('File buffer is missing');

  const fileType = await imageType(file.buffer);
  if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
    throw new Error('Uploaded file is not a valid JPG, PNG, or WebP image');
  }
}

