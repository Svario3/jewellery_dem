import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'Online_Razorpay',
      couponCode,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.streetAddress || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Shipping address required' });
    }

    // Server-side inventory and price verification
    let itemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || item.product} is no longer available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Vault stock insufficient for ${product.name}. Available: ${product.stock}`,
        });
      }

      itemsPrice += product.price * item.quantity;
      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        price: product.price,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant || 'Default',
        sku: product.sku,
      });

      // Deduct inventory
      product.stock -= item.quantity;
      product.inStock = product.stock > 0;
      await product.save();
    }

    // Shipping calculations (free above ₹5000)
    const shippingPrice = itemsPrice > 5000 ? 0 : 250;

    // 3% fine jewellery GST
    const taxPrice = Math.round(itemsPrice * 0.03);

    // Apply coupon discount if verified
    let discountPrice = 0;
    if (couponCode === 'AURELIA10') {
      discountPrice = Math.round(itemsPrice * 0.1);
    } else if (couponCode === 'BRIDAL5000' && itemsPrice >= 40000) {
      discountPrice = 5000;
    } else if (couponCode === 'FIRSTGOLD') {
      discountPrice = Math.round(itemsPrice * 0.05);
    }

    const totalPrice = Math.max(0, itemsPrice + shippingPrice + taxPrice - discountPrice);

    // Generate unique royal order reference
    const orderNumber = `AUR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const isCOD = paymentMethod === 'COD';

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      orderStatus: 'Placed',
      statusTimeline: [
        {
          status: 'Placed',
          note: isCOD
            ? 'Order received with Cash on Delivery option. Our concierge will verify before dispatch.'
            : 'Order received. Awaiting online payment confirmation.',
          timestamp: new Date(),
        },
      ],
    });

    // Clear user's active cart after placing order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], coupon: { code: null, discountPercent: 0, discountAmount: 0 }, subtotal: 0, shippingFee: 0, taxAmount: 0, totalAmount: 0 }
    );

    res.status(201).json({
      success: true,
      message: 'Your royal order has been placed successfully!',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name slug sku images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Security: Only order owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Access to this private customer order is denied',
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: new RegExp(search, 'i') },
        { 'shippingAddress.fullName': new RegExp(search, 'i') },
        { 'shippingAddress.phone': new RegExp(search, 'i') },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    order.statusTimeline.push({
      status,
      note: note || `Status updated to ${status} by Order Concierge`,
      timestamp: new Date(),
    });

    const updated = await order.save();
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
