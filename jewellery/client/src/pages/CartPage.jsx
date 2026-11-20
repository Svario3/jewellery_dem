import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Gift,
  ShoppingBag,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../components/common/ProductCard';

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
  };

  const giftWrapFee = giftWrap ? 150 : 0;
  const grandTotal = cart.totalAmount + giftWrapFee;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-ivory-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-ivory-300 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-ivory-200 mx-auto flex items-center justify-center text-chocolate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-chocolate-900">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs text-chocolate-600 leading-relaxed font-light">
            You have not yet selected any royal jewels for your collection. Explore our hallmarked gold, uncut polki, and solitaire diamonds.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold tracking-widest uppercase transition duration-300 shadow-sm"
          >
            Explore The Vault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-ivory-300">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              Review Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-chocolate-900 mt-0.5">
              Your Royal Shopping Bag
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-chocolate-500 hover:text-red-700 underline font-medium flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
          {/* Left 2 Cols: Cart Line Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm divide-y divide-ivory-200 overflow-hidden">
              {cart.items.map((item, idx) => {
                const prod = item.product || {};
                const imageUrl = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';
                const itemId = item._id || idx;

                return (
                  <div key={itemId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Link to={`/product/${prod.slug || ''}`}>
                        <img
                          src={imageUrl}
                          alt={prod.name || 'Jewel'}
                          className="w-24 h-24 object-cover rounded-xl bg-ivory-100 flex-shrink-0 border border-ivory-200"
                        />
                      </Link>

                      <div className="space-y-1">
                        <Link to={`/product/${prod.slug || ''}`}>
                          <h3 className="font-serif text-base sm:text-lg font-semibold text-chocolate-900 hover:text-gold-700 transition line-clamp-1">
                            {prod.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-chocolate-500">
                          Variant: <span className="font-medium text-chocolate-800">{item.selectedVariant || 'Standard'}</span>
                        </p>
                        <p className="text-xs text-chocolate-500">
                          Metal: <span className="font-medium text-chocolate-800">{prod.metalType || '22K Gold'}</span>
                        </p>
                        <span className="inline-block text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                          BIS Hallmarked
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-bold text-chocolate-900 font-sans">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[11px] text-chocolate-400 font-sans">
                            {formatPrice(item.price)} each
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Stepper */}
                        <div className="flex items-center border border-ivory-300 rounded-lg bg-ivory-50 text-xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className="px-2.5 py-1 text-chocolate-800 hover:text-gold-700 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2.5 font-semibold text-chocolate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="px-2.5 py-1 text-chocolate-800 hover:text-gold-700 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(itemId)}
                          className="p-1.5 text-chocolate-400 hover:text-red-700 rounded transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Luxury Gift Wrap Addon */}
            <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-chocolate-900">
                    Complimentary Velvet Keepsake & Wax Seal Card (+₹150)
                  </h4>
                  <p className="text-xs text-chocolate-500 font-light">
                    Archival velvet presentation box, embossed satin ribbon, and personalized calligraphy note.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="w-5 h-5 text-gold-700 border-ivory-300 rounded focus:ring-gold-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Col: Order Summary & Checkout Action */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-5">
              <h3 className="font-serif text-xl font-bold text-chocolate-900 pb-3 border-b border-ivory-200">
                Order Summary
              </h3>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
                  Promotional Voucher
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. AURELIA10"
                      className="w-full pl-8 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs uppercase text-chocolate-900 focus:outline-none focus:border-gold-600"
                    />
                    <Tag className="w-3.5 h-3.5 text-chocolate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                <div className="text-[11px] text-chocolate-500 flex items-center justify-between pt-1">
                  <span>Available code: <strong>AURELIA10</strong> (10% off)</span>
                </div>
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-chocolate-700 pt-3 border-t border-ivory-200">
                <div className="flex justify-between">
                  <span>Vault Subtotal</span>
                  <span className="font-sans font-semibold text-chocolate-900">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Pan-India Delivery</span>
                  <span className="font-sans font-semibold">
                    {cart.shippingFee === 0 ? (
                      <span className="text-emerald-700 uppercase">Complimentary</span>
                    ) : (
                      formatPrice(cart.shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3% fine jewellery)</span>
                  <span className="font-sans font-semibold text-chocolate-900">{formatPrice(cart.taxAmount)}</span>
                </div>
                {giftWrap && (
                  <div className="flex justify-between text-chocolate-700">
                    <span>Velvet Box & Calligraphy Card</span>
                    <span className="font-sans font-semibold">+₹150</span>
                  </div>
                )}
                {cart.coupon?.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                    <span>Voucher Applied ({cart.coupon.code})</span>
                    <span className="font-sans">-{formatPrice(cart.coupon.discountAmount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-ivory-200 flex justify-between text-lg font-bold text-chocolate-900">
                  <span>Grand Total</span>
                  <span className="font-sans text-gold-900">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-xl text-xs font-semibold tracking-widest uppercase transition duration-300 flex items-center justify-center space-x-2 shadow-sm border border-gold-600/30"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[10px] text-chocolate-500 space-y-1">
                <p className="flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-700" />
                  <span>Door-to-door transit insurance covered by Aurélia Jewels</span>
                </p>
                <p>30-Day Hassle-Free Returns & Benchmark Gold Buyback</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/shop"
                className="text-xs text-chocolate-700 hover:text-gold-800 font-semibold underline tracking-wider"
              >
                ← Continue Browsing Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
