import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, Clock, Truck, X } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { formatPrice } from '../../components/common/ProductCard';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await ordersAPI.getAllAdmin(params);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await ordersAPI.updateStatus(orderId, {
        status: newStatus,
        note: `Order status updated to ${newStatus} by Vault Concierge`,
      });
      if (res.data.success) {
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.order);
        }
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase())) ||
    (o.user?.email && o.user.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ivory-300">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Order Fulfillment
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-900">
            Patron Orders & Dispatches ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or recipient name..."
            className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-chocolate-900 focus:outline-none focus:border-gold-600"
          />
          <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold text-chocolate-700">Status Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg font-medium text-chocolate-900 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Placed">Placed</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-chocolate-800">
            <thead className="bg-chocolate-900 text-gold-300 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-chocolate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-chocolate-500">
                    No orders found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-ivory-50/60 transition">
                    <td className="p-4 font-mono font-bold text-chocolate-900">
                      {ord.orderNumber}
                    </td>

                    <td className="p-4">
                      <strong className="block font-semibold text-chocolate-900">
                        {ord.shippingAddress?.fullName}
                      </strong>
                      <span className="text-chocolate-500 text-[11px]">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.phone}
                      </span>
                    </td>

                    <td className="p-4 text-chocolate-600">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="p-4 font-sans font-bold text-chocolate-900">
                      {formatPrice(ord.totalPrice)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.isPaid ? 'Paid' : 'Unsettled'}
                      </span>
                      <span className="block text-[10px] text-chocolate-500 mt-0.5">
                        {ord.paymentMethod === 'Online_Razorpay' ? 'Razorpay' : 'COD'}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        disabled={statusUpdating}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        className={`px-2.5 py-1 rounded text-xs font-bold border focus:outline-none ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : 'bg-gold-50 text-gold-900 border-gold-300'
                        }`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-ivory-200 hover:bg-chocolate-900 hover:text-white rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-ivory-300 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-serif text-2xl font-bold text-chocolate-900">
                  Order {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-chocolate-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-6 h-6 text-chocolate-600" />
              </button>
            </div>

            {/* Recipient & Payment strip */}
            <div className="grid grid-cols-2 gap-4 bg-ivory-50 p-4 rounded-xl text-xs">
              <div>
                <strong className="block text-chocolate-900 uppercase tracking-wider mb-1">
                  Shipping Address
                </strong>
                <p className="text-chocolate-800 font-semibold">{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.streetAddress}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}</p>
                <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div>
                <strong className="block text-chocolate-900 uppercase tracking-wider mb-1">
                  Payment & Total
                </strong>
                <p>Method: {selectedOrder.paymentMethod}</p>
                <p>Status: {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}</p>
                <p className="text-base font-bold font-sans text-gold-900 mt-2">
                  Total: {formatPrice(selectedOrder.totalPrice)}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <strong className="block text-xs uppercase tracking-wider text-chocolate-700">
                Jewellery Items ({selectedOrder.orderItems?.length})
              </strong>
              <div className="divide-y max-h-48 overflow-y-auto text-xs">
                {selectedOrder.orderItems?.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={it.image} alt="" className="w-10 h-10 object-cover rounded border" />
                      <div>
                        <span className="font-semibold text-chocolate-900 block">{it.name}</span>
                        <span className="text-chocolate-500 text-[11px]">Variant: {it.selectedVariant}</span>
                      </div>
                    </div>
                    <span className="font-sans font-bold text-chocolate-900">
                      {formatPrice(it.price * it.quantity)} ({it.quantity}x)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status Control */}
            <div className="pt-3 border-t flex items-center justify-between">
              <span className="text-xs font-semibold text-chocolate-700">Change Status:</span>
              <div className="flex gap-2">
                {['Placed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder._id, st)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      selectedOrder.orderStatus === st
                        ? 'bg-chocolate-900 text-gold-300'
                        : 'bg-ivory-200 text-chocolate-800 hover:bg-gold-600 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
