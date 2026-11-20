import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/common/ProductCard';
import ProductCard from '../components/common/ProductCard';

const ProductDetailPage = () => {
  const { slugOrId } = useParams();
  const { user } = useAuth();
  const { addToCart, showToast } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('Default');

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState({
    desc: true,
    specs: false,
    hallmark: false,
    care: false,
  });

  // Price breakdown modal state
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getBySlugOrId(slugOrId);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImg(0);
          if (prod.variants && prod.variants.length > 0 && prod.variants[0].options) {
            setSelectedVariant(prod.variants[0].options[0]);
          }

          // Fetch related products & reviews in parallel
          const [relRes, revRes] = await Promise.all([
            productsAPI.getRelated(prod._id),
            reviewsAPI.getByProduct(prod._id),
          ]);

          if (relRes.data.success) setRelatedProducts(relRes.data.products);
          if (revRes.data.success) setReviews(revRes.data.reviews);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slugOrId]);

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian pincode' });
      return;
    }
    // Estimated delivery in 2-3 business days
    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    setPincodeStatus({
      valid: true,
      message: `Complimentary Insured Delivery by ${deliveryDate.toLocaleDateString('en-IN', options)}`,
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to submit a verified patron review');
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await reviewsAPI.add(product._id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      if (res.data.success) {
        showToast('Review submitted successfully!');
        setReviewTitle('');
        setReviewComment('');
        // Refresh reviews
        const revRes = await reviewsAPI.getByProduct(product._id);
        if (revRes.data.success) setReviews(revRes.data.reviews);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-chocolate-800">Unveiling Masterpiece from the Vault...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl border border-ivory-300 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-chocolate-900">Jewellery Not Found</h2>
          <p className="text-xs text-chocolate-600">The requested masterpiece may have been archived or is no longer in the vault.</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-chocolate-900 text-gold-300 rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            Return to Vault Catalog
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80', alt: product.name }];

  const wishlisted = isWishlisted(product._id);

  // Price component breakdown calculations
  const metalEstimate = Math.round(product.price * 0.75);
  const gemstoneEstimate = Math.round(product.price * 0.15);
  const makingCharges = Math.round(product.price * 0.07);
  const gstEstimate = Math.round(product.price * 0.03);

  return (
    <div className="min-h-screen bg-ivory-100 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="bg-ivory-50 border-b border-ivory-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-chocolate-600 flex items-center space-x-2">
          <Link to="/" className="hover:text-gold-700">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold-700">Shop Vault</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category?.slug || 'necklaces'}`} className="hover:text-gold-700">
            {product.categoryName || product.category?.name || 'Category'}
          </Link>
          <span>/</span>
          <span className="text-chocolate-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Image Gallery with Magnifier Preview */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-sm relative group">
              <img
                src={images[selectedImg]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 cursor-crosshair"
              />
              <span className="absolute top-4 left-4 bg-chocolate-900/90 text-gold-300 text-xs font-semibold tracking-widest px-3 py-1 rounded uppercase backdrop-blur-md border border-gold-600/30">
                {product.metalType}
              </span>

              {/* Hallmark Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-ivory-300 flex items-center space-x-1 text-[11px] font-semibold text-chocolate-900 shadow-sm">
                <Award className="w-3.5 h-3.5 text-gold-700" />
                <span>BIS 916 Hallmarked</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                      selectedImg === idx ? 'border-gold-600 shadow-gold-sm' : 'border-ivory-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges Strip Under Gallery */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-ivory-200 text-center">
              <div className="bg-white p-3 rounded-xl border border-ivory-200">
                <ShieldCheck className="w-5 h-5 text-gold-700 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-chocolate-900 block">100% Certified</span>
                <span className="text-[10px] text-chocolate-500">Hallmarked Purity</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-ivory-200">
                <Truck className="w-5 h-5 text-gold-700 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-chocolate-900 block">Insured Transit</span>
                <span className="text-[10px] text-chocolate-500">Door-to-door protection</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-ivory-200">
                <RotateCcw className="w-5 h-5 text-gold-700 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-chocolate-900 block">Lifetime Exchange</span>
                <span className="text-[10px] text-chocolate-500">Benchmark gold rate</span>
              </div>
            </div>
          </div>

          {/* Right Column: Buying Information & Specifications */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-chocolate-500 uppercase tracking-widest mb-1.5">
                <span>{product.categoryName || product.category?.name || 'Heritage Collection'}</span>
                <span className="text-chocolate-400">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-chocolate-900">
                {product.name}
              </h1>

              {/* Star Rating Breakdown Link */}
              <div className="flex items-center space-x-2 mt-2 text-xs">
                <div className="flex items-center space-x-1 text-gold-600 font-semibold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating || 5) ? 'fill-current text-gold-600' : 'text-ivory-300'
                      }`}
                    />
                  ))}
                  <span className="text-chocolate-900 ml-1">{product.rating || '5.0'}</span>
                </div>
                <span className="text-chocolate-400">•</span>
                <a href="#reviews" className="text-gold-800 underline font-medium">
                  {reviews.length} Verified Patron Reviews
                </a>
              </div>
            </div>

            {/* Price Presentation */}
            <div className="p-4 bg-white rounded-xl border border-ivory-200 shadow-sm">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-chocolate-900 font-sans">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-base text-chocolate-400 line-through font-sans">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-chocolate-500">
                <span>Inclusive of all taxes & complimentary insured shipping</span>
                <button
                  type="button"
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="text-gold-800 hover:text-chocolate-900 underline font-medium flex items-center space-x-0.5"
                >
                  <Info className="w-3 h-3" />
                  <span>Price Breakdown</span>
                </button>
              </div>

              {/* Expandable Price Breakdown */}
              {showPriceBreakdown && (
                <div className="mt-3 pt-3 border-t border-ivory-200 space-y-1.5 text-xs text-chocolate-700 bg-ivory-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span>Gold Metal Value (est.)</span>
                    <span className="font-sans font-medium">{formatPrice(metalEstimate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diamonds & Gemstones</span>
                    <span className="font-sans font-medium">{formatPrice(gemstoneEstimate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Artisanal Making Charges</span>
                    <span className="font-sans font-medium">{formatPrice(makingCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (3% jewellery standard)</span>
                    <span className="font-sans font-medium">{formatPrice(gstEstimate)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Purity & Metal Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-4 rounded-xl border border-ivory-200 text-xs">
              <div>
                <span className="text-chocolate-400 block text-[11px] uppercase tracking-wider">Gold Purity</span>
                <span className="font-semibold text-chocolate-900">{product.purity}</span>
              </div>
              <div>
                <span className="text-chocolate-400 block text-[11px] uppercase tracking-wider">Gross Weight</span>
                <span className="font-semibold text-chocolate-900">{product.grossWeight}</span>
              </div>
              <div>
                <span className="text-chocolate-400 block text-[11px] uppercase tracking-wider">Net Gold Weight</span>
                <span className="font-semibold text-chocolate-900">{product.netWeight}</span>
              </div>
              <div>
                <span className="text-chocolate-400 block text-[11px] uppercase tracking-wider">Diamonds / Gems</span>
                <span className="font-semibold text-chocolate-900">{product.diamondWeight || 'Fine Gems'}</span>
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-800">
                  Select {product.variants[0].name}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants[0].options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedVariant(opt)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                        selectedVariant === opt
                          ? 'border-gold-600 bg-gold-50 text-gold-900 shadow-sm'
                          : 'border-ivory-300 text-chocolate-700 bg-white hover:border-gold-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability status */}
            <div className="flex items-center space-x-2 text-xs">
              {product.stock > 0 ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-emerald-800 font-semibold">
                    In Stock in Private Vault ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span className="text-red-700 font-semibold">Currently Out of Vault</span>
                </>
              )}
            </div>

            {/* Buying Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {/* Stepper */}
              <div className="flex items-center border border-ivory-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 text-chocolate-800 hover:text-gold-700 font-bold flex items-center justify-center text-base"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-chocolate-900 font-sans">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 text-chocolate-800 hover:text-gold-700 font-bold flex items-center justify-center text-base"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                type="button"
                onClick={() => addToCart(product, quantity, selectedVariant)}
                className="flex-1 w-full sm:w-auto py-3.5 px-6 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-xl text-xs font-semibold tracking-widest uppercase transition duration-300 flex items-center justify-center space-x-2 shadow-sm border border-gold-600/30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Shopping Bag</span>
              </button>

              {/* Wishlist Toggle */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition flex items-center justify-center ${
                  wishlisted
                    ? 'border-gold-600 bg-gold-600 text-white shadow-gold-sm'
                    : 'border-ivory-300 text-chocolate-800 bg-white hover:text-gold-700 hover:border-gold-500'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Pincode Estimator */}
            <div className="bg-white p-4 rounded-xl border border-ivory-200 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-chocolate-900 uppercase tracking-wider block">
                Estimated Delivery & Pincode Check
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode (e.g. 400001)"
                    className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                  <MapPin className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-chocolate-800 text-gold-300 hover:bg-chocolate-900 rounded-lg text-xs font-semibold uppercase tracking-wider transition"
                >
                  Verify
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-xs ${pincodeStatus.valid ? 'text-emerald-800 font-medium' : 'text-red-700'}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Luxury Accordion Tabs */}
            <div className="space-y-3 pt-2">
              {/* 1. Description */}
              <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleAccordion('desc')}
                  className="w-full px-5 py-4 text-left font-serif text-base font-semibold text-chocolate-900 flex justify-between items-center hover:bg-ivory-50 transition"
                >
                  <span>Royal Description & Heritage</span>
                  {openAccordions.desc ? <ChevronUp className="w-4 h-4 text-gold-700" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.desc && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-chocolate-700/90 leading-relaxed font-light border-t border-ivory-200 pt-3">
                    {product.description}
                  </div>
                )}
              </div>

              {/* 2. Detailed Specifications */}
              <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleAccordion('specs')}
                  className="w-full px-5 py-4 text-left font-serif text-base font-semibold text-chocolate-900 flex justify-between items-center hover:bg-ivory-50 transition"
                >
                  <span>Detailed Specifications & Dimensions</span>
                  {openAccordions.specs ? <ChevronUp className="w-4 h-4 text-gold-700" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.specs && (
                  <div className="px-5 pb-5 text-xs text-chocolate-700 space-y-2 border-t border-ivory-200 pt-3">
                    <p><strong>Dimensions:</strong> {product.specifications?.dimensions || 'Standard ergonomic fit'}</p>
                    <p><strong>Clasp Mechanism:</strong> {product.specifications?.claspType || 'Hallmarked safety clasp'}</p>
                    <p><strong>Ideal Occasion:</strong> {product.specifications?.occasion || 'Weddings, Black-tie galas, Festivals'}</p>
                    <p><strong>Gemstone Setting:</strong> {product.gemstone || 'Natural Basra Pearls and Emeralds'}</p>
                  </div>
                )}
              </div>

              {/* 3. BIS Hallmark & Certification */}
              <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleAccordion('hallmark')}
                  className="w-full px-5 py-4 text-left font-serif text-base font-semibold text-chocolate-900 flex justify-between items-center hover:bg-ivory-50 transition"
                >
                  <span>BIS Hallmarking & Authenticity Guarantee</span>
                  {openAccordions.hallmark ? <ChevronUp className="w-4 h-4 text-gold-700" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.hallmark && (
                  <div className="px-5 pb-5 text-xs text-chocolate-700/90 leading-relaxed border-t border-ivory-200 pt-3 space-y-2 font-light">
                    <p>
                      Every Aurélia gold jewel is hallmarked under Bureau of Indian Standards (BIS) regulations with a unique HUID laser inscription. Diamonds are certified by international gemological institutes (IGI / GIA).
                    </p>
                    <p>
                      Each order is dispatched in an archival velvet jewel box along with physical Certificate of Authenticity and insurance documents.
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Care Guide & Warranty */}
              <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full px-5 py-4 text-left font-serif text-base font-semibold text-chocolate-900 flex justify-between items-center hover:bg-ivory-50 transition"
                >
                  <span>Care Guide & Lifetime Complimentary Service</span>
                  {openAccordions.care ? <ChevronUp className="w-4 h-4 text-gold-700" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.care && (
                  <div className="px-5 pb-5 text-xs text-chocolate-700/90 leading-relaxed border-t border-ivory-200 pt-3 space-y-2 font-light">
                    <p>
                      Store fine polki and enamel jewels away from direct moisture, perfumes, and hairsprays. Clean gently with a lint-free suede cloth.
                    </p>
                    <p>
                      Enjoy lifetime free ultrasonic cleaning, prong tightening, and polish re-dipping at any Aurélia Flagship Showroom across India.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section id="reviews" className="py-16 bg-ivory-50 border-t border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Reviews Summary */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                Patron Impressions
              </span>
              <h2 className="font-serif text-3xl font-bold text-chocolate-900">
                Customer Reviews
              </h2>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold font-serif text-chocolate-900">
                  {product.rating || '5.0'}
                </span>
                <span className="text-xs text-chocolate-500">out of 5 stars</span>
              </div>
              <div className="flex items-center space-x-1 text-gold-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-chocolate-600 leading-relaxed font-light">
                Based on {reviews.length} authentic purchases. All patrons receive physical verification cards.
              </p>
            </div>

            {/* Reviews List & Write a Review */}
            <div className="lg:col-span-2 space-y-8">
              {/* Write Review Form */}
              <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-chocolate-900">
                  Share Your Royal Experience
                </h3>
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                        Your Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            className="p-1 text-gold-600 hover:scale-110 transition"
                          >
                            <Star className={`w-5 h-5 ${s <= reviewRating ? 'fill-current' : 'text-ivory-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g. Masterpiece craftsmanship, velvet box was stunning"
                        className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                        Review Commentary
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell connoisseurs about the finish, weight, and presentation..."
                        className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-xs text-chocolate-600">
                    <Link to="/login" className="text-gold-800 font-semibold underline">
                      Sign In
                    </Link>{' '}
                    to leave a verified review.
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-chocolate-500 italic">
                    Be the first patron to review this exquisite design.
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="bg-white p-5 rounded-xl border border-ivory-200 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-gold-600">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-chocolate-400">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-chocolate-900">
                        {rev.title}
                      </h4>
                      <p className="text-xs text-chocolate-700 leading-relaxed font-light">
                        {rev.comment}
                      </p>
                      <div className="text-[11px] text-chocolate-500 font-medium pt-1 flex items-center space-x-1">
                        <span>{rev.name}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-emerald-700 flex items-center space-x-0.5 ml-2">
                            <Check className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Jewellery Section */}
      {relatedProducts.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-ivory-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              Complementary Masterpieces
            </span>
            <h2 className="font-serif text-3xl font-normal text-chocolate-900 mt-1">
              You May Also Admire
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
