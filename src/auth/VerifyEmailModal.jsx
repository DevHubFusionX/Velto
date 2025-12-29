import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Mail, RefreshCw } from 'lucide-react';
import { authService } from '../services';
import { useToast } from '../context';

const VerifyEmailModal = ({ isOpen, onClose, email, onVerified }) => {
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const { addToast } = useToast();

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length < 6) return;

        try {
            setSubmitting(true);
            const response = await authService.verifyEmail(email, code);
            if (response.success) {
                addToast('Email verified successfully!', 'success');
                onVerified();
                onClose();
            }
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Verification failed', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;

        try {
            setResending(true);
            await authService.resendVerification(email);
            addToast('Verification code sent! Check your email.', 'success');
            setCooldown(60); // 60 second cooldown
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Failed to resend code', 'error');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1a1c1e] rounded-3xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mail className="text-[#a3e635]" size={24} />
                        Verify Email
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-400 text-sm mb-6">
                    Please enter the 6-digit verification code sent to <span className="text-white font-medium">{email}</span>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full text-center text-4xl font-bold tracking-[1rem] bg-white/5 border border-white/10 rounded-2xl py-4 text-white focus:outline-none focus:border-[#a3e635] transition-all placeholder:tracking-widest placeholder:text-gray-700"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || code.length < 6}
                        className="w-full py-4 bg-[#a3e635] hover:bg-[#8cc629] disabled:opacity-50 disabled:cursor-not-allowed text-[#0a1f0a] font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                        Verify Now
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending || cooldown > 0}
                            className="text-sm text-gray-400 hover:text-[#a3e635] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend verification code'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmailModal;
