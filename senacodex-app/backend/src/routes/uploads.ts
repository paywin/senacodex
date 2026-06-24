import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '@/middleware';
import * as uploadController from '@/controllers/uploads';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  }
});

router.use(authMiddleware);

router.post('/:id/versions', upload.array('files', 20), uploadController.uploadFileHandler);
router.get('/:id/versions', uploadController.getProjectVersionsHandler);
router.get('/:id/files/:fileId/download', uploadController.downloadFileHandler);

export default router;
