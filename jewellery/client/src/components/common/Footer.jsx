import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-chocolate-900 text-ivory-200 border-t border-gold-600/30 font-sans">
      {/* Royal Guarantees Strip */}
      <div className="border-b border-chocolate-700/80 bg-chocolate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-400">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-semibold text-gold-300">100% BIS Hallmarked</h4>
              <p className="text-xs text-ivory-400 max-w-[200px]">Certified pure 22K and 18K solid gold with laser authentication</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-semibold text-gold-300">Certified Diamonds</h4>
              <p className="text-xs text-ivory-400 max-w-[200px]">Every solitaire accompanied by international IGI/GIA certificates</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-400">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-semibold text-gold-300">Insured Transit</h4>
              <p className="text-xs text-ivory-400 max-w-[200px]">Complimentary pan-India armored courier with door-to-door insurance</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-semibold text-gold-300">Lifetime Exchange</h4>
              <p className="text-xs text-ivory-400 max-w-[200px]">Guaranteed buyback & exchange value at reigning benchmark gold rates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-bold tracking-[0.25em] text-gold-400 uppercase">
                Aurélia
              </span>
              <div className="text-[10px] tracking-[0.45em] text-ivory-400 uppercase">
                Fine Jewels • Est. 1988
              </div>
            </Link>
            <p className="text-xs text-ivory-300/80 leading-relaxed max-w-sm">
              Aurélia Jewels curates timeless Indian heirloom jewellery and modern haute joaillerie. Each creation celebrates regal heritage, precision stone setting, and unmatched artisanal dedication.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-gold-400">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-chocolate-800 border border-gold-600/30 flex items-center justify-center hover:bg-gold-700 hover:text-white transition" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-chocolate-800 border border-gold-600/30 flex items-center justify-center hover:bg-gold-700 hover:text-white transition" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#pinterest" className="w-9 h-9 rounded-full bg-chocolate-800 border border-gold-600/30 flex items-center justify-center hover:bg-gold-700 hover:text-white transition" aria-label="Pinterest">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.241-.188.293-.435.177-1.624-.755-2.639-3.127-2.639-5.034 0-4.102 2.981-7.871 8.597-7.871 4.514 0 8.024 3.217 8.024 7.518 0 4.486-2.828 8.097-6.753 8.097-1.319 0-2.559-.686-2.984-1.497l-.813 3.103c-.295 1.127-1.092 2.541-1.628 3.407 1.214.375 2.511.579 3.857.579 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-widest text-gold-400 uppercase">
              The Collections
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300/80">
              <li><Link to="/shop?category=bridal-jewellery" className="hover:text-gold-300 transition">Bridal Trousseau</Link></li>
              <li><Link to="/shop?category=necklaces" className="hover:text-gold-300 transition">Imperial Chokers</Link></li>
              <li><Link to="/shop?category=traditional-jewellery" className="hover:text-gold-300 transition">Heritage Polki & Kundan</Link></li>
              <li><Link to="/shop?category=rings" className="hover:text-gold-300 transition">Solitaire Diamond Rings</Link></li>
              <li><Link to="/shop?category=bangles" className="hover:text-gold-300 transition">Temple Kadas & Bangles</Link></li>
              <li><Link to="/shop?category=earrings" className="hover:text-gold-300 transition">Chandbalis & Jhumkis</Link></li>
            </ul>
          </div>

          {/* Client Experience */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-widest text-gold-400 uppercase">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300/80">
              <li><Link to="/contact" className="hover:text-gold-300 transition">Book Private Consultation</Link></li>
              <li><Link to="/faq" className="hover:text-gold-300 transition">Ring & Bangle Size Guide</Link></li>
              <li><Link to="/faq#hallmark" className="hover:text-gold-300 transition">BIS Hallmarking Verification</Link></li>
              <li><Link to="/faq#shipping" className="hover:text-gold-300 transition">Insured Shipping Policy</Link></li>
              <li><Link to="/policies/returns" className="hover:text-gold-300 transition">30-Day Return & Exchange</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-gold-300 transition">Privacy & Confidentiality</Link></li>
            </ul>
          </div>

          {/* Flagship Showroom Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-widest text-gold-400 uppercase">
              Flagship Boutique
            </h4>
            <div className="space-y-2.5 text-xs text-ivory-300/80">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span>Aurélia Palace, 18 Altamount Road, Cumballa Hill, Mumbai 400026</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>+91 22 2849 5500 / VIP: +91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>concierge@aureliajewels.com</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-gold-300/90 pt-1">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Monday – Sunday: 11:00 AM – 8:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="border-t border-chocolate-800 bg-chocolate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory-400 space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} AURÉLIA JEWELS. All Royal Rights Reserved. Crafted with reverence for fine art.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] tracking-wider text-gold-400 uppercase font-medium">
              Secure Sandbox Payments
            </span>
            <div className="flex items-center space-x-2 text-ivory-300 text-[11px]">
              <span className="px-2 py-0.5 bg-chocolate-800 rounded border border-chocolate-700">Razorpay</span>
              <span className="px-2 py-0.5 bg-chocolate-800 rounded border border-chocolate-700">UPI</span>
              <span className="px-2 py-0.5 bg-chocolate-800 rounded border border-chocolate-700">Visa / MC</span>
              <span className="px-2 py-0.5 bg-chocolate-800 rounded border border-chocolate-700">NetBanking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
