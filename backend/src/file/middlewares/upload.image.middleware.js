import multer from 'multer';

const base = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(png|jpe?g|webp|avif)$/.test(file.mimetype)) {
      return cb(new Error('Unsupported image type'));
    }
    cb(null, true);
  },
});

export const uploadImageMiddleware = base.single('image');
export const uploadIconMiddleware = base.single('icon');
