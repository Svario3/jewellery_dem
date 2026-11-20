import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Calendar, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    serviceType: 'Bespoke Bridal Consultation',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      serviceType: 'Bespoke Bridal Consultation',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-ivory-100 font-sans py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-700 font-semibold">
            Concierge & Boutique Appointments
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-chocolate-900">
            Connect with Aurélia
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 font-light">
            Schedule a private bridal viewing, request custom mastercrafts, or consult with our master gemologists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Contact Info & Showrooms */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-chocolate-900 pb-2 border-b border-ivory-200">
                Flagship Showroom
              </h3>

              <div className="space-y-3 text-xs text-chocolate-700">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-chocolate-900 font-semibold">Mumbai Flagship Boutique</strong>
                    <p className="text-chocolate-600">Aurélia Palace, 18 Altamount Road, Cumballa Hill, Mumbai 400026</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-chocolate-900 font-semibold">VIP Direct Line</strong>
                    <p className="text-chocolate-600">+91 22 2849 5500 / +91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-chocolate-900 font-semibold">Private Concierge Email</strong>
                    <p className="text-chocolate-600">concierge@aureliajewels.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-chocolate-900 font-semibold">Salon Hours</strong>
                    <p className="text-chocolate-600">Monday to Sunday: 11:00 AM – 8:30 PM (IST)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-chocolate-900 text-white p-6 rounded-2xl space-y-2">
              <h4 className="font-serif text-lg font-semibold text-gold-300">Complimentary Valet & Security</h4>
              <p className="text-xs text-ivory-300 font-light leading-relaxed">
                Our Altamount Road estate offers private armored parking and biometric vault viewing rooms for wedding entourages.
              </p>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-ivory-300 shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-chocolate-900 pb-3 border-b border-ivory-200">
              Book a Private Consultation
            </h2>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Thank you. Your consultation request has been received. Our Master Stylist will call you within 2 hours to confirm your private salon appointment.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Princess Gayatri Devi"
                    className="w-full px-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patron@aureliajewels.com"
                    className="w-full px-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                    Preferred Consultation Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-chocolate-900 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Nature of Service
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-chocolate-900 focus:outline-none focus:border-gold-600"
                >
                  <option value="Bespoke Bridal Consultation">Bespoke Bridal Trousseau Consultation</option>
                  <option value="Solitaire Diamond Viewing">Solitaire Diamond Viewing & Grading</option>
                  <option value="Custom Family Heirloom Redesign">Custom Family Heirloom Redesign</option>
                  <option value="Private Showroom Salon Visit">Private Showroom Salon Visit</option>
                  <option value="Corporate / Milestone Gifting">Corporate / Milestone Gifting</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
                  Additional Notes or Specific Jewels of Interest
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your preferred metals, wedding dates, or ring size..."
                  className="w-full px-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-chocolate-900 focus:outline-none focus:border-gold-600"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-xl text-xs font-semibold tracking-widest uppercase transition shadow-sm border border-gold-600/30"
              >
                Schedule Private Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
