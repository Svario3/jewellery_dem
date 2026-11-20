import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService.js';

// @desc    Initialize Razorpay payment order
// @route   POST /api/payments/create-order
// @access  Private
export const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to order' });
    }

    if (order.isPaid) {
      return res.status(400).json({ success: false, message: 'Order is already marked paid' });
    }

    const razorpayOrder = await createRazorpayOrder(order.totalPrice, order.orderNumber);

    res.json({
      success: true,
      razorpayOrder,
      key: razorpayOrder.key_id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderNumber: order.orderNumber,
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || order.shippingAddress.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay payment and capture order
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: invalid signature',
      });
    }

    // Record payment document
    await Payment.create({
      order: order._id,
      user: req.user._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature || 'simulated_sig_verified',
      amount: order.totalPrice,
      currency: 'INR',
      status: 'captured',
      method: 'Online_Razorpay',
    });

    // Update order status
    order.isPaid = true;
    order.paidAt = new Date();
    order.orderStatus = 'Processing';
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'captured',
      update_time: new Date().toISOString(),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    };
    order.statusTimeline.push({
      status: 'Processing',
      note: `Payment verified successfully via Razorpay (Ref: ${razorpay_payment_id}). Order sent to Vault for hallmarked packaging.`,
      timestamp: new Date(),
    });

    await order.save();

    res.json({
      success: true,
      message: 'Payment successfully captured and verified!',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
