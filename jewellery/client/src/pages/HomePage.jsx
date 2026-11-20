import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Crown,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Gift,
  CheckCircle,
} from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';

const HomePage = () => {
  const [curated, setCurated] = useState({
    featured: [],
    newArrivals: [],
    bestsellers: [],
    bridal: [],
  });
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const heroSlides = [
    {
      subtitle: 'The Royal Autumn & Winter Collection',
      title: 'The Maharani Imperial Polki Choker',
      description: 'Handcrafted in 22 Karat hallmarked gold with uncut syndicate diamonds, Basra pearls, and emerald drops.',
      ctaText: 'Explore Royal Chokers',
      ctaLink: '/shop?category=necklaces',
      badge: 'Certified 22K Heritage Artistry',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80',
    },
    {
      subtitle: 'Modern Haute Joaillerie',
      title: 'Solitaire Symphony & Rose Gold',
      description: 'Luminous precision-cut diamonds cascading in 18 Karat rose and white gold for the contemporary connoisseur.',
      ctaText: 'Discover Modern Solitaires',
      ctaLink: '/shop?category=modern-jewellery',
      badge: 'IGI Certified Natural Solitaires',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
    },
    {
      subtitle: 'The Eternal Trousseau',
      title: 'A Royal Affair: Handcrafted Bridal Sets',
      description: 'Magnificent bridal sets passed from mother to daughter as timeless heirlooms of dignity and joy.',
      ctaText: 'View Bridal Trousseau',
      ctaLink: '/shop?category=bridal-jewellery',
      badge: 'Bespoke Bridal Consultations',
      image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [curatedRes, catRes] = await Promise.all([
          productsAPI.getCurated(),
          categoriesAPI.getAll(),
        ]);
        if (curatedRes.data.success) {
          setCurated(curatedRes.data);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      }
    };
    fetchData();

    // Auto rotate hero slide every 7s
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  const getDisplayedProducts = () => {
    switch (activeTab) {
      case 'bridal':
        return curated.bridal;
      case 'bestsellers':
        return curated.bestsellers;
      case 'newArrivals':
        return curated.newArrivals;
      default:
        return curated.featured;
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 font-sans selection:bg-gold-500 selection:text-white">
      {/* 1. Hero Banner Carousel */}
      <section className="relative h-[85vh] min-h-[550px] max-h-[780px] w-full overflow-hidden bg-chocolate-900 text-white">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              heroSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image with cinematic dark gradient overlay */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-chocolate-900/90 via-chocolate-900/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate-900/80 via-transparent to-transparent" />

            {/* Slide Content */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-2xl space-y-4 sm:space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold-600/20 border border-gold-500/40 rounded-full text-xs font-medium tracking-widest text-gold-300 uppercase backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>{slide.badge}</span>
                </div>

                <div className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-300 font-medium">
                  {slide.subtitle}
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-white">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-ivory-300 max-w-lg font-light leading-relaxed">
                  {slide.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    to={slide.ctaLink}
                    className="px-7 py-3.5 bg-gold-gradient text-chocolate-900 font-semibold text-xs tracking-widest uppercase rounded-lg hover:shadow-gold-md hover:scale-105 transition duration-300 flex items-center space-x-2"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/shop"
                    className="px-7 py-3.5 border border-gold-500/60 text-gold-300 hover:bg-gold-500/10 font-semibold text-xs tracking-widest uppercase rounded-lg transition duration-300"
                  >
                    View Vault Catalog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows & Indicators */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center space-x-3">
          <button
            onClick={() => setHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="w-10 h-10 rounded-full border border-gold-400/40 bg-chocolate-900/60 backdrop-blur-md flex items-center justify-center text-gold-300 hover:bg-gold-600 hover:text-white transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex space-x-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  heroSlide === i ? 'w-8 bg-gold-400' : 'w-2 bg-ivory-400/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
            className="w-10 h-10 rounded-full border border-gold-400/40 bg-chocolate-900/60 backdrop-blur-md flex items-center justify-center text-gold-300 hover:bg-gold-600 hover:text-white transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 2. Brand Introduction & Heritage Narrative */}
      <section className="py-16 sm:py-20 bg-ivory-50 border-b border-ivory-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-700 font-semibold">
            Crafted for Generations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-chocolate-900 font-normal">
            The Aurélia Fine Jewellery Heritage
          </h2>
          <div className="w-20 h-0.5 bg-gold-600 mx-auto my-3" />
          <p className="text-sm sm:text-base text-chocolate-700/90 leading-relaxed font-light">
            Founded on the revered traditions of Indian royal goldsmithing, Aurélia Jewels marries ancient Rajasthani Jadau and Chettinad temple craft with contemporary European haute joaillerie. Every precious diamond, uncut polki, and Burmese ruby is handpicked, hallmarked, and cast to adorn life’s most celebrated milestones.
          </p>
        </div>
      </section>

      {/* 3. Curated Categories Showcase */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              Curated Vaults
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-chocolate-900 mt-1">
              Explore By Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 md:mt-0 text-xs font-semibold tracking-widest uppercase text-chocolate-800 hover:text-gold-700 flex items-center space-x-1.5 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-500 bg-chocolate-900"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate-900/90 via-chocolate-900/40 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-gold-300 font-medium">
                  {cat.productCount ? `${cat.productCount} Designs` : 'Royal Masterpieces'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold group-hover:text-gold-300 transition mt-0.5">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center space-x-1 text-xs text-ivory-300 group-hover:text-white mt-1 transition">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Tabbed Masterpieces (Featured, Bridal, Traditional, Bestsellers) */}
      <section className="py-16 sm:py-20 bg-ivory-50 border-y border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              The Vault Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-chocolate-900 mt-1 font-normal">
              Signature Royal Collections
            </h2>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'featured', label: 'Featured Jewels' },
                { id: 'bridal', label: 'Bridal Trousseau' },
                { id: 'bestsellers', label: 'Bestsellers' },
                { id: 'newArrivals', label: 'New Arrivals' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition ${
                    activeTab === tab.id
                      ? 'bg-chocolate-900 text-gold-300 shadow-sm'
                      : 'bg-white text-chocolate-700 hover:text-gold-700 border border-ivory-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getDisplayedProducts().map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-lg text-xs font-semibold tracking-widest uppercase transition duration-300 shadow-sm"
            >
              <span>Explore All Masterpieces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Promotional Bridal Trousseau Experience Banner */}
      <section className="relative py-20 bg-chocolate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80"
            alt="Bridal Background"
            className="w-full h-full object-cover object-center filter grayscale"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">
                By Private Invitation
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white">
                The Royal Bridal Trousseau Experience
              </h2>
              <p className="text-sm text-ivory-300 leading-relaxed font-light">
                Every bride deserves jewellery that immortalizes her grand celebration. Book a private boutique consultation with our master jewellery stylists to customize your wedding choker, uncut polki haar, and bridal jewels in pure 22K gold.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="px-6 py-3.5 bg-gold-gradient text-chocolate-900 font-semibold text-xs tracking-widest uppercase rounded-lg hover:shadow-gold-md transition"
                >
                  Book Private Appointment
                </Link>
                <Link
                  to="/shop?category=bridal-jewellery"
                  className="px-6 py-3.5 border border-gold-500/60 text-gold-300 hover:bg-gold-500/10 font-semibold text-xs tracking-widest uppercase rounded-lg transition"
                >
                  View Bridal Sets
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-chocolate-800/80 backdrop-blur-md p-6 rounded-2xl border border-gold-600/30 text-center space-y-2">
                <Crown className="w-8 h-8 text-gold-400 mx-auto" />
                <h4 className="font-serif text-lg font-semibold text-gold-200">Custom Heritage Design</h4>
                <p className="text-xs text-ivory-300">Collaborate with our master goldsmiths for bespoke bridal jewels</p>
              </div>
              <div className="bg-chocolate-800/80 backdrop-blur-md p-6 rounded-2xl border border-gold-600/30 text-center space-y-2">
                <Award className="w-8 h-8 text-gold-400 mx-auto" />
                <h4 className="font-serif text-lg font-semibold text-gold-200">BIS 916 Guaranteed</h4>
                <p className="text-xs text-ivory-300">100% laser hallmarked purity with international gem certification</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials & Reviews */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Patron Reflections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-chocolate-900 mt-1">
            Praised by Connoisseurs
          </h2>
          <div className="w-16 h-0.5 bg-gold-600 mx-auto my-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Meera Nambiar',
              city: 'Bengaluru',
              stars: 5,
              title: 'A True Family Heirloom',
              comment: 'The Maharani Imperial Polki Choker exceeded every expectation. The uncut syndicate diamonds and emerald drops are mesmerizing. The packaging and laser hallmark give complete peace of mind.',
              product: 'The Maharani Imperial Polki Choker',
            },
            {
              name: 'Ananya Singhania',
              city: 'Mumbai',
              stars: 5,
              title: 'Flawless Solitaire Diamonds',
              comment: 'Ordered the Aurelia Solitaire Diamond Drop Earrings. The brilliance of the VVS stones is breathtaking. The insured armored delivery arrived within 48 hours right to my doorstep.',
              product: 'Aurelia Solitaire Drop Earrings',
            },
            {
              name: 'Rituja Roy Chowdhury',
              city: 'Kolkata',
              stars: 5,
              title: 'Exquisite Temple Craftsmanship',
              comment: 'The Padmavati Heritage Temple Kada has divine detailing. You can feel the weight of genuine 22K gold and the rubies are brilliant. Aurélia is now my go-to luxury jeweller.',
              product: 'Padmavati Heritage Temple Kada',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-gold-600 mb-3">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h4 className="font-serif text-lg font-semibold text-chocolate-900 mb-2">
                  "{t.title}"
                </h4>
                <p className="text-xs text-chocolate-700/80 leading-relaxed font-light">
                  {t.comment}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-ivory-200 flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-xs text-chocolate-900">{t.name}</h5>
                  <span className="text-[11px] text-chocolate-500">{t.city} • Verified Buyer</span>
                </div>
                <span className="text-[10px] text-gold-700 font-medium bg-gold-50 px-2 py-1 rounded border border-gold-200">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Royal Newsletter Subscription & Instant Voucher */}
      <section className="bg-chocolate-900 text-white py-16 border-t border-gold-600/30">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold-600/20 border border-gold-600/40 mx-auto flex items-center justify-center text-gold-400">
            <Gift className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">
            Join The Aurélia Circle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Receive ₹2,000 Off Your First Heritage Acquisition
          </h2>
          <p className="text-xs sm:text-sm text-ivory-300 font-light max-w-lg mx-auto leading-relaxed">
            Subscribe to receive private previews of new vault arrivals, bespoke bridal invitations, and an immediate voucher code.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto mt-6 flex gap-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your confidential email..."
              className="flex-1 px-4 py-3 bg-chocolate-800 border border-gold-600/40 rounded-lg text-xs text-white placeholder-ivory-400 focus:outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gold-gradient text-chocolate-900 rounded-lg text-xs font-semibold tracking-wider uppercase hover:shadow-gold-md transition"
            >
              Subscribe
            </button>
          </form>

          {newsletterSuccess && (
            <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-lg text-xs text-emerald-300 flex items-center justify-center space-x-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Welcome to the Circle! Use voucher code <strong>AURELIA10</strong> at checkout.</span>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default HomePage;
