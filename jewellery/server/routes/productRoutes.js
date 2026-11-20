import express from 'express';
import {
  getProducts,
  getProductBySlugOrId,
  getCuratedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/curated', getCuratedProducts);
router.get('/:slugOrId', getProductBySlugOrId);
router.get('/:id/related', getRelatedProducts);

// Admin operations
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
