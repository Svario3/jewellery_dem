import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Truck,
  ShieldCheck,
  Printer,
  ShoppingBag,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import { formatPrice } from '../components/common/ProductCard';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5DE88', '#23140C', '#C5A059'],
      });
    } catch (e) {
      console.warn('Confetti note:', e);
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await ordersAPI.getById(id);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-chocolate-800">Retrieving Royal Invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl border border-ivory-300 text-center space-y-3">
          <h2 className="font-serif text-2xl font-bold text-chocolate-900">Order Not Found</h2>
          <Link to="/" className="text-xs text-gold-800 font-semibold underline">
            Return to Aurélia Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 font-sans py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header */}
        <div className="bg-white rounded-3xl p-8 border border-gold-600/30 shadow-luxury text-center space-y-4 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-gold-50 border border-gold-300 mx-auto flex items-center justify-center text-gold-700 shadow-gold-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold block">
            Royal Acquisition Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-chocolate-900">
            Thank You for Your Patronage
          </h1>

          <p className="text-xs sm:text-sm text-chocolate-600 max-w-lg mx-auto font-light leading-relaxed">
            Your fine jewellery acquisition has been secured. Our Vault Concierge will authenticate your BIS hallmarked pieces before handing over to armored transit courier.
          </p>

          <div className="inline-block bg-ivory-100 px-4 py-2 rounded-xl border border-ivory-300 text-xs text-chocolate-800">
            Order Reference: <strong className="text-chocolate-900">{order.orderNumber}</strong>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="mt-8 bg-white rounded-2xl border border-ivory-300 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-ivory-200 gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-chocolate-900">
                Acquisition Invoice
              </h2>
              <span className="text-xs text-chocolate-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 border border-chocolate-800 text-chocolate-900 hover:bg-ivory-100 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-ivory-50 p-5 rounded-xl border border-ivory-200 text-xs">
            <div>
              <span className="font-semibold text-chocolate-900 uppercase tracking-wider block mb-1">
                Insured Shipping Address
              </span>
              <p className="text-chocolate-700 font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-chocolate-600">{order.shippingAddress.streetAddress}</p>
              <p className="text-chocolate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-chocolate-500 mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div>
              <span className="font-semibold text-chocolate-900 uppercase tracking-wider block mb-1">
                Payment & Order Status
              </span>
              <div className="space-y-1 text-chocolate-700">
                <p>
                  Method:{' '}
                  <strong className="text-chocolate-900">
                    {order.paymentMethod === 'Online_Razorpay' ? 'Razorpay Online Sandbox' : 'Cash on Delivery'}
                  </strong>
                </p>
                <p>
                  Payment Status:{' '}
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {order.isPaid ? 'Paid & Verified' : 'Awaiting Settlement'}
                  </span>
                </p>
                <p>
                  Fulfillment Status:{' '}
                  <span className="font-semibold text-chocolate-900">
                    {order.orderStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-chocolate-900">
              Acquired Masterpieces ({order.orderItems.length})
            </h3>
            <div className="divide-y divide-ivory-200 border-t border-b border-ivory-200">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-ivory-100 border border-ivory-200"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-chocolate-900">
                        {item.name}
                      </h4>
                      <p className="text-chocolate-500 text-[11px]">Variant: {item.selectedVariant}</p>
                      <p className="text-chocolate-500 text-[11px]">SKU: {item.sku}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-sans font-bold text-chocolate-900 text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <span className="block text-[11px] text-chocolate-500">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary Calculation */}
          <div className="max-w-xs ml-auto space-y-2 text-xs text-chocolate-700">
            <div className="flex justify-between">
              <span>Vault Subtotal</span>
              <span className="font-sans font-medium">{formatPrice(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Insured Transit</span>
              <span className="font-sans font-medium text-emerald-800 uppercase">Complimentary</span>
            </div>
            <div className="flex justify-between">
              <span>GST (3%)</span>
              <span className="font-sans font-medium">{formatPrice(order.taxPrice)}</span>
            </div>
            {order.discountPrice > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Voucher Discount</span>
                <span className="font-sans">-{formatPrice(order.discountPrice)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-ivory-200 flex justify-between text-base font-bold text-chocolate-900">
              <span>Grand Total</span>
              <span className="font-sans text-gold-900">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="pt-4 border-t border-ivory-200">
            <h3 className="font-serif text-sm font-bold text-chocolate-900 mb-3 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-gold-700" />
              <span>Acquisition Timeline</span>
            </h3>
            <div className="space-y-3">
              {order.statusTimeline?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-gold-600 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-chocolate-900">{item.status}</span>
                    <span className="text-chocolate-400 text-[11px] ml-2">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className="text-chocolate-600 text-[11px] font-light">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 justify-between items-center border-t border-ivory-200">
            <Link
              to="/account?tab=orders"
              className="text-xs text-gold-800 hover:text-chocolate-900 font-semibold underline tracking-wider"
            >
              View in My Orders History →
            </Link>
            <Link
              to="/shop"
              className="px-6 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition shadow-sm"
            >
              Continue Exploring The Vault
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
