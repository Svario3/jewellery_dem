import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      await register(name, email, password, phone);
      navigate(redirect);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Account registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-ivory-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-ivory-300 shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl font-semibold tracking-[0.25em] text-chocolate-900 uppercase">
              Aurélia
            </span>
            <div className="text-[10px] tracking-[0.4em] text-gold-700 uppercase font-medium">
              Fine Jewels
            </div>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-chocolate-900 pt-2">
            Create Royal Account
          </h2>
          <p className="text-xs text-chocolate-500 font-light">
            Enjoy private bridal consultations, order tracking, and bespoke vaults
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Princess Gayatri Devi"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
              />
              <User className="w-4 h-4 text-chocolate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@aureliajewels.com"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
              />
              <Mail className="w-4 h-4 text-chocolate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
              />
              <Phone className="w-4 h-4 text-chocolate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-lg text-xs text-chocolate-900 focus:outline-none focus:border-gold-600"
              />
              <Lock className="w-4 h-4 text-chocolate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded-xl text-xs font-semibold tracking-widest uppercase transition duration-300 shadow-sm border border-gold-600/30 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Royal Account'}
          </button>
        </form>

        <div className="text-center text-xs text-chocolate-600 pt-2 border-t border-ivory-200">
          <span>Already have an account? </span>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-gold-800 font-semibold underline hover:text-chocolate-900"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
