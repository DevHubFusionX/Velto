import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, TrendingUp, Wallet, DollarSign, Loader2, Tag, ChevronRight, ChevronLeft, User, Shield, Check } from 'lucide-react';
import { useAuth } from '../context';
import { validateEmail, validatePassword } from '../utils/validators';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [sliding, setSliding] = useState(false);
  const [slideDir, setSlideDir] = useState(1); // 1 = forward, -1 = back
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  if (!isOpen) return null;

  const goToStep = (next, dir) => {
    setSlideDir(dir);
    setSliding(true);
    setTimeout(() => {
      setStep(next);
      setSliding(false);
    }, 180);
  };

  const handleNext = () => {
    setError('');
    if (!name.trim()) { setError('Please enter your full name'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return; }
    if (!phone.trim()) { setError('Please enter your phone number'); return; }
    goToStep(2, 1);
  };

  const handleBack = () => {
    setError('');
    goToStep(1, -1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2) return;
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ name, email, phone, password, referralCode });
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideOutLeft  { from { opacity: 1; transform: translateX(0) } to { opacity: 0; transform: translateX(-24px) } }
        @keyframes slideOutRight { from { opacity: 1; transform: translateX(0) } to { opacity: 0; transform: translateX(24px) } }
        @keyframes slideInRight  { from { opacity: 0; transform: translateX(24px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes slideInLeft   { from { opacity: 0; transform: translateX(-24px) } to { opacity: 1; transform: translateX(0) } }
        .step-exit-fwd  { animation: slideOutLeft  0.18s ease forwards; }
        .step-exit-back { animation: slideOutRight 0.18s ease forwards; }
        .step-enter-fwd  { animation: slideInRight 0.18s ease forwards; }
        .step-enter-back { animation: slideInLeft  0.18s ease forwards; }
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
          {/* Blobs — hidden on mobile */}
          <div className="hidden md:block absolute -top-20 -right-20 w-48 h-48 bg-[#a3e635] rounded-full blur-[60px] opacity-[0.12] pointer-events-none" />
          <div className="hidden md:block absolute -bottom-20 -left-20 w-48 h-48 bg-[#84cc16] rounded-full blur-[60px] opacity-[0.08] pointer-events-none" />

          <div className="relative grid md:grid-cols-2 min-h-[500px]">
            {/* Form side */}
            <div className="relative p-7 md:p-10 flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#a3e635]/20 rounded-tl-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-7">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-300"
                        style={{
                          backgroundColor: step >= s ? '#a3e635' : 'transparent',
                          borderColor: step >= s ? '#a3e635' : 'rgba(255,255,255,0.15)',
                          color: step >= s ? '#0a1f0a' : 'rgba(255,255,255,0.3)',
                        }}
                      >
                        {step > s ? <Check size={12} strokeWidth={3} /> : s === 1 ? <User size={12} strokeWidth={2} /> : <Shield size={12} strokeWidth={2} />}
                      </div>
                      {s < 2 && (
                        <div
                          className="w-8 h-px transition-colors duration-300"
                          style={{ backgroundColor: step > 1 ? '#a3e635' : 'rgba(255,255,255,0.1)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">
                  {step === 1 ? 'Create Account' : 'Security Setup'}
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  {step === 1 ? 'Personalize your investment experience' : 'Protect your digital wealth assets'}
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Step content */}
                <div className="flex-1 overflow-hidden">
                  <div
                    className={sliding
                      ? (slideDir > 0 ? 'step-exit-fwd' : 'step-exit-back')
                      : (slideDir > 0 ? 'step-enter-fwd' : 'step-enter-back')
                    }
                  >
                    {step === 1 ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.07] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hi@velto.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.07] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 800 000 0000"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.07] transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-full py-3.5 bg-[#a3e635] text-[#0a1f0a] font-bold rounded-xl text-sm transition-colors duration-200 hover:bg-[#b5f23d] flex items-center justify-center gap-2 mt-2"
                        >
                          Continue <ChevronRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.07] transition-colors"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Referral Code</label>
                            <span className="text-[10px] text-gray-600">Optional</span>
                          </div>
                          <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                            <input
                              type="text"
                              value={referralCode}
                              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                              placeholder="CODE-X"
                              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm font-mono uppercase focus:outline-none focus:border-[#a3e635]/50 focus:bg-white/[0.07] transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-2">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-3.5 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-xl text-sm hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-1"
                          >
                            <ChevronLeft size={16} /> Back
                          </button>
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-[2] py-3.5 bg-[#a3e635] text-[#0a1f0a] font-bold rounded-xl text-sm transition-colors duration-200 hover:bg-[#b5f23d] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {loading
                              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                              : <><Check size={16} /> Create Account</>
                            }
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-center text-xs text-gray-600 mt-6">
                  Already have an account?{' '}
                  <button onClick={onSwitchToLogin} className="text-[#a3e635] font-semibold hover:text-[#b5f23d] transition-colors">
                    Sign in
                  </button>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-white/[0.06]" />

            {/* Info side */}
            <div className="hidden md:flex relative bg-[#0a1f0a] p-10 flex-col justify-center">
              <div className="relative z-10 space-y-5">
                <div>
                  <h1 className="text-3xl font-light text-white mb-1 leading-tight">
                    Quantum<br />
                    <span className="text-[#a3e635] font-bold italic">Genesis</span>
                  </h1>
                  <p className="text-sm text-gray-500">Next-gen wealth preservation.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#a3e635]/15 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-[#a3e635]" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">$8.24K</div>
                      <div className="text-[10px] text-gray-500">Active Liquidity</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#a3e635]/10 rounded-lg w-fit">
                    <TrendingUp className="w-3 h-3 text-[#a3e635]" />
                    <span className="text-[10px] font-bold text-[#a3e635]">+24.8% Growth</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-xl font-bold text-white">48</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Smart Nodes</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#a3e635]" />
                      <div className="text-xl font-bold text-[#a3e635]">82K</div>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Yield / Mo</div>
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

export default RegisterModal;
