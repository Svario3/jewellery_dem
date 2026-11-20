import React from 'react';
import { useParams, Link } from 'react-router-dom';

const PolicyPages = () => {
  const { policyType } = useParams();

  const renderContent = () => {
    switch (policyType) {
      case 'returns':
        return (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl text-chocolate-900 font-normal">
              30-Day Return & Lifetime Exchange Policy
            </h1>
            <div className="space-y-4 text-xs sm:text-sm text-chocolate-700/90 leading-relaxed font-light pt-4 border-t border-ivory-200">
              <p>
                At AURÉLIA JEWELS, we want every patron to cherish their fine jewellery. If you are not completely enchanted by your acquisition, you may request an exchange or return within 30 days of receipt.
              </p>
              <h3 className="font-serif text-lg font-bold text-chocolate-900 pt-2">Return Eligibility</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>The jewel must be unworn, undamaged, and returned with the intact tamper-evident security seal.</li>
                <li>Original certification cards (BIS Hallmark certificate, IGI/GIA diamond dossier) must be included.</li>
                <li>The archival wooden presentation case and invoice must accompany the parcel.</li>
              </ul>
              <h3 className="font-serif text-lg font-bold text-chocolate-900 pt-2">Lifetime Exchange Guarantee</h3>
              <p>
                All 22K and 18K solid gold jewellery can be exchanged for 100% of the current benchmark gold value at the prevailing bullion rate on the day of exchange.
              </p>
            </div>
          </>
        );

      case 'terms':
        return (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl text-chocolate-900 font-normal">
              Terms & Conditions
            </h1>
            <div className="space-y-4 text-xs sm:text-sm text-chocolate-700/90 leading-relaxed font-light pt-4 border-t border-ivory-200">
              <p>
                Welcome to AURÉLIA JEWELS. By accessing our vault and acquiring fine jewellery, you agree to comply with our commercial terms and conditions.
              </p>
              <h3 className="font-serif text-lg font-bold text-chocolate-900 pt-2">Bullion Rate Fluctuations</h3>
              <p>
                Fine jewellery pricing reflects the prevailing market value of 22K/18K gold and precious stones. Prices are locked upon checkout authorization.
              </p>
              <h3 className="font-serif text-lg font-bold text-chocolate-900 pt-2">Authenticity & Hallmarking</h3>
              <p>
                Every ornament is guaranteed to match its stamped purity specifications in compliance with the Bureau of Indian Standards (BIS) Act.
              </p>
            </div>
          </>
        );

      default:
        return (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl text-chocolate-900 font-normal">
              Privacy Policy & Client Discretion
            </h1>
            <div className="space-y-4 text-xs sm:text-sm text-chocolate-700/90 leading-relaxed font-light pt-4 border-t border-ivory-200">
              <p>
                We hold your privacy in the highest regard. Any personal, residential, or financial information shared with AURÉLIA JEWELS is safeguarded by strict confidentiality protocols.
              </p>
              <h3 className="font-serif text-lg font-bold text-chocolate-900 pt-2">Data Protection</h3>
              <p>
                We do not sell, rent, or disclose patron acquisition records to third parties. All transactions are processed through 256-bit encrypted gateways.
              </p>
              <h3 className="font-serif text-lg font-bold text-chocolate-900 pt-2">Discreet Insured Packaging</h3>
              <p>
                To maintain confidentiality and prevent transit security risks, packages carry no outward branding indicating precious jewels.
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 font-sans py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-ivory-300 shadow-sm space-y-6">
          <div className="flex space-x-4 border-b border-ivory-200 pb-4 text-xs font-semibold uppercase tracking-wider">
            <Link
              to="/policies/privacy"
              className={policyType === 'privacy' || !policyType ? 'text-gold-800 font-bold' : 'text-chocolate-500'}
            >
              Privacy Policy
            </Link>
            <Link
              to="/policies/terms"
              className={policyType === 'terms' ? 'text-gold-800 font-bold' : 'text-chocolate-500'}
            >
              Terms & Conditions
            </Link>
            <Link
              to="/policies/returns"
              className={policyType === 'returns' ? 'text-gold-800 font-bold' : 'text-chocolate-500'}
            >
              Returns & Exchanges
            </Link>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PolicyPages;
