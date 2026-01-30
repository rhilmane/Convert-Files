import express from 'express';
import { upload } from '../middleware/upload.js';
import { submitConversion, getConversionStatus, downloadFile } from '../controllers/convertController.js';

const router = express.Router();

router.post('/convert', upload.single('file'), submitConversion);
router.get('/status/:jobId', getConversionStatus);
// router.get('/download/:jobId', downloadFile); // utilizing static middleware for now

export default router;
