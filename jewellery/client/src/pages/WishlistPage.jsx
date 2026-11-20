import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../components/common/ProductCard';

const WishlistPage = () => {
  const { wishlist, toggleWishlist, moveToBag } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] bg-ivory-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-ivory-300 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-ivory-200 mx-auto flex items-center justify-center text-chocolate-400">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-chocolate-900">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-chocolate-600 leading-relaxed font-light">
            You have not saved any royal jewels to your private wishlist yet. Click the heart icon on any masterpiece to save it for later.
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
        <div className="pb-6 border-b border-ivory-300 mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Private Vault
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-chocolate-900 mt-0.5">
            Your Saved Masterpieces ({wishlist.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-ivory-100 overflow-hidden">
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-center hover:scale-105 transition duration-500"
                    />
                  </Link>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm transition"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="absolute top-3 left-3 bg-chocolate-900/90 text-gold-300 text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded uppercase">
                    {product.metalType}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-chocolate-500 uppercase tracking-widest block">
                      {product.categoryName || product.category?.name || 'Fine Jewels'}
                    </span>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-serif text-base font-semibold text-chocolate-900 hover:text-gold-700 line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-chocolate-500 font-light mt-0.5">
                      {product.purity}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-ivory-200">
                    <span className="text-base font-bold text-chocolate-900 font-sans">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-800">
                      {product.stock > 0 ? 'Ready to Ship' : 'Sold Out'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => moveToBag(product)}
                    disabled={product.stock <= 0}
                    className="w-full py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition flex items-center justify-center space-x-1.5 disabled:opacity-40"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move To Shopping Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
