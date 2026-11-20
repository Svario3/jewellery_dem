import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../common/ProductCard';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalCount,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 5000;
  const amountNeeded = Math.max(0, freeShippingThreshold - cart.subtotal);
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory-50 shadow-2xl flex flex-col justify-between border-l border-gold-600/30">
          {/* Header */}
          <div className="p-5 border-b border-ivory-200 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-gold-700" />
              <h2 className="font-serif text-xl font-bold text-chocolate-900">
                Your Shopping Bag
              </h2>
              <span className="text-xs bg-gold-100 text-gold-900 px-2 py-0.5 rounded-full font-semibold">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-chocolate-600 hover:text-gold-700 hover:bg-ivory-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Insured Shipping Progress Bar */}
          <div className="bg-ivory-100 px-5 py-3 border-b border-ivory-200 text-xs">
            {amountNeeded > 0 ? (
              <p className="text-chocolate-700 mb-1.5">
                Add <span className="font-bold text-gold-800">{formatPrice(amountNeeded)}</span> more for <span className="font-semibold">Complimentary Insured Delivery</span>
              </p>
            ) : (
              <p className="text-emerald-800 font-semibold mb-1.5 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>You have unlocked Complimentary Insured Delivery!</span>
              </p>
            )}
            <div className="w-full bg-ivory-300 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gold-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-ivory-200 mx-auto flex items-center justify-center text-chocolate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-chocolate-800">Your bag is empty</h3>
                <p className="text-xs text-chocolate-500 max-w-xs mx-auto">
                  Explore our royal collection of hallmarked gold, uncut polki, and solitaire diamonds.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-widest transition"
                >
                  Explore The Vault
                </button>
              </div>
            ) : (
              cart.items.map((item, idx) => {
                const prod = item.product || {};
                const imageUrl = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';
                const itemId = item._id || idx;

                return (
                  <div
                    key={itemId}
                    className="flex space-x-3 bg-white p-3 rounded-xl border border-ivory-200 shadow-sm"
                  >
                    <img
                      src={imageUrl}
                      alt={prod.name || 'Jewellery'}
                      className="w-20 h-20 object-cover rounded-lg bg-ivory-100 flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif text-sm font-semibold text-chocolate-900 line-clamp-1">
                            {prod.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="text-chocolate-400 hover:text-red-600 transition ml-2"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-chocolate-500 mt-0.5">
                          Variant: {item.selectedVariant || 'Standard'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-ivory-300 rounded bg-ivory-50 text-xs">
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className="px-2 py-0.5 text-chocolate-700 hover:text-gold-700 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="px-2 py-0.5 text-chocolate-700 hover:text-gold-700 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold text-chocolate-900 font-sans">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.items.length > 0 && (
            <div className="p-5 bg-white border-t border-ivory-200 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-chocolate-600">
                  <span>Vault Subtotal</span>
                  <span className="font-sans font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-chocolate-600">
                  <span>Insured Shipping</span>
                  <span className="font-sans font-medium">
                    {cart.shippingFee === 0 ? (
                      <span className="text-emerald-700 uppercase font-semibold">Free</span>
                    ) : (
                      formatPrice(cart.shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-chocolate-600">
                  <span>Estimated 3% GST</span>
                  <span className="font-sans font-medium">{formatPrice(cart.taxAmount)}</span>
                </div>
                {cart.coupon?.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({cart.coupon.code})</span>
                    <span className="font-sans">-{formatPrice(cart.coupon.discountAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-ivory-200 flex justify-between text-base font-bold text-chocolate-900">
                  <span>Grand Total</span>
                  <span className="font-sans text-gold-900">{formatPrice(cart.totalAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 text-center border border-chocolate-800 text-chocolate-900 hover:bg-ivory-200 rounded-lg text-xs font-semibold uppercase tracking-wider transition"
                >
                  View Full Bag
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-chocolate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-700" />
                <span>100% Certified Safe Checkout • Encrypted Gateway</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
