import { useState } from 'react';
import { X, Mail, ArrowRight, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context';
import { validateEmail } from '../utils/validators';

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { forgotPassword } = useAuth();

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
            await forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <button className="absolute -top-3 -right-3 text-white/80 hover:text-white w-10 h-10 flex items-center justify-center transition-all z-50 bg-[#0a1f0a] border border-white/10 rounded-full hover:bg-[#a3e635] hover:text-[#0a1f0a] hover:rotate-90 duration-300" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="relative bg-[#0a1f0a] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-white/5 p-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635] rounded-full blur-[80px] opacity-10"></div>

                    <div className="relative z-10">
                        {success ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-[#a3e635]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-[#a3e635]" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                                <p className="text-gray-400 text-sm mb-8">
                                    We've sent password reset instructions to <span className="text-white font-medium">{email}</span>
                                </p>

                                <button
                                    onClick={onSwitchToLogin}
                                    className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl transition-all duration-300 hover:bg-white/10"
                                >
                                    Back to Log In
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={onSwitchToLogin}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Log In
                                </button>

                                <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                                <p className="text-gray-400 text-sm mb-8">Enter your email address and we'll send you instructions to reset your password.</p>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="hi@velto.com"
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/10 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
