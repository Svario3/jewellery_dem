import express from 'express';
import {
  getProductReviews,
  addReview,
  getAllReviewsAdmin,
  toggleReviewApproval,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, addReview);

// Admin
router.get('/admin', protect, admin, getAllReviewsAdmin);
router.put('/admin/:id/toggle', protect, admin, toggleReviewApproval);

export default router;
