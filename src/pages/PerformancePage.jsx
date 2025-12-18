import { useState } from 'react';
import { DashboardLayout } from '../components/layout';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, PieChart, Menu } from 'lucide-react';

const PerformancePage = () => {
    const [currency, setCurrency] = useState('NGN');
    const [timeframe, setTimeframe] = useState('1M');

    const performanceData = {
        totalReturn: { ngn: '₦108,250', usd: '$216.50', percentage: '+11.4%' },
        monthlyGrowth: { ngn: '₦45,000', usd: '$90', percentage: '+4.7%' },
        bestPerformer: 'Premium Portfolio',
        avgReturn: '15.2%'
    };

    const monthlyData = [
        { month: 'Jan', value: 12, returns: '+12%' },
        { month: 'Feb', value: 15, returns: '+15%' },
        { month: 'Mar', value: 18, returns: '+18%' },
        { month: 'Apr', value: 14, returns: '+14%' },
        { month: 'May', value: 20, returns: '+20%' },
        { month: 'Jun', value: 17, returns: '+17%' }
    ];

    const investments = [
        { name: 'Premium Portfolio', allocation: 45, returns: '+25%', value: currency === 'NGN' ? '₦575,000' : '$1,150', color: '#a3e635' },
        { name: 'Growth Fund', allocation: 30, returns: '+18%', value: currency === 'NGN' ? '₦268,750' : '$537.50', color: '#84cc16' },
        { name: 'Stable Income', allocation: 25, returns: '+12%', value: currency === 'NGN' ? '₦159,000' : '$318', color: '#65a30d' }
    ];

    return (
        <DashboardLayout activeItem="performance">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Performance Analytics</h1>
                        <p className="text-gray-400">Track your investment performance and growth</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                            <button
                                onClick={() => setCurrency('NGN')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currency === 'NGN' ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400'}`}
                            >
                                NGN
                            </button>
                            <button
                                onClick={() => setCurrency('USD')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currency === 'USD' ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400'}`}
                            >
                                USD
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.15), rgba(132, 204, 22, 0.05))', borderColor: 'rgba(163, 230, 53, 0.3)' }}>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#a3e635]/10 rounded-full blur-2xl"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#a3e635]/20 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-[#a3e635]" />
                                </div>
                            </div>
                            <span className="text-gray-400 text-xs font-medium">Total Returns</span>
                            <div className="text-3xl font-bold text-[#a3e635] mt-1">{currency === 'NGN' ? performanceData.totalReturn.ngn : performanceData.totalReturn.usd}</div>
                            <span className="text-sm text-[#a3e635]">{performanceData.totalReturn.percentage}</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <span className="text-gray-400 text-xs font-medium">Monthly Growth</span>
                            <div className="text-3xl font-bold text-white mt-1">{currency === 'NGN' ? performanceData.monthlyGrowth.ngn : performanceData.monthlyGrowth.usd}</div>
                            <span className="text-sm text-[#a3e635]">{performanceData.monthlyGrowth.percentage}</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <span className="text-gray-400 text-xs font-medium">Avg. Return</span>
                            <div className="text-3xl font-bold text-white mt-1">{performanceData.avgReturn}</div>
                            <span className="text-sm text-gray-400">Across all investments</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <PieChart className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <span className="text-gray-400 text-xs font-medium">Best Performer</span>
                            <div className="text-xl font-bold text-white mt-1">{performanceData.bestPerformer}</div>
                            <span className="text-sm text-[#a3e635]">+25% returns</span>
                        </div>
                    </div>
                </div>

                {/* Timeframe Filter */}
                <div className="flex gap-3 mb-6">
                    {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${timeframe === tf ? 'bg-[#a3e635] text-[#0a1f0a]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 p-6 rounded-2xl backdrop-blur-md border" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <h3 className="text-xl font-bold text-white mb-6">Monthly Performance</h3>
                        <div className="flex items-end justify-between gap-4 h-64">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs font-semibold text-[#a3e635]">{data.returns}</span>
                                    <div className="w-full bg-white/5 rounded-t-xl relative overflow-hidden group cursor-pointer" style={{ height: `${data.value * 10}px` }}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#a3e635] to-[#84cc16] group-hover:from-[#84cc16] group-hover:to-[#a3e635] transition-all"></div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio Allocation */}
                    <div className="p-6 rounded-2xl backdrop-blur-md border" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <h3 className="text-xl font-bold text-white mb-6">Portfolio Allocation</h3>
                        <div className="space-y-4">
                            {investments.map((inv, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-300">{inv.name}</span>
                                        <span className="text-sm font-bold text-white">{inv.allocation}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${inv.allocation}%`, backgroundColor: inv.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Investment Performance Table */}
                <div className="p-6 rounded-2xl backdrop-blur-md border" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <h3 className="text-xl font-bold text-white mb-6">Investment Breakdown</h3>
                    <div className="space-y-3">
                        {investments.map((inv, index) => (
                            <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#a3e635]/30 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${inv.color}20` }}>
                                            <TrendingUp className="w-6 h-6" style={{ color: inv.color }} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{inv.name}</h4>
                                            <span className="text-xs text-gray-400">{inv.allocation}% of portfolio</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-white">{inv.value}</div>
                                        <span className="text-sm font-semibold" style={{ color: inv.color }}>{inv.returns}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PerformancePage;
