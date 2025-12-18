import { useState } from 'react';
import { DashboardLayout } from '../components/layout';
import { TrendingUp, Clock, Target, Zap, Star, ArrowRight, Filter } from 'lucide-react';

const OpportunitiesPage = () => {
    const [currency, setCurrency] = useState('NGN');
    const [filter, setFilter] = useState('all');

    const opportunities = [
        {
            id: 1,
            title: 'Tech Startup Fund',
            category: 'high-growth',
            returns: '30-40%',
            minInvestment: { ngn: '₦100,000', usd: '$200' },
            duration: '18 months',
            risk: 'High',
            spotsLeft: 12,
            totalSpots: 50,
            trending: true,
            description: 'Invest in promising tech startups with high growth potential',
            color: '#a3e635'
        },
        {
            id: 2,
            title: 'Real Estate Development',
            category: 'real-estate',
            returns: '22-28%',
            minInvestment: { ngn: '₦500,000', usd: '$1,000' },
            duration: '24 months',
            risk: 'Medium',
            spotsLeft: 8,
            totalSpots: 20,
            trending: true,
            description: 'Premium real estate projects in prime locations',
            color: '#84cc16'
        },
        {
            id: 3,
            title: 'Green Energy Initiative',
            category: 'sustainable',
            returns: '18-25%',
            minInvestment: { ngn: '₦200,000', usd: '$400' },
            duration: '36 months',
            risk: 'Medium',
            spotsLeft: 25,
            totalSpots: 100,
            trending: false,
            description: 'Sustainable energy projects with long-term returns',
            color: '#65a30d'
        },
        {
            id: 4,
            title: 'Agriculture Export',
            category: 'agriculture',
            returns: '20-26%',
            minInvestment: { ngn: '₦150,000', usd: '$300' },
            duration: '12 months',
            risk: 'Low-Medium',
            spotsLeft: 30,
            totalSpots: 80,
            trending: false,
            description: 'Export-focused agricultural investments',
            color: '#4d7c0f'
        },
        {
            id: 5,
            title: 'Healthcare Innovation',
            category: 'healthcare',
            returns: '25-35%',
            minInvestment: { ngn: '₦300,000', usd: '$600' },
            duration: '20 months',
            risk: 'Medium-High',
            spotsLeft: 5,
            totalSpots: 30,
            trending: true,
            description: 'Revolutionary healthcare technology investments',
            color: '#a3e635'
        },
        {
            id: 6,
            title: 'E-commerce Expansion',
            category: 'high-growth',
            returns: '28-38%',
            minInvestment: { ngn: '₦250,000', usd: '$500' },
            duration: '15 months',
            risk: 'High',
            spotsLeft: 15,
            totalSpots: 60,
            trending: true,
            description: 'Fast-growing e-commerce platforms',
            color: '#84cc16'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Opportunities' },
        { id: 'high-growth', name: 'High Growth' },
        { id: 'real-estate', name: 'Real Estate' },
        { id: 'sustainable', name: 'Sustainable' },
        { id: 'agriculture', name: 'Agriculture' },
        { id: 'healthcare', name: 'Healthcare' }
    ];

    const filteredOpportunities = filter === 'all' 
        ? opportunities 
        : opportunities.filter(opp => opp.category === filter);

    return (
        <DashboardLayout activeItem="opportunities">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Investment Opportunities</h1>
                        <p className="text-gray-400">Discover exclusive investment opportunities</p>
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

                {/* Category Filter */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${filter === cat.id ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Opportunities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOpportunities.map((opp) => (
                        <div
                            key={opp.id}
                            className="group relative p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-4">
                                {opp.trending && (
                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#a3e635]/20 border border-[#a3e635]/30">
                                        <Zap className="w-3 h-3 text-[#a3e635]" />
                                        <span className="text-xs font-bold text-[#a3e635]">Trending</span>
                                    </div>
                                )}
                                {opp.spotsLeft <= 10 && (
                                    <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                                        <span className="text-xs font-bold text-red-400">Limited</span>
                                    </div>
                                )}
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: opp.color }}></div>

                            <div className="relative">
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${opp.color}20` }}>
                                    <Star className="w-7 h-7" style={{ color: opp.color }} />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-2">{opp.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">{opp.description}</p>

                                {/* Stats */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-400">Returns</span>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: opp.color }}>{opp.returns}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-400">Duration</span>
                                        </div>
                                        <span className="text-sm font-semibold text-white">{opp.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-400">Min. Investment</span>
                                        </div>
                                        <span className="text-sm font-semibold text-white">
                                            {currency === 'NGN' ? opp.minInvestment.ngn : opp.minInvestment.usd}
                                        </span>
                                    </div>
                                </div>

                                {/* Spots Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>Spots Available</span>
                                        <span>{opp.spotsLeft}/{opp.totalSpots}</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{ width: `${(opp.spotsLeft / opp.totalSpots) * 100}%`, backgroundColor: opp.color }}
                                        ></div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2" style={{ backgroundColor: opp.color, color: '#0a1f0a' }}>
                                    Invest Now
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OpportunitiesPage;
