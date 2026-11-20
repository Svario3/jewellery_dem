import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.post('/coupon', applyCoupon);
router.delete('/', clearCart);

export default router;
