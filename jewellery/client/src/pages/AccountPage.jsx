import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Check,
  Clock,
  ShieldCheck,
  Edit,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, addressesAPI } from '../services/api';
import { formatPrice } from '../components/common/ProductCard';

const AccountPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  // Profile Edit State
  const [name, setName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
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
    isDefault: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/account');
      return;
    }

    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [user, activeTab, navigate]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await ordersAPI.getMyOrders();
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const res = await addressesAPI.getAll();
      if (res.data.success) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      setProfileLoading(true);
      const payload = { name, phone };
      if (password) payload.password = password;
      await updateProfile(payload);
      setProfileMsg('Profile updated successfully');
      setPassword('');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Error updating profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addressesAPI.add(newAddress);
      setShowAddAddressModal(false);
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you wish to delete this delivery address?')) {
      try {
        await addressesAPI.delete(id);
        fetchAddresses();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete address');
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await addressesAPI.setDefault(id);
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to set default address');
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-6 border-b border-ivory-300 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              Patron Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-chocolate-900 mt-0.5">
              Welcome, {user?.name}
            </h1>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 border border-chocolate-800 text-chocolate-900 hover:bg-ivory-200 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Layout with Sidebar Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Tabs Menu */}
          <aside className="space-y-2">
            {[
              { id: 'profile', label: 'My Royal Profile', icon: User },
              { id: 'orders', label: 'Order History & Tracking', icon: Package },
              { id: 'addresses', label: 'Saved Delivery Addresses', icon: MapPin },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-3 transition ${
                    activeTab === tab.id
                      ? 'bg-chocolate-900 text-gold-300 shadow-sm'
                      : 'bg-white text-chocolate-800 hover:bg-ivory-200 border border-ivory-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold-600" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <Link
              to="/wishlist"
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-3 bg-white text-chocolate-800 hover:bg-ivory-200 border border-ivory-300 transition"
            >
              <Heart className="w-4 h-4 text-gold-600" />
              <span>Private Wishlist</span>
            </Link>
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-3">
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ivory-300 shadow-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-chocolate-900 pb-3 border-b border-ivory-200">
                  Profile Information
                </h2>

                {profileMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800">
                    {profileMsg}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                      Email Address (Cannot be modified)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3 py-2 bg-ivory-200 border border-ivory-300 rounded-lg text-xs text-chocolate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                      Change Vault Password (Optional)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep unchanged"
                      className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50"
                  >
                    {profileLoading ? 'Saving...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ivory-300 shadow-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-chocolate-900 pb-3 border-b border-ivory-200">
                  Your Order History & Tracking
                </h2>

                {ordersLoading ? (
                  <p className="text-xs text-chocolate-500">Loading order records...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <p className="text-xs text-chocolate-600">No orders found in your vault history.</p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-2 bg-chocolate-900 text-gold-300 rounded-lg text-xs font-semibold uppercase tracking-wider"
                    >
                      Shop Fine Jewels
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div
                        key={o._id}
                        className="p-5 rounded-xl border border-ivory-300 bg-ivory-50/50 space-y-4 hover:border-gold-500 transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ivory-200 pb-3 text-xs">
                          <div>
                            <span className="font-bold text-chocolate-900">{o.orderNumber}</span>
                            <span className="text-chocolate-500 ml-2">
                              {new Date(o.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              o.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gold-100 text-gold-900'
                            }`}>
                              {o.orderStatus}
                            </span>
                            <span className="font-bold font-sans text-chocolate-900">
                              {formatPrice(o.totalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {o.orderItems.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 text-xs">
                              <img
                                src={item.image}
                                alt=""
                                className="w-12 h-12 object-cover rounded bg-white border"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-chocolate-900 line-clamp-1">{item.name}</p>
                                <p className="text-[11px] text-chocolate-500">Qty: {item.quantity} • {item.selectedVariant}</p>
                              </div>
                              <span className="font-sans font-medium text-chocolate-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            to={`/order-confirmation/${o._id}`}
                            className="text-xs text-gold-800 hover:text-chocolate-900 font-semibold underline"
                          >
                            View Receipt & Tracking Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ivory-300 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                  <h2 className="font-serif text-2xl font-bold text-chocolate-900">
                    Saved Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="px-4 py-2 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {addressesLoading ? (
                  <p className="text-xs text-chocolate-500">Loading saved addresses...</p>
                ) : addresses.length === 0 ? (
                  <p className="text-xs text-chocolate-600">No saved addresses found. Add one for quick checkout.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-5 rounded-xl border text-xs space-y-2 relative ${
                          addr.isDefault ? 'border-gold-600 bg-gold-50/40' : 'border-ivory-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-chocolate-900 text-sm">{addr.fullName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-ivory-200 font-medium text-chocolate-700">
                            {addr.addressType}
                          </span>
                        </div>
                        <p className="text-chocolate-600 leading-relaxed">
                          {addr.streetAddress}, {addr.apartment && `${addr.apartment}, `}
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-chocolate-500">Phone: {addr.phone}</p>

                        <div className="pt-3 border-t border-ivory-200 flex items-center justify-between">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => handleSetDefaultAddress(addr._id)}
                              className="text-gold-800 hover:underline font-semibold text-[11px]"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center space-x-1">
                              <Check className="w-3 h-3" />
                              <span>Default Delivery Address</span>
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="text-red-700 hover:text-red-900 text-[11px] font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-ivory-300 space-y-4">
            <h3 className="font-serif text-xl font-bold text-chocolate-900 pb-2 border-b">
              Add New Delivery Address
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={newAddress.streetAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="defAddr"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="w-4 h-4 text-gold-700"
                />
                <label htmlFor="defAddr" className="text-chocolate-800">
                  Set as default address
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-chocolate-900 text-gold-300 rounded-lg uppercase tracking-wider font-semibold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
