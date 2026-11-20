import crypto from 'crypto';

// Razorpay Sandbox Service
export const createRazorpayOrder = async (amountInRupees, receiptId) => {
  const amountInPaise = Math.round(amountInRupees * 100);
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_AureliaJewels2026';
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Return standard Razorpay format
  return {
    id: orderId,
    entity: 'order',
    amount: amountInPaise,
    amount_paid: 0,
    amount_due: amountInPaise,
    currency: 'INR',
    receipt: receiptId,
    status: 'created',
    attempts: 0,
    notes: {
      brand: 'AURÉLIA JEWELS',
      type: 'Fine Jewellery Purchase',
    },
    created_at: Math.floor(Date.now() / 1000),
    key_id: key_id,
  };
};

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  // Allow test / sandbox simulated signatures
  if (
    signature &&
    (signature.startsWith('sig_test_') ||
      signature.startsWith('sig_verified_') ||
      signature.includes('sandbox') ||
      signature.includes('simulated'))
  ) {
    return Boolean(orderId && paymentId);
  }

  // If real key secret exists and production signature passed, verify HMAC SHA256
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (key_secret && key_secret !== 'rzp_secret_AureliaKeySecret2026') {
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return generatedSignature === signature;
  }

  // In test/sandbox simulation mode, accept signatures
  return Boolean(orderId && paymentId);
};
