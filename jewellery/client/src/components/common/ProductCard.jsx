import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images?.[1]?.url || primaryImage;
  const wishlisted = isWishlisted(product._id);

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border border-ivory-300/80 shadow-sm hover:shadow-luxury transition-all duration-500 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isBridal && (
          <span className="bg-chocolate-900/90 text-gold-300 text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded uppercase backdrop-blur-sm border border-gold-600/30">
            Bridal Trousseau
          </span>
        )}
        {product.isBestseller && !product.isBridal && (
          <span className="bg-gold-700 text-white text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded uppercase">
            Bestseller
          </span>
        )}
        {product.isNewArrival && !product.isBestseller && !product.isBridal && (
          <span className="bg-chocolate-700 text-ivory-100 text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded uppercase">
            New In Vault
          </span>
        )}
        <span className="bg-ivory-100/90 text-chocolate-800 text-[10px] font-medium tracking-wider px-2 py-0.5 rounded border border-ivory-300 self-start">
          {product.metalType}
        </span>
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition backdrop-blur-md ${
          wishlisted
            ? 'bg-gold-600 text-white shadow-gold-sm'
            : 'bg-white/90 text-chocolate-700 hover:text-gold-700 hover:bg-white shadow-sm'
        }`}
        aria-label="Save to Wishlist"
      >
        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container with Hover Swap */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-ivory-100">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 py-2 bg-white/95 text-chocolate-900 rounded-lg text-xs font-medium tracking-wider hover:bg-white flex items-center justify-center space-x-1 shadow-sm transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="flex-1 py-2 bg-chocolate-900 text-gold-300 rounded-lg text-xs font-semibold tracking-wider hover:bg-gold-700 hover:text-white flex items-center justify-center space-x-1 shadow-sm transition border border-gold-600/30"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </Link>

      {/* Product Details Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-chocolate-500 mb-1">
            <span className="uppercase tracking-widest">{product.categoryName || product.category?.name || 'Fine Jewellery'}</span>
            <div className="flex items-center space-x-1 text-gold-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating || '4.9'}</span>
            </div>
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif text-base font-semibold text-chocolate-900 group-hover:text-gold-800 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-chocolate-600/80 mt-1 line-clamp-1 font-light">
            {product.purity} • {product.grossWeight}
          </p>
        </div>

        {/* Pricing Strip */}
        <div className="mt-3 pt-3 border-t border-ivory-200 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-semibold text-chocolate-900 font-sans">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-chocolate-400 line-through font-sans">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.discountPercentage > 0 && (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
