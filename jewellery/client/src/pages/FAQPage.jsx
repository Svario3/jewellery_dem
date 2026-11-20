import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How do I verify the authenticity and hallmarking of Aurélia jewellery?',
      a: 'Every piece of Aurélia gold jewellery is hallmarked under Bureau of Indian Standards (BIS) regulations with laser-etched HUID (Hallmark Unique Identification Number). Our solitaires carry international certificates from IGI or GIA. Each shipment includes physical certificates of purity.',
    },
    {
      q: 'How does Complimentary Insured Delivery work?',
      a: 'All acquisitions over ₹5,000 enjoy complimentary armored transit with door-to-door insurance coverage across India. The shipment is delivered in tamper-evident sealed security packaging by specialized high-value couriers.',
    },
    {
      q: 'Can I customize a bridal set or request custom sizing?',
      a: 'Yes. We provide bespoke commissions for bridal chokers, necklaces, and cocktail rings. Ring sizes from Indian size 8 to 24 and bangle diameters from 2.2 to 2.10 can be customized by our master goldsmiths.',
    },
    {
      q: 'What is the Aurélia Lifetime Exchange & Buyback policy?',
      a: 'We offer a guaranteed lifetime exchange on all 22K and 18K fine gold jewellery. The benchmark gold rate prevailing on the date of return will be credited towards your new selection after standard deduction of making charges.',
    },
    {
      q: 'What payment methods are supported on the online vault?',
      a: 'We support all major payment instruments via our secure Razorpay gateway, including Visa, MasterCard, American Express, UPI (Google Pay, PhonePe, Paytm), NetBanking across 50+ banks, as well as Cash on Delivery (COD) for eligible pin codes.',
    },
    {
      q: 'How do I care for my uncut Polki and Kundan jewels?',
      a: 'Avoid exposing polki and meenakari jewellery to perfumes, moisture, chlorine, or excessive heat. Clean gently using the microfiber polishing cloth provided in your luxury presentation box. Aurélia offers lifetime complimentary ultrasonic cleaning at all flagship showrooms.',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 font-sans py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-700 font-semibold">
            Patron Knowledge Base
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-chocolate-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 font-light">
            Answers concerning BIS hallmarking, bespoke bridal consultations, sizing, and armored transit.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full px-6 py-5 text-left font-serif text-base font-semibold text-chocolate-900 flex items-center justify-between hover:bg-ivory-50 transition"
              >
                <span>{faq.q}</span>
                {openIdx === idx ? (
                  <ChevronUp className="w-5 h-5 text-gold-700 flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-chocolate-400 flex-shrink-0 ml-4" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-chocolate-700 leading-relaxed font-light border-t border-ivory-200 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
