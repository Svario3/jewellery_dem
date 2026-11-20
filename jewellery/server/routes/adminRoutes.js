import express from 'express';
import multer from 'multer';
import {
  getAdminDashboardStats,
  getAllCustomers,
  uploadProductImage,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getAdminDashboardStats);
router.get('/customers', getAllCustomers);
router.post('/upload', upload.single('image'), uploadProductImage);

export default router;
