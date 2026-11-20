import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or remove product from wishlist (toggle)
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const exists = wishlist.products.some((p) => p.toString() === productId);
    let message = '';
    let isWishlisted = false;

    if (exists) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
      message = 'Removed from your wishlist';
      isWishlisted = false;
    } else {
      wishlist.products.push(productId);
      message = 'Saved to your wishlist';
      isWishlisted = true;
    }

    await wishlist.save();
    await wishlist.populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' },
    });

    res.json({
      success: true,
      message,
      isWishlisted,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/move-to-cart
// @access  Private
export const moveToCart = async (req, res) => {
  try {
    const { productId, selectedVariant = 'Default' } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // 1. Remove from wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
      await wishlist.save();
    }

    // 2. Add to cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.selectedVariant === selectedVariant
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: 1,
        selectedVariant,
        price: product.price,
      });
    }

    // Recalculate
    let subtotal = 0;
    for (const item of cart.items) subtotal += item.price * item.quantity;
    cart.subtotal = subtotal;
    cart.shippingFee = subtotal > 5000 || subtotal === 0 ? 0 : 250;
    cart.taxAmount = Math.round(subtotal * 0.03);
    cart.totalAmount = cart.subtotal + cart.shippingFee + cart.taxAmount - (cart.coupon?.discountAmount || 0);

    await cart.save();

    res.json({
      success: true,
      message: 'Item moved from Wishlist to Shopping Bag',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
