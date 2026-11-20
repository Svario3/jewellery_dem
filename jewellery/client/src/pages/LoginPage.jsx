import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCustomer = () => {
    setEmail('customer@aureliajewels.com');
    setPassword('Customer@123');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@aureliajewels.com');
    setPassword('Admin@123');
  };

  return (
    <div className="min-h-[80vh] bg-ivory-100 flex items-center justify-center p-4 font-sans">
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
            Sign In to Your Royal Vault
          </h2>
          <p className="text-xs text-chocolate-500 font-light">
            Access your curated wishlist, saved addresses, and insured orders
          </p>
        </div>

        {/* Demo Credentials Quick Fill Pills */}
        <div className="bg-ivory-100 p-3 rounded-xl border border-ivory-200 text-xs space-y-2">
          <span className="font-semibold text-chocolate-800 text-[11px] block uppercase tracking-wider">
            Quick-Fill Demo Credentials:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillDemoCustomer}
              className="py-1.5 px-2 bg-white text-chocolate-900 hover:border-gold-600 border border-ivory-300 rounded text-[11px] font-medium transition"
            >
              Demo Patron
            </button>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="py-1.5 px-2 bg-chocolate-900 text-gold-300 hover:bg-gold-700 hover:text-white rounded text-[11px] font-semibold transition"
            >
              Demo Admin Vault
            </button>
          </div>
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
              Email Address
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
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
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
            {loading ? 'Authenticating...' : 'Sign In To Vault'}
          </button>
        </form>

        <div className="text-center text-xs text-chocolate-600 pt-2 border-t border-ivory-200">
          <span>New to Aurélia Jewels? </span>
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-gold-800 font-semibold underline hover:text-chocolate-900"
          >
            Create Royal Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
