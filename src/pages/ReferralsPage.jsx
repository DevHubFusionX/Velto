import { useState, useEffect } from 'react';
import { Users, Gift, Copy, Check, Share2, TrendingUp, DollarSign } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCurrency, useToast } from '../context';
import { userService } from '../services';
import { theme } from '../theme';

const ReferralsPage = () => {
    const { formatAmount } = useCurrency();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [referralData, setReferralData] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            setLoading(true);
            const data = await userService.getDashboard();
            setReferralData(data.referrals);
        } catch (error) {
            console.error('Failed to fetch referrals:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralData?.code || '');
        setCopied(true);
        addToast('Referral code copied!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
                <div className="w-12 h-12 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin"></div>
            </div>
        );
    }

    return (
        <DashboardLayout activeItem="referrals">
            <div className="max-w-7xl mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Refer & Earn</h1>
                    <p className="text-gray-400">Invite your friends and earn rewards on their first investment</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Referral Widget */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-8 rounded-3xl backdrop-blur-md border relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.1), rgba(132, 204, 22, 0.05))', borderColor: 'rgba(163, 230, 53, 0.3)' }}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3e635]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <div className="relative">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-[#a3e635]/20 flex items-center justify-center">
                                        <Gift className="w-8 h-8 text-[#a3e635]" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Earn $5.00 Bonus</h2>
                                        <p className="text-gray-400">For every friend who joins and invests</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Your Referral Code</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-xl font-mono font-bold text-white flex items-center justify-between">
                                            {referralData?.code}
                                            {copied ? <Check className="text-[#a3e635]" /> : <Copy className="text-gray-500" />}
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="px-8 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/?ref=${referralData?.code}`;
                                            navigator.clipboard.writeText(url);
                                            addToast('Referral link copied!', 'success');
                                        }}
                                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/btn"
                                    >
                                        <Share2 size={20} className="text-[#a3e635] group-hover/btn:scale-110 transition-transform" />
                                        <span className="text-[10px] uppercase font-bold text-gray-500">Share Link</span>
                                    </button>
                                    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <TrendingUp size={20} className="text-[#a3e635]" />
                                        <span className="text-[10px] uppercase font-bold text-gray-500">Track Progress</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <DollarSign size={20} className="text-[#a3e635]" />
                                        <span className="text-[10px] uppercase font-bold text-gray-500">Get Paid</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Referral History */}
                        <div className="p-8 rounded-3xl backdrop-blur-md border"
                            style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <h3 className="text-xl font-bold text-white mb-6">Recent Referrals</h3>
                            <div className="space-y-4">
                                {referralData?.history.map((ref, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                                                {ref.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{ref.name}</p>
                                                <p className="text-xs text-gray-500">{ref.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-bold px-3 py-1 rounded-full mb-1 ${ref.status === 'Active' ? 'bg-[#a3e635]/20 text-[#a3e635]' : 'bg-white/5 text-gray-500'}`}>
                                                {ref.status}
                                            </div>
                                            <p className="text-sm font-bold text-white">{ref.bonus > 0 ? `+${formatAmount(ref.bonus)}` : '--'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & How it works */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-3xl backdrop-blur-md border"
                            style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <p className="text-gray-500 text-[10px] uppercase font-bold mb-4">Earnings Summary</p>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Total Rewards Earned</p>
                                    <p className="text-3xl font-bold text-white">{formatAmount(referralData?.totalEarned || 0)}</p>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-gray-500 text-xs mb-1">Total Friends Invited</p>
                                    <p className="text-3xl font-bold text-white">{referralData?.count || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                            <h4 className="text-white font-bold mb-4">How it works</h4>
                            <div className="space-y-4">
                                {[
                                    { step: '01', title: 'Invite friends', desc: 'Share your code with friends' },
                                    { step: '02', title: 'They Invest', desc: 'They make an investment of $10+' },
                                    { step: '03', title: 'You Get Paid', desc: 'Receive $5.00 bonus instantly' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-sm font-bold text-[#a3e635]">{step.step}</span>
                                        <div>
                                            <p className="text-sm font-bold text-white">{step.title}</p>
                                            <p className="text-xs text-gray-500">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReferralsPage;
