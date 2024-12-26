import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { createApiError } from './modelHelpers';
import { MSG } from './constants';

const config = {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,
  width: 800,
  height: 600,
  quality: 90,
  uploadDir: path.join(__dirname, '../../uploads')
};

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(createApiError(400, MSG.bad_data));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxSize,
    files: config.maxFiles
  }
});

const ensureUploadDir = () => {
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }
};

const generateFilename = (originalname: string) => 
  `img-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(originalname)}`;

const processOneImage = async (file: Express.Multer.File): Promise<string> => {
  ensureUploadDir();
  const filename = generateFilename(file.originalname);

  await sharp(file.buffer)
    .resize(config.width, config.height, { fit: 'cover' })
    .jpeg({ quality: config.quality })
    .toFile(path.join(config.uploadDir, filename));

  return filename;
};

export const processImage = processOneImage;

export const processImages = (files: Express.Multer.File[]): Promise<string[]> => 
  Promise.all(files.map(processOneImage)); 