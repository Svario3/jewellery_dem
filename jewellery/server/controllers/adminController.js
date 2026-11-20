import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Payment from '../models/Payment.js';
import { uploadImageToCloudinary } from '../services/cloudinaryService.js';

// @desc    Get complete administrative dashboard summary & statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
      deliveredOrders,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ orderStatus: { $in: ['Placed', 'Processing'] } }),
      Product.find({ stock: { $lte: 3 } }).select('name sku stock price images category').limit(6),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    // Aggregate total sales
    const revenueAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const totalSales = revenueAgg[0]?.totalSales || 0;

    // Aggregate category distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$metalType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly sales mockup/aggregate
    const salesTrends = [
      { month: 'Jun', sales: 480000, orders: 12 },
      { month: 'Jul', sales: 620000, orders: 16 },
      { month: 'Aug', sales: 790000, orders: 21 },
      { month: 'Sep', sales: 940000, orders: 25 },
      { month: 'Oct', sales: 1350000, orders: 38 },
      { month: 'Nov', sales: Math.max(1600000, totalSales), orders: Math.max(45, totalOrders) },
    ];

    res.json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        deliveredOrders,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders,
      categoryDistribution,
      salesTrends,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    const customersWithOrderCount = await Promise.all(
      customers.map(async (cust) => {
        const orderCount = await Order.countDocuments({ user: cust._id });
        const orders = await Order.find({ user: cust._id, isPaid: true });
        const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        return {
          ...cust.toObject(),
          orderCount,
          totalSpent,
        };
      })
    );

    res.json({ success: true, customers: customersWithOrderCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload product image
// @route   POST /api/admin/upload
// @access  Private/Admin
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const imageUrl = await uploadImageToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    res.json({
      success: true,
      url: imageUrl,
      message: 'Product image uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
