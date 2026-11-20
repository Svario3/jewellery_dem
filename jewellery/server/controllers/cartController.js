import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Calculate cart totals
const recalculateCart = (cart) => {
  let subtotal = 0;
  for (const item of cart.items) {
    subtotal += item.price * item.quantity;
  }

  // Free shipping on orders over ₹5,000; otherwise ₹250
  const shippingFee = subtotal > 5000 || subtotal === 0 ? 0 : 250;

  // 3% standard GST for fine gold & diamond jewellery in India
  const taxAmount = Math.round(subtotal * 0.03);

  let discountAmount = 0;
  if (cart.coupon && cart.coupon.code) {
    if (cart.coupon.discountPercent) {
      discountAmount = Math.round((subtotal * cart.coupon.discountPercent) / 100);
    } else if (cart.coupon.discountAmount) {
      discountAmount = cart.coupon.discountAmount;
    }
  }

  const totalAmount = Math.max(0, subtotal + shippingFee + taxAmount - discountAmount);

  cart.subtotal = subtotal;
  cart.shippingFee = shippingFee;
  cart.taxAmount = taxAmount;
  cart.coupon.discountAmount = discountAmount;
  cart.totalAmount = totalAmount;

  return cart;
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images stock inStock metalType purity sku',
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        subtotal: 0,
        shippingFee: 0,
        taxAmount: 0,
        totalAmount: 0,
      });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedVariant = 'Default' } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items currently available in vault`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if same item & variant already in cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedVariant === selectedVariant
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Vault stock limit reached (${product.stock} max available)`,
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        selectedVariant,
        price: product.price,
      });
    }

    recalculateCart(cart);
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images stock inStock metalType purity sku',
    });

    res.json({ success: true, message: 'Item added to shopping bag', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/item/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in bag' });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      const product = await Product.findById(item.product);
      if (product && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} pieces available in stock`,
        });
      }
      item.quantity = quantity;
    }

    recalculateCart(cart);
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images stock inStock metalType purity sku',
    });

    res.json({ success: true, message: 'Bag updated', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:itemId
// @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    recalculateCart(cart);
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images stock inStock metalType purity sku',
    });

    res.json({ success: true, message: 'Item removed from bag', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply coupon code
// @route   POST /api/cart/coupon
// @access  Private
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide coupon code' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your bag is empty' });
    }

    const cleanCode = code.trim().toUpperCase();

    // Valid coupons
    if (cleanCode === 'AURELIA10') {
      cart.coupon = { code: 'AURELIA10', discountPercent: 10, discountAmount: 0 };
    } else if (cleanCode === 'BRIDAL5000' && cart.subtotal >= 40000) {
      cart.coupon = { code: 'BRIDAL5000', discountPercent: 0, discountAmount: 5000 };
    } else if (cleanCode === 'FIRSTGOLD') {
      cart.coupon = { code: 'FIRSTGOLD', discountPercent: 5, discountAmount: 0 };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired promotional code. Try AURELIA10 for 10% off.',
      });
    }

    recalculateCart(cart);
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images stock inStock metalType purity sku',
    });

    res.json({
      success: true,
      message: `Promotional code ${cleanCode} applied!`,
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.coupon = { code: null, discountPercent: 0, discountAmount: 0 };
      recalculateCart(cart);
      await cart.save();
    }
    res.json({ success: true, message: 'Bag cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
