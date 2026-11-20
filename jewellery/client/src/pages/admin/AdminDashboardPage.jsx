import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatPrice } from '../../components/common/ProductCard';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getDashboard();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-serif text-chocolate-800">Compiling Vault Analytics...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalSales || 185000),
      subtitle: 'Settled Vault Acquisitions',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} Processing / Pending`,
      icon: ShoppingBag,
      color: 'bg-gold-50 text-gold-900 border-gold-200',
    },
    {
      title: 'Total Patrons',
      value: stats.totalCustomers,
      subtitle: 'Registered Collector Accounts',
      icon: Users,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: 'Vault Products',
      value: stats.totalProducts,
      subtitle: `${stats.lowStockCount || 0} Low-Stock Alerts`,
      icon: Package,
      color: 'bg-chocolate-50 text-chocolate-900 border-chocolate-200',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ivory-300">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Administrative Control
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-900">
            Executive Vault Overview
          </h1>
        </div>

        <Link
          to="/admin/products"
          className="px-5 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-sm"
        >
          + Add New Masterpiece
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`p-6 rounded-2xl border shadow-sm space-y-2 bg-white`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-chocolate-600">
                  {c.title}
                </span>
                <div className={`p-2 rounded-xl border ${c.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
                {c.value}
              </div>
              <p className="text-[11px] text-chocolate-500 font-light">{c.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Strip (Sales Trend & Metal Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart (CSS bar visualization) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-chocolate-900">
              Monthly Acquisition Volume
            </h3>
            <span className="text-xs text-chocolate-500 font-medium">FY 2026</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-8 pb-2 px-4 border-b border-ivory-200">
            {data?.salesTrends?.map((bar, idx) => {
              const maxVal = 2000000;
              const heightPercent = Math.min(100, Math.round((bar.sales / maxVal) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 text-[10px] bg-chocolate-900 text-gold-300 px-1.5 py-0.5 rounded transition">
                    ₹{(bar.sales / 100000).toFixed(1)}L
                  </div>
                  <div className="w-full bg-ivory-100 rounded-t-lg h-40 flex items-end">
                    <div
                      className="w-full bg-gold-gradient rounded-t-lg transition-all duration-700"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-chocolate-700">{bar.month}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-chocolate-500 italic">
            Sales figures represent confirmed hallmarked bullion acquisitions.
          </p>
        </div>

        {/* Precious Metal Setting Mix */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-900">
            Precious Metals Portfolio
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { label: '22K Solid Gold', percent: 45, color: 'bg-gold-600' },
              { label: '18K Rose & White Gold', percent: 30, color: 'bg-rose-400' },
              { label: 'Kundan & Uncut Polki', percent: 18, color: 'bg-amber-700' },
              { label: 'Platinum 950', percent: 7, color: 'bg-slate-400' },
            ].map((m, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-chocolate-800">
                  <span className="font-medium">{m.label}</span>
                  <span className="font-bold">{m.percent}%</span>
                </div>
                <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${m.color} h-full rounded-full`}
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Table Layout: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <h3 className="font-serif text-lg font-bold text-chocolate-900">
              Recent Vault Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs text-gold-800 hover:text-chocolate-900 font-semibold underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentOrders?.length === 0 ? (
              <p className="text-xs text-chocolate-500">No recent orders.</p>
            ) : (
              data?.recentOrders?.map((ord) => (
                <div
                  key={ord._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-ivory-50 border border-ivory-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-chocolate-900 block">{ord.orderNumber}</span>
                    <span className="text-chocolate-500 text-[11px]">{ord.user?.name || ord.shippingAddress?.fullName}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold font-sans text-chocolate-900 block">
                      {formatPrice(ord.totalPrice)}
                    </span>
                    <span className="text-[10px] font-bold text-gold-800 bg-gold-100 px-2 py-0.5 rounded">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif text-lg font-bold text-chocolate-900">
                Low Vault Stock Alerts (≤ 3 remaining)
              </h3>
            </div>
            <Link
              to="/admin/products"
              className="text-xs text-gold-800 hover:text-chocolate-900 font-semibold underline"
            >
              Restock Vault →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-chocolate-500">All inventory vaults adequately stocked.</p>
            ) : (
              data?.lowStockProducts?.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={p.images?.[0]?.url || ''}
                      alt=""
                      className="w-10 h-10 object-cover rounded bg-white border"
                    />
                    <div>
                      <span className="font-bold text-chocolate-900 block line-clamp-1">{p.name}</span>
                      <span className="text-chocolate-500 text-[11px]">SKU: {p.sku}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-red-700 block">
                      Only {p.stock} left in vault
                    </span>
                    <span className="font-sans text-chocolate-600 text-[11px]">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
