import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, ShieldCheck, Star, Award, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from './ProductCard';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.options?.[0] || 'Default'
  );

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', alt: product.name }];

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-ivory-50 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gold-600/30 animate-in fade-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-ivory-200 text-chocolate-800 hover:bg-chocolate-900 hover:text-white flex items-center justify-center transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="p-6 bg-white flex flex-col justify-between">
            <div className="aspect-square rounded-xl overflow-hidden bg-ivory-100 relative">
              <img
                src={images[selectedImg]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute top-3 left-3 bg-chocolate-900/90 text-gold-300 text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded uppercase">
                {product.metalType}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                      selectedImg === idx ? 'border-gold-600 shadow-sm' : 'border-ivory-300 opacity-70'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Buying Actions */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-chocolate-500 uppercase tracking-widest">
                <span>{product.categoryName || 'Fine Jewellery'}</span>
                <span>•</span>
                <span className="text-gold-700 flex items-center space-x-1 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating} ({product.numReviews} reviews)</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-chocolate-900 mt-1">
                {product.name}
              </h2>

              <p className="text-xs text-chocolate-500 mt-0.5">
                SKU: {product.sku} | BIS Hallmarked: 916
              </p>

              {/* Price */}
              <div className="mt-3 flex items-baseline space-x-3">
                <span className="text-2xl font-bold text-chocolate-900 font-sans">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-sm text-chocolate-400 line-through font-sans">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Purity & Weight */}
              <div className="grid grid-cols-2 gap-2 mt-4 bg-ivory-100 p-3 rounded-lg text-xs text-chocolate-800 border border-ivory-200">
                <div>
                  <span className="text-chocolate-500 block text-[11px]">Purity:</span>
                  <span className="font-medium">{product.purity}</span>
                </div>
                <div>
                  <span className="text-chocolate-500 block text-[11px]">Gross Weight:</span>
                  <span className="font-medium">{product.grossWeight}</span>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                    {product.variants[0].name}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants[0].options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedVariant(opt)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
                          selectedVariant === opt
                            ? 'border-gold-600 bg-gold-50 text-gold-900 font-semibold shadow-sm'
                            : 'border-ivory-300 text-chocolate-700 hover:border-gold-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mt-3 text-xs flex items-center space-x-1.5">
                {product.stock > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="text-emerald-800 font-medium">
                      In Stock ({product.stock} available in vault)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span className="text-red-700 font-medium">Currently Sold Out</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-ivory-200 space-y-3">
              <div className="flex items-center space-x-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-ivory-300 rounded-lg bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-chocolate-800 hover:text-gold-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-semibold text-chocolate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-chocolate-800 hover:text-gold-700 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product, quantity, selectedVariant);
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center space-x-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Shopping Bag</span>
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-lg border transition ${
                    wishlisted
                      ? 'border-gold-600 bg-gold-600 text-white'
                      : 'border-ivory-300 text-chocolate-700 hover:text-gold-700 hover:border-gold-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="block text-center text-xs text-gold-800 hover:text-chocolate-900 font-semibold underline tracking-wider"
              >
                View Full Product Specifications & Hallmarks →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
