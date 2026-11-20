import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

const MainLayout = () => {
  const { toastMessage } = useCart();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-ivory-100 text-chocolate-900 font-sans">
      <Navbar />

      {/* Global Luxury Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-chocolate-900 text-gold-300 px-5 py-3 rounded-2xl shadow-luxury border border-gold-600/40 flex items-center space-x-2.5 text-xs font-medium animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
