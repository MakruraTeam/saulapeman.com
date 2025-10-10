import { Router } from 'express';
import { streamImageController, uploadImageController } from '../controllers/images.controller';
import { setFolderIconController } from '../controllers/icon.controller';
import {
  createFolderController,
  getFolderByIdController,
  getAllFilesInsideFolderController,
  editFolderController,
  deleteFolderController,
} from '../controllers/folder.controller';
import { getAllFilesController, moveToRecycleBinController } from '../controllers/file.controller';
import { uploadImageMiddleware, uploadIconMiddleware } from '../middlewares/upload.image.middleware';

const router = Router();

// images
router.post('/images', uploadImageMiddleware, uploadImageController);
router.get('/images/:imageId', streamImageController);

// folders
router.post('/folders', uploadIconMiddleware, createFolderController);
router.get('/folders/:folderId', getFolderByIdController);
router.get('/folders/:folderId/children', getAllFilesInsideFolderController);
router.patch('/folders/:folderId', uploadIconMiddleware, editFolderController);
router.delete('/folders/:folderId', deleteFolderController);

// folder icon
router.post('/folders/:folderId/icon', uploadIconMiddleware, setFolderIconController);

// files
router.get('/', getAllFilesController);
router.post('/:fileId/recycle', moveToRecycleBinController);

export default router;
