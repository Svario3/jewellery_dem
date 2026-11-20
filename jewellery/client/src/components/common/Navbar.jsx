import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  LogOut,
  LayoutDashboard,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Bridal Trousseau', path: '/shop?category=bridal-jewellery' },
    { name: 'Necklaces', path: '/shop?category=necklaces' },
    { name: 'Earrings', path: '/shop?category=earrings' },
    { name: 'Rings', path: '/shop?category=rings' },
    { name: 'Bangles', path: '/shop?category=bangles' },
    { name: 'Traditional', path: '/shop?category=traditional-jewellery' },
    { name: 'Modern', path: '/shop?category=modern-jewellery' },
    { name: 'Our Heritage', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-chocolate-900 text-gold-300 px-4 py-2 text-xs font-medium tracking-widest text-center uppercase border-b border-gold-600/20 flex items-center justify-center space-x-3">
        <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse hidden sm:inline" />
        <span>Complimentary Insured Delivery on orders over ₹5,000 | 100% BIS Hallmarked 22K & 18K Fine Gold</span>
        <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse hidden sm:inline" />
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-ivory-50/95 backdrop-blur-md shadow-md py-3.5 border-b border-ivory-300/60'
            : 'bg-ivory-50 py-4 border-b border-ivory-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-chocolate-800 hover:text-gold-700 transition"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-chocolate-800 hover:text-gold-700 transition ml-1"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Left on Desktop: Quick links or Search Bar */}
            <div className="hidden lg:flex items-center space-x-6 flex-1">
              <div className="relative w-64">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search polki, rings, 22K gold..."
                    className="w-full pl-9 pr-4 py-1.5 bg-ivory-100 border border-ivory-300 rounded-full text-xs text-chocolate-800 placeholder-chocolate-500/70 focus:outline-none focus:border-gold-600 transition"
                  />
                  <Search className="w-4 h-4 text-chocolate-500 absolute left-3 top-2 pointer-events-none" />
                </form>
              </div>
              <Link
                to="/shop?filter=new"
                className="text-xs uppercase tracking-widest text-chocolate-600 hover:text-gold-700 font-medium transition"
              >
                New In Vault
              </Link>
            </div>

            {/* Center: Brand Monogram & Name */}
            <div className="text-center flex-shrink-0 mx-2">
              <Link to="/" className="inline-block group text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span className="h-px w-6 bg-gold-600/40 hidden sm:block"></span>
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[0.25em] text-chocolate-900 group-hover:text-gold-700 transition uppercase">
                    Aurélia
                  </span>
                  <span className="h-px w-6 bg-gold-600/40 hidden sm:block"></span>
                </div>
                <div className="text-[10px] tracking-[0.45em] text-gold-700 font-medium uppercase mt-0.5">
                  Fine Jewels • Heritage
                </div>
              </Link>
            </div>

            {/* Right: Actions (Currency, Admin, User, Wishlist, Bag) */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end">
              {/* Currency tag */}
              <span className="hidden xl:inline-block text-xs font-medium text-chocolate-600 tracking-wider">
                INR (₹)
              </span>

              {/* Admin dashboard shortcut pill if user is admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-chocolate-900 text-gold-400 hover:bg-gold-700 hover:text-white rounded-full text-xs font-medium tracking-wider transition shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User Account Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-chocolate-800 hover:text-gold-700 transition flex items-center space-x-1"
                  aria-label="Account menu"
                >
                  <User className="w-5 h-5" />
                  {user && (
                    <span className="hidden md:inline-block text-xs font-medium text-chocolate-700 max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-chocolate-500 hidden md:inline-block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-ivory-50 rounded-lg shadow-luxury border border-ivory-300 py-2 z-50 text-xs">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-ivory-200">
                          <p className="font-semibold text-chocolate-900 truncate">{user.name}</p>
                          <p className="text-chocolate-500 truncate text-[11px]">{user.email}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 px-4 py-2 text-chocolate-800 hover:bg-ivory-200 transition font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4 text-gold-700" />
                            <span>Admin Vault Dashboard</span>
                          </Link>
                        )}
                        <Link
                          to="/account"
                          className="flex items-center space-x-2 px-4 py-2 text-chocolate-800 hover:bg-ivory-200 transition"
                        >
                          <User className="w-4 h-4 text-chocolate-500" />
                          <span>My Royal Profile</span>
                        </Link>
                        <Link
                          to="/account?tab=orders"
                          className="flex items-center space-x-2 px-4 py-2 text-chocolate-800 hover:bg-ivory-200 transition"
                        >
                          <Package className="w-4 h-4 text-chocolate-500" />
                          <span>Order History & Tracking</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-700 hover:bg-red-50 transition border-t border-ivory-200 mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-chocolate-600 border-b border-ivory-200">
                          Welcome to Aurélia
                        </div>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-chocolate-900 font-semibold hover:bg-ivory-200 transition"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-chocolate-700 hover:bg-ivory-200 transition"
                        >
                          Create Royal Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="p-2 text-chocolate-800 hover:text-gold-700 transition relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold-700 text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart Drawer Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-chocolate-800 hover:text-gold-700 transition relative flex items-center space-x-1"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-chocolate-900 text-gold-300 font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gold-600/30">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Desktop Category Navigation Bar */}
        <div className="hidden lg:block border-t border-ivory-200 mt-3 pt-2.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center space-x-8 text-xs uppercase tracking-[0.18em] font-medium text-chocolate-700">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`pb-1 border-b-2 transition ${
                      location.pathname + location.search === link.path
                        ? 'border-gold-600 text-gold-800 font-semibold'
                        : 'border-transparent hover:border-gold-500 hover:text-gold-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-ivory-50 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-ivory-300">
                <span className="font-serif text-2xl font-bold tracking-widest text-chocolate-900 uppercase">
                  Aurélia
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-chocolate-800 hover:text-gold-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fine jewellery..."
                    className="w-full pl-9 pr-4 py-2 bg-ivory-100 border border-ivory-300 rounded-md text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                  <Search className="w-4 h-4 text-chocolate-500 absolute left-3 top-2.5" />
                </div>
              </form>

              {/* Navigation links */}
              <ul className="mt-6 space-y-3 divide-y divide-ivory-200 text-sm tracking-wider uppercase font-medium text-chocolate-800">
                {navLinks.map((link) => (
                  <li key={link.name} className="pt-2">
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 hover:text-gold-700 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Footer Status */}
            <div className="pt-6 border-t border-ivory-300 space-y-3 text-xs text-chocolate-600">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2 bg-chocolate-900 text-gold-300 text-center rounded font-semibold tracking-wider uppercase"
                >
                  Admin Management
                </Link>
              )}
              {user ? (
                <div className="flex items-center justify-between">
                  <span>Signed in as {user.name.split(' ')[0]}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-700 font-medium underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 text-center border border-chocolate-800 text-chocolate-900 rounded font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 text-center bg-gold-600 text-white rounded font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Popover Overlay on Mobile */}
      {isSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-start pt-20">
          <div className="bg-ivory-50 w-full rounded-xl p-4 shadow-2xl relative">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 top-3 text-chocolate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-lg text-chocolate-900 font-semibold mb-2">Search Aurélia Jewels</h3>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Maharani Choker, Solitaire Ring, Temple Kada..."
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory-100 border border-gold-600/40 rounded-lg text-sm text-chocolate-900 focus:outline-none"
                />
                <Search className="w-5 h-5 text-gold-700 absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                className="mt-3 w-full py-2 bg-chocolate-900 text-gold-300 rounded-lg text-xs uppercase tracking-widest font-semibold"
              >
                Search Masterpieces
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
