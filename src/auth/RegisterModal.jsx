import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, TrendingUp, Wallet, DollarSign, Loader2, Tag, ChevronRight, ChevronLeft, User, Shield, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context';
import { validateEmail, validatePassword } from '../utils/validators';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
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

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
      if (!phone.trim()) {
        setError('Please enter your phone number');
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2) return;

    setLoading(true);
    setError('');

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute -top-3 -right-3 text-white/80 hover:text-white w-10 h-10 flex items-center justify-center transition-all z-50 bg-[#0a1f0a] border border-white/10 rounded-full hover:bg-[#a3e635] hover:text-[#0a1f0a] hover:rotate-90 duration-300" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="relative bg-[#0a1f0a] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-white/5">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#a3e635] rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#84cc16] rounded-full blur-[100px] opacity-15"></div>

          <div className="relative grid md:grid-cols-2 min-h-[520px]">
            <div className="relative p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-[#0a1f0a] to-[#0d2b0d] overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#a3e635]/20 rounded-tl-3xl"></div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Step Indicators */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 ${step >= 1 ? 'bg-[#a3e635] border-[#a3e635] text-[#0a1f0a]' : 'border-white/20 text-white/40'}`}>
                    {step > 1 ? <Check size={14} strokeWidth={3} /> : <User size={14} strokeWidth={3} />}
                  </div>
                  <div className={`h-0.5 w-8 rounded-full transition-all duration-500 ${step > 1 ? 'bg-[#a3e635]' : 'bg-white/10'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 ${step === 2 ? 'bg-[#a3e635] border-[#a3e635] text-[#0a1f0a]' : 'border-white/20 text-white/40'}`}>
                    <Shield size={14} strokeWidth={3} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                  {step === 1 ? 'Create Account' : 'Security Setup'}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  {step === 1 ? 'Personalize your investment experience' : 'Protect your digital wealth assets'}
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex-1 relative">
                  <AnimatePresence mode="wait" custom={step}>
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        custom={step}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/10 transition-all text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Node</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hi@velto.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/10 transition-all text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Line</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+234 800 000 0000"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/10 transition-all text-sm"
                            required
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-full py-4 bg-[#a3e635] text-[#0a1f0a] font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(163,230,53,0.3)] mt-6 flex items-center justify-center gap-2 group"
                        >
                          Continue Protocol
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        custom={step}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/10 transition-all text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 flex items-center justify-between">
                            Referral Hash
                            <span className="text-[9px] text-gray-600">(Optional)</span>
                          </label>
                          <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type="text"
                              value={referralCode}
                              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                              placeholder="CODE-X"
                              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/10 transition-all font-mono text-sm uppercase"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-4 bg-white/5 text-white/50 border border-white/10 font-bold rounded-xl transition-all hover:bg-white/10 hover:text-white flex items-center justify-center gap-2"
                          >
                            <ChevronLeft size={18} />
                            Back
                          </button>
                          <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-[2] py-4 bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(163,230,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <span>Finalize Access</span>
                                <Check size={18} />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-8">
                  Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="text-[#a3e635] hover:text-[#84cc16] transition-colors underline decoration-dotted">Secure Login</a>
                </p>
              </div>
            </div>

            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#a3e635]/20 to-transparent"></div>

            <div className="hidden md:flex relative bg-[#0a1f0a] p-10 flex-col justify-center overflow-hidden">
              <div className="absolute top-8 right-8 w-20 h-20 bg-[#a3e635]/5 rounded-2xl border border-[#a3e635]/10 rotate-12 animate-pulse"></div>
              <div className="absolute bottom-12 right-24 w-32 h-32 bg-[#84cc16]/5 rounded-full blur-2xl"></div>

              <div className="relative z-10 space-y-8">
                <div>
                  <h1 className="text-4xl font-light text-white mb-2 leading-tight">
                    Quantum<br />
                    <span className="text-[#a3e635] font-black italic">Genesis</span>
                  </h1>
                  <p className="text-sm text-gray-400 font-medium tracking-wide">Next-gen wealth preservation architecture.</p>
                </div>

                <div className="space-y-4 mt-8">
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#a3e635]/20 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                        <Wallet className="w-6 h-6 text-[#a3e635]" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-white tracking-tight">₦1.24M</div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Liquidity</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#a3e635]/10 rounded-lg w-fit">
                      <TrendingUp className="w-3 h-3 text-[#a3e635]" />
                      <span className="text-[10px] font-black text-[#a3e635] uppercase tracking-tighter">+24.8% GROWTH NODE</span>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/5"
                    >
                      <div className="text-2xl font-black text-white">48</div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Smart Nodes</div>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/5"
                    >
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-[#a3e635]" />
                        <div className="text-2xl font-black text-[#a3e635]">82K</div>
                      </div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Yield / Mo</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterModal;
