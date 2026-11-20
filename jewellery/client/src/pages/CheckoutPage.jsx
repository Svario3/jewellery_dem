import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addressesAPI, ordersAPI, paymentsAPI } from '../services/api';
import { formatPrice } from '../components/common/ProductCard';

const CheckoutPage = () => {
  const { cart, clearCart, showToast } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  // New address form state
  const [addressForm, setAddressForm] = useState({
    fullName: user ? user.name : '',
    phone: user ? user.phone : '',
    streetAddress: '',
    apartment: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'Home',
  });

  const [paymentMethod, setPaymentMethod] = useState('Online_Razorpay');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Simulated Razorpay Modal state
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);
  const [simulatedCard, setSimulatedCard] = useState({
    number: '4111 2222 3333 4444',
    name: user ? user.name : 'Royal Patron',
    expiry: '12/28',
    cvv: '999',
  });

  useEffect(() => {
    if (!user) {
      // Redirect to login if user isn't logged in, passing return URL
      navigate('/login?redirect=/checkout');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await addressesAPI.getAll();
        if (res.data.success && res.data.addresses.length > 0) {
          setSavedAddresses(res.data.addresses);
          const defaultAddr = res.data.addresses.find((a) => a.isDefault);
          setSelectedAddressId(defaultAddr ? defaultAddr._id : res.data.addresses[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      }
    };

    fetchAddresses();
  }, [user, navigate]);

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-ivory-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-ivory-300 text-center shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-chocolate-900">Your Bag is Empty</h2>
          <p className="text-xs text-chocolate-600">Please select jewels to checkout.</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-chocolate-900 text-gold-300 rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Determine shipping address object
    let shippingAddress = null;
    if (selectedAddressId !== 'new') {
      const found = savedAddresses.find((a) => a._id === selectedAddressId);
      if (found) {
        shippingAddress = {
          fullName: found.fullName,
          phone: found.phone,
          streetAddress: found.streetAddress,
          apartment: found.apartment,
          landmark: found.landmark,
          city: found.city,
          state: found.state,
          postalCode: found.postalCode,
          country: found.country,
        };
      }
    } else {
      if (
        !addressForm.fullName ||
        !addressForm.phone ||
        !addressForm.streetAddress ||
        !addressForm.city ||
        !addressForm.state ||
        !addressForm.postalCode
      ) {
        setErrorMsg('Please complete all mandatory shipping address fields');
        return;
      }
      shippingAddress = addressForm;

      // Save this new address for the user
      try {
        await addressesAPI.add(addressForm);
      } catch (err) {
        console.warn('Could not save address to profile:', err);
      }
    }

    try {
      setLoading(true);

      // Create Order in MongoDB
      const orderPayload = {
        orderItems: cart.items.map((i) => ({
          product: i.product._id || i.product,
          name: i.product.name,
          image: i.product.images?.[0]?.url || '',
          price: i.price,
          quantity: i.quantity,
          selectedVariant: i.selectedVariant,
          sku: i.product.sku,
        })),
        shippingAddress,
        paymentMethod,
        couponCode: cart.coupon?.code || null,
      };

      const res = await ordersAPI.create(orderPayload);

      if (res.data.success) {
        const createdOrder = res.data.order;

        if (paymentMethod === 'COD') {
          // Cash on Delivery finishes immediately
          await clearCart();
          navigate(`/order-confirmation/${createdOrder._id}`);
        } else {
          // Online Razorpay Payment Sandbox flow
          const payRes = await paymentsAPI.createOrder(createdOrder._id);
          if (payRes.data.success) {
            setActivePaymentOrder({
              orderId: createdOrder._id,
              orderNumber: createdOrder.orderNumber,
              totalAmount: createdOrder.totalPrice,
              razorpayOrder: payRes.data.razorpayOrder,
            });
            setRazorpayModalOpen(true);
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    try {
      setLoading(true);
      const verifyRes = await paymentsAPI.verify({
        orderId: activePaymentOrder.orderId,
        razorpay_order_id: activePaymentOrder.razorpayOrder.id,
        razorpay_payment_id: `pay_sim_${Date.now()}`,
        razorpay_signature: `sig_verified_${Date.now()}`,
      });

      if (verifyRes.data.success) {
        await clearCart();
        setRazorpayModalOpen(false);
        navigate(`/order-confirmation/${activePaymentOrder.orderId}`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Payment simulation verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-ivory-300 mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Secure Transaction
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-chocolate-900 mt-0.5">
            Royal Vault Checkout
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Columns: Address & Payment Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. Delivery Address Card */}
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-5">
                <div className="flex items-center space-x-2 pb-3 border-b border-ivory-200">
                  <MapPin className="w-5 h-5 text-gold-700" />
                  <h2 className="font-serif text-xl font-bold text-chocolate-900">
                    1. Delivery Address
                  </h2>
                </div>

                {/* Saved addresses selector if any exist */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
                      Select Saved Address
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr._id}
                          className={`p-4 rounded-xl border cursor-pointer transition text-xs block relative ${
                            selectedAddressId === addr._id
                              ? 'border-gold-600 bg-gold-50/50 shadow-sm'
                              : 'border-ivory-300 hover:border-gold-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="addressSelection"
                            value={addr._id}
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="sr-only"
                          />
                          <div className="font-bold text-chocolate-900 flex justify-between">
                            <span>{addr.fullName}</span>
                            <span className="text-[10px] bg-ivory-200 px-1.5 py-0.5 rounded text-chocolate-600">
                              {addr.addressType}
                            </span>
                          </div>
                          <p className="text-chocolate-600 mt-1 leading-relaxed">
                            {addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-chocolate-500 mt-1">Phone: {addr.phone}</p>
                        </label>
                      ))}

                      <label
                        className={`p-4 rounded-xl border cursor-pointer transition text-xs flex items-center justify-center font-medium ${
                          selectedAddressId === 'new'
                            ? 'border-gold-600 bg-gold-50/50 text-gold-900'
                            : 'border-dashed border-ivory-300 text-chocolate-600 hover:border-gold-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="addressSelection"
                          value="new"
                          checked={selectedAddressId === 'new'}
                          onChange={() => setSelectedAddressId('new')}
                          className="sr-only"
                        />
                        <span>+ Enter New Shipping Address</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* New Address Form fields if selected 'new' */}
                {selectedAddressId === 'new' && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                          Phone Number (for Courier Delivery) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                        Street Address / Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.streetAddress}
                        onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                        placeholder="House/Villa No., Street Name, Colony"
                        className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          placeholder="e.g. 400049"
                          className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Payment Method Card */}
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-5">
                <div className="flex items-center space-x-2 pb-3 border-b border-ivory-200">
                  <CreditCard className="w-5 h-5 text-gold-700" />
                  <h2 className="font-serif text-xl font-bold text-chocolate-900">
                    2. Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Razorpay Online Sandbox Option */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition block relative ${
                      paymentMethod === 'Online_Razorpay'
                        ? 'border-gold-600 bg-gold-50/50 shadow-sm'
                        : 'border-ivory-300 hover:border-gold-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Online_Razorpay"
                          checked={paymentMethod === 'Online_Razorpay'}
                          onChange={() => setPaymentMethod('Online_Razorpay')}
                          className="w-4 h-4 text-gold-700 focus:ring-gold-500"
                        />
                        <div>
                          <span className="font-bold text-sm text-chocolate-900 block">
                            Razorpay Test Sandbox (Cards, UPI, NetBanking)
                          </span>
                          <span className="text-xs text-chocolate-600 font-light">
                            Instant secure verification. Sandbox test mode active.
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Recommended
                      </span>
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition block relative ${
                      paymentMethod === 'COD'
                        ? 'border-gold-600 bg-gold-50/50 shadow-sm'
                        : 'border-ivory-300 hover:border-gold-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="w-4 h-4 text-gold-700 focus:ring-gold-500"
                        />
                        <div>
                          <span className="font-bold text-sm text-chocolate-900 block">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-xs text-chocolate-600 font-light">
                            Pay in cash or UPI at the time of insured armored delivery.
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Submit */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-4">
                <h3 className="font-serif text-xl font-bold text-chocolate-900 pb-3 border-b border-ivory-200">
                  Review & Authorize
                </h3>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-ivory-100 pr-1">
                  {cart.items.map((it, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <img
                          src={it.product.images?.[0]?.url || ''}
                          alt=""
                          className="w-10 h-10 object-cover rounded bg-ivory-100 border"
                        />
                        <div>
                          <p className="font-semibold text-chocolate-900 line-clamp-1">{it.product.name}</p>
                          <p className="text-[11px] text-chocolate-500">Qty: {it.quantity} • {it.selectedVariant}</p>
                        </div>
                      </div>
                      <span className="font-sans font-semibold text-chocolate-900">
                        {formatPrice(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary amounts */}
                <div className="space-y-2 text-xs text-chocolate-700 pt-3 border-t border-ivory-200">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-sans font-medium">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Delivery</span>
                    <span className="font-sans font-medium text-emerald-800 uppercase">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (3%)</span>
                    <span className="font-sans font-medium">{formatPrice(cart.taxAmount)}</span>
                  </div>
                  {cart.coupon?.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Voucher Discount</span>
                      <span className="font-sans">-{formatPrice(cart.coupon.discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-ivory-200 flex justify-between text-base font-bold text-chocolate-900">
                    <span>Total Payable</span>
                    <span className="font-sans text-gold-900">{formatPrice(cart.totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-xl text-xs font-semibold tracking-widest uppercase transition duration-300 flex items-center justify-center space-x-2 shadow-sm border border-gold-600/30 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Securing Order...' : 'Authorize & Place Order'}</span>
                </button>

                <div className="flex items-center justify-center space-x-1.5 text-[10px] text-chocolate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-gold-700" />
                  <span>256-Bit SSL Encrypted & Certified Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Razorpay Test Modal Simulation */}
      {razorpayModalOpen && activePaymentOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gold-600/40 space-y-5 animate-in fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-chocolate-900 text-gold-400 font-serif font-bold flex items-center justify-center">
                  AJ
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-chocolate-900">
                    Aurélia Jewels Gateway
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Razorpay Test Sandbox Simulation
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold font-sans text-chocolate-900">
                {formatPrice(activePaymentOrder.totalAmount)}
              </span>
            </div>

            {/* Test Card simulation details */}
            <div className="bg-ivory-100 p-4 rounded-xl space-y-3 text-xs border border-ivory-200">
              <div className="flex justify-between text-chocolate-600">
                <span>Order Reference:</span>
                <span className="font-semibold text-chocolate-900">{activePaymentOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between text-chocolate-600">
                <span>Sandbox Mode:</span>
                <span className="text-emerald-700 font-medium">Auto-approved Test Credentials</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-chocolate-700 mb-1">
                  Test Card Number
                </label>
                <input
                  type="text"
                  value={simulatedCard.number}
                  onChange={(e) => setSimulatedCard({ ...simulatedCard, number: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border rounded-lg text-xs font-mono font-bold text-chocolate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-chocolate-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={simulatedCard.expiry}
                    onChange={(e) => setSimulatedCard({ ...simulatedCard, expiry: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg text-xs font-mono text-chocolate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-chocolate-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={simulatedCard.cvv}
                    onChange={(e) => setSimulatedCard({ ...simulatedCard, cvv: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border rounded-lg text-xs font-mono text-chocolate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={loading}
                className="w-full py-3 bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl text-xs font-semibold tracking-wider uppercase transition flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Simulate Successful Payment ({formatPrice(activePaymentOrder.totalAmount)})</span>
              </button>

              <button
                type="button"
                onClick={() => setRazorpayModalOpen(false)}
                className="w-full py-2 text-center text-xs text-chocolate-600 hover:text-chocolate-900 font-medium"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
