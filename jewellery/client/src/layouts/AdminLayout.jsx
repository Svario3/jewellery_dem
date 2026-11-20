import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  ArrowLeft,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Route Protection: If not admin, redirect or show access denied
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-200 shadow-luxury text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-100 mx-auto flex items-center justify-center text-red-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-chocolate-900">
            Vault Concierge Access Restricted
          </h2>
          <p className="text-xs text-chocolate-600 leading-relaxed font-light">
            You must be signed in with an authorized Administrator account to view and manage the jewellery vault.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login?redirect=/admin"
              className="py-2.5 bg-chocolate-900 text-gold-300 rounded-lg text-xs font-semibold uppercase tracking-wider"
            >
              Sign In As Administrator
            </Link>
            <Link to="/" className="text-xs text-chocolate-600 underline">
              Return to Public Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Jewellery Products', path: '/admin/products', icon: Package },
    { name: 'Collections & Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Patron Accounts', path: '/admin/customers', icon: Users },
    { name: 'Review Moderation', path: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 font-sans flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-chocolate-900 text-white flex-shrink-0 flex flex-col justify-between p-5 border-r border-gold-600/30">
        <div className="space-y-6">
          <div className="pb-4 border-b border-chocolate-700/80">
            <Link to="/" className="block">
              <span className="font-display text-2xl font-bold tracking-[0.2em] text-gold-400 uppercase">
                Aurélia
              </span>
              <div className="text-[10px] tracking-[0.35em] text-ivory-400 uppercase">
                Vault Management Console
              </div>
            </Link>
          </div>

          <nav className="space-y-1 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl transition ${
                    isActive
                      ? 'bg-gold-600 text-white font-semibold shadow-gold-sm'
                      : 'text-ivory-300 hover:bg-chocolate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold-300" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-chocolate-700/80 space-y-3 text-xs">
          <Link
            to="/"
            className="flex items-center space-x-2 text-ivory-300 hover:text-gold-300 transition py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Store</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full text-left flex items-center space-x-2 text-red-400 hover:text-red-300 transition py-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
