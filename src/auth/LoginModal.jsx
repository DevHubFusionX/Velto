import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, Wallet, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '../context';
import { validateEmail } from '../utils/validators';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.25s ease' }}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center z-50 bg-[#0a1f0a] border border-white/10 rounded-full text-white/80 hover:bg-[#a3e635] hover:text-[#0a1f0a] transition-colors duration-200"
        >
          <X size={18} />
        </button>

        <div className="relative bg-[#0a1f0a] rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08]">
          {/* Blobs — small, low opacity, hidden on mobile */}
          <div className="hidden md:block absolute -top-20 -right-20 w-48 h-48 bg-[#a3e635] rounded-full blur-[60px] opacity-[0.12] pointer-events-none" />
          <div className="hidden md:block absolute -bottom-20 -left-20 w-48 h-48 bg-[#84cc16] rounded-full blur-[60px] opacity-[0.08] pointer-events-none" />

          <div className="relative grid md:grid-cols-2 min-h-[460px]">
            {/* Form side */}
            <div className="relative p-7 md:p-10 flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#a3e635]/20 rounded-tl-2xl pointer-events-none" />

              <div className="flex items-center gap-1.5 mb-7">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <div className="w-2 h-2 rounded-full bg-[#a3e635]" style={{ boxShadow: '0 0 8px rgba(163,230,53,0.7)' }} />
                <div className="w-2 h-2 rounded-full bg-white/30" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-gray-400 text-sm mb-7">Sign in to manage your investments</p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hi@velto.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.07] transition-colors"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-gray-400">Password</label>
                    <button
                      type="button"
                      onClick={onSwitchToForgotPassword}
                      className="text-xs text-gray-500 hover:text-[#a3e635] transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.07] transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#a3e635] text-[#0a1f0a] font-bold rounded-xl text-sm transition-colors duration-200 hover:bg-[#b5f23d] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <button onClick={onSwitchToRegister} className="text-[#a3e635] font-semibold hover:text-[#b5f23d] transition-colors">
                  Sign up
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-white/[0.06]" />

            {/* Info side */}
            <div className="hidden md:flex relative bg-[#0a1f0a] p-10 flex-col justify-center">
              <div className="relative z-10 space-y-5">
                <div>
                  <h1 className="text-3xl font-light italic text-white mb-1 leading-tight">
                    Grow Your<br />
                    <span className="text-[#a3e635] font-bold">Wealth</span>
                  </h1>
                  <p className="text-sm text-gray-500">with Smart Investments</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#a3e635]/15 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-[#a3e635]" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">$8.2K</div>
                      <div className="text-[10px] text-gray-500">Portfolio Value</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-[#a3e635]" />
                    <span className="text-xs font-semibold text-[#a3e635]">+18.5% this month</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-lg font-bold text-white">24</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Investments</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#a3e635]" />
                      <div className="text-lg font-bold text-[#a3e635]">45K</div>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Monthly</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
