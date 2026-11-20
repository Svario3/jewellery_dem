import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag, Search } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatPrice } from '../../components/common/ProductCard';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCustomers();
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ivory-300">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Patron Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-900">
            Registered Patrons & Collectors ({customers.length})
          </h1>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-sm max-w-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name or email..."
            className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
          />
          <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-chocolate-800">
            <thead className="bg-chocolate-900 text-gold-300 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Patron Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Joined Vault</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-chocolate-500">
                    Loading patron directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-chocolate-500">
                    No patrons found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-ivory-50/60 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={c.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                      <strong className="font-semibold text-chocolate-900 text-sm">
                        {c.name}
                      </strong>
                    </td>

                    <td className="p-4 text-chocolate-600 font-mono">{c.email}</td>

                    <td className="p-4 text-chocolate-600">{c.phone || '—'}</td>

                    <td className="p-4 text-chocolate-500">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="p-4 font-semibold text-chocolate-900">
                      {c.orderCount || 0} acquisitions
                    </td>

                    <td className="p-4 text-right font-sans font-bold text-gold-900">
                      {formatPrice(c.totalSpent || 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
