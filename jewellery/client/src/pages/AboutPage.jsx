import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Crown, Sparkles, Heart, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-ivory-100 font-sans">
      {/* Hero Banner */}
      <div className="relative py-24 bg-chocolate-900 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80"
            alt="Jewellery Craftsmanship"
            className="w-full h-full object-cover filter grayscale"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">
            Our Noble Lineage
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-white">
            The Aurélia Heritage
          </h1>
          <div className="w-20 h-0.5 bg-gold-600 mx-auto my-3" />
          <p className="text-xs sm:text-sm text-ivory-300 max-w-xl mx-auto leading-relaxed font-light">
            Founded in 1988 with the solitary purpose of preserving the dying mastercrafts of imperial Indian royal jewellery while innovating for the contemporary world.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              The Genesis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-chocolate-900">
              Where Royal Tradition Meets Modern Poise
            </h2>
            <p className="text-xs sm:text-sm text-chocolate-700/90 leading-relaxed font-light">
              Aurélia was born in the historic lanes of Johari Bazaar and the temple ateliers of South India. Our founding masters apprenticed under hereditary jewellers who fashioned ceremonial parures for the royal courts of Rajasthan and the Nizams of Hyderabad.
            </p>
            <p className="text-xs sm:text-sm text-chocolate-700/90 leading-relaxed font-light">
              Today, each creation continues that sacred lineage. We sculpt pure 22K and 18K gold by hand, set uncut syndicate polki diamonds using pure 24K gold foil (Jadau), and paint vivid enamel miniatures (Meenakari) with generational precision.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-luxury border border-ivory-300">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan at work"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm text-center space-y-3">
            <Crown className="w-8 h-8 text-gold-700 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-chocolate-900">Regal Provenance</h3>
            <p className="text-xs text-chocolate-600 font-light leading-relaxed">
              Authentic Indian royal design blueprints preserved and recreated with immaculate balance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm text-center space-y-3">
            <Award className="w-8 h-8 text-gold-700 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-chocolate-900">BIS 916 Guaranteed</h3>
            <p className="text-xs text-chocolate-600 font-light leading-relaxed">
              Every single piece bears laser hallmarking certifying exact karatage and alloy purity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm text-center space-y-3">
            <ShieldCheck className="w-8 h-8 text-gold-700 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-chocolate-900">Ethical Sourcing</h3>
            <p className="text-xs text-chocolate-600 font-light leading-relaxed">
              100% conflict-free natural diamonds, responsibly mined emeralds, and fair-wage artisanal ateliers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm text-center space-y-3">
            <Sparkles className="w-8 h-8 text-gold-700 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-chocolate-900">Lifetime Custodianship</h3>
            <p className="text-xs text-chocolate-600 font-light leading-relaxed">
              Complimentary annual servicing, prong inspection, and buyback at prevailing gold bullion benchmarks.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-chocolate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
            Experience Aurélia Firsthand
          </h3>
          <p className="text-xs sm:text-sm text-ivory-300 max-w-md mx-auto font-light">
            Book a private salon viewing with our certified gemologists or browse our online vault.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/shop"
              className="px-6 py-3 bg-gold-gradient text-chocolate-900 font-semibold text-xs tracking-wider uppercase rounded-lg hover:shadow-gold-md transition"
            >
              Explore Collections
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-gold-500/60 text-gold-300 hover:bg-gold-500/10 font-semibold text-xs tracking-wider uppercase rounded-lg transition"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
