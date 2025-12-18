import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, Wallet, DollarSign } from 'lucide-react';
import { useAuth } from '../context';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button className="absolute -top-3 -right-3 text-white/80 hover:text-white w-10 h-10 flex items-center justify-center transition-all z-50 bg-[#0a1f0a] border border-white/10 rounded-full hover:bg-[#a3e635] hover:text-[#0a1f0a] hover:rotate-90 duration-300" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="relative bg-[#0a1f0a] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-white/5">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#a3e635] rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#84cc16] rounded-full blur-[100px] opacity-15"></div>
          
          <div className="relative grid md:grid-cols-2 min-h-[480px]">
            <div className="relative p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-[#0a1f0a] to-[#0d2b0d]">
              <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#a3e635]/20 rounded-tl-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.8)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm mb-8">Sign in to manage your investments</p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hi@velto.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">Password</label>
                      <a href="#" className="text-sm text-gray-400 hover:text-[#a3e635] transition-colors">Forgot?</a>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>
                  
                  <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                
                <p className="text-center text-sm text-gray-400 mt-6">
                  Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }} className="text-[#a3e635] hover:text-[#84cc16] font-semibold transition-colors">Sign up</a>
                </p>
              </div>
            </div>
            
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#a3e635]/30 to-transparent"></div>
            
            <div className="hidden md:flex relative bg-gradient-to-br from-[#0f2b0f] via-[#0a1f0a] to-[#0d1f0d] p-8 flex-col justify-center">
              <div className="absolute top-8 right-8 w-16 h-16 bg-[#a3e635]/10 backdrop-blur-sm rounded-xl border border-[#a3e635]/20 rotate-12"></div>
              
              <div className="relative z-10 space-y-6">
                <div>
                  <h1 className="text-4xl font-light italic text-white mb-2 leading-tight">
                    Grow Your<br />
                    <span className="text-[#a3e635]">Wealth</span>
                  </h1>
                  <p className="text-lg text-gray-400 font-light">with Smart Investments</p>
                </div>
                
                <div className="space-y-3 mt-8">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#a3e635]/20 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-[#a3e635]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">₦1.2M</div>
                        <div className="text-xs text-gray-400">Portfolio Value</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-[#a3e635]" />
                      <span className="text-xs font-semibold text-[#a3e635]">+18.5% this month</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="text-xl font-bold text-white">24</div>
                      <div className="text-xs text-gray-400">Investments</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-[#a3e635]" />
                        <div className="text-xl font-bold text-[#a3e635]">45K</div>
                      </div>
                      <div className="text-xs text-gray-400">Monthly</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
;};

export default LoginModal;
