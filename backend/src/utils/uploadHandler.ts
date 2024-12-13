import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { createApiError } from './modelHelpers';
import { HTTP_CODES, ERROR_MESSAGES } from './constants';

// Storage configuration
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_FILE_TYPE));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // Maximum 5 files
  }
});

// Process single image
export const processImage = async (file: Express.Multer.File): Promise<string> => {
  const filename = `event-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
  const uploadPath = path.join(__dirname, '../../uploads');

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Process and save image
  await sharp(file.buffer)
    .resize(800, 600, { fit: 'cover' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(uploadPath, filename));

  return filename;
};

// Process multiple images
export const processImages = async (files: Express.Multer.File[]): Promise<string[]> => {
  const filenames: string[] = [];
  
  for (const file of files) {
    const filename = await processImage(file);
    filenames.push(filename);
  }

  return filenames;
}; 