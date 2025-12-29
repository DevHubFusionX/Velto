import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TrendingUp, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { theme } from '../theme';
import { useCurrency } from '../context';
import { userService } from '../services';
import { formatCurrency } from '../utils';

const PerformancePage = () => {
    const { currency, formatAmount } = useCurrency();
    const [timeframe, setTimeframe] = useState('1M');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchPerformanceData();
    }, []);

    const fetchPerformanceData = async () => {
        try {
            setLoading(true);
            const data = await userService.getDashboard();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch performance data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Custom Pie Chart Component
    const AllocationPieChart = ({ data }) => {
        let cumulativePercent = 0;

        function getCoordinatesForPercent(percent) {
            const x = Math.cos(2 * Math.PI * percent);
            const y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        }

        return (
            <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                    {data.map((slice, index) => {
                        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                        cumulativePercent += slice.value / 100;
                        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                        const largeArcFlag = slice.value / 100 > 0.5 ? 1 : 0;
                        const pathData = [
                            `M ${startX} ${startY}`,
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                            `L 0 0`,
                        ].join(' ');

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={slice.color}
                                className="transition-all hover:opacity-80 cursor-pointer"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full backdrop-blur-md flex items-center justify-center text-center" style={{ backgroundColor: 'rgba(10, 31, 10, 0.8)' }}>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Total</div>
                            <div className="text-sm font-bold text-white">100%</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Data handling: Prioritize backend data, fallback to mocks if empty
    const hasRealGrowth = stats?.historicalGrowth && stats.historicalGrowth.length > 1;
    const historicalGrowth = hasRealGrowth ? stats.historicalGrowth : [
        { date: '2023-10-01', returns: 10 },
        { date: '2023-11-01', returns: 25 },
        { date: '2023-12-01', returns: 45 },
        { date: '2024-01-01', returns: 30 },
        { date: '2024-02-01', returns: 60 },
        { date: '2024-03-01', returns: 85 }
    ];

    const hasRealAllocation = stats?.allocationPercentages && stats.allocationPercentages.length > 0;
    const allocationPercentages = hasRealAllocation ? stats.allocationPercentages : [
        { name: 'Stocks', value: 45, color: '#60a5fa' },
        { name: 'Crypto', value: 25, color: '#f59e0b' },
        { name: 'Real Estate', value: 20, color: '#a3e635' },
        { name: 'Cash', value: 10, color: '#94a3b8' }
    ];

    const maxVal = Math.max(...historicalGrowth.map(d => d.returns), 1);
    const chartPoints = historicalGrowth.length > 0
        ? historicalGrowth.map((d, i) => {
            const x = (i / (historicalGrowth.length - 1)) * 100;
            const y = 100 - (d.returns / maxVal) * 80; // Scale to 80% height
            return `${x},${y}`;
        }).join(' L ')
        : '';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout activeItem="performance">
            <div className="max-w-7xl mx-auto py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Performance Analytics</h1>
                        <p className="text-gray-400">Deep insights into your wealth growth</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse"></div>
                            <span className="text-xs font-bold text-gray-300">Live Updates</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Returns', value: stats?.totalReturns, change: '+12.4%', icon: TrendingUp, color: '#a3e635' },
                        { label: 'Total Invested', value: stats?.totalInvested, change: 'Active', icon: DollarSign, color: '#fff' },
                        { label: 'Growth Rate', value: `${stats?.totalReturnPercentage || 0}%`, change: 'Annualized', icon: BarChart3, color: '#fff' },
                        { label: 'Yield Score', value: '92/100', change: 'Excellent', icon: PieChart, color: '#a3e635' }
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                        <stat.icon size={20} className={stat.color === '#a3e635' ? 'text-[#a3e635]' : 'text-gray-400'} />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#a3e635]">{stat.change}</span>
                                </div>
                                <span className="text-gray-500 text-xs font-medium">{stat.label}</span>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {typeof stat.value === 'number' ? formatAmount(stat.value) : stat.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Performance Area Chart */}
                    <div className="lg:col-span-2 p-8 rounded-3xl backdrop-blur-md border overflow-hidden relative"
                        style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white">Investment Growth</h3>
                                <p className="text-xs text-gray-500">Cumulative returns over time</p>
                            </div>
                            <div className="flex gap-2">
                                {['1M', '3M', '6M', '1Y', 'ALL'].map(tf => (
                                    <button key={tf} onClick={() => setTimeframe(tf)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${timeframe === tf ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-500 hover:text-white bg-white/5'}`}>
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative h-64 w-full">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a3e635" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Grid Lines */}
                                {[0, 25, 50, 75, 100].map(val => (
                                    <line key={val} x1="0" y1={val} x2="100%" y2={val} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                ))}
                                {/* Area Path */}
                                {chartPoints && (
                                    <>
                                        <path
                                            d={`M 0,100 L ${chartPoints} L 100,100 Z`}
                                            fill="url(#chartGradient)"
                                        />
                                        <polyline
                                            points={chartPoints.replace(/ L /g, ' ')}
                                            fill="none"
                                            stroke="#a3e635"
                                            strokeWidth="3"
                                            strokeLinejoin="round"
                                        />
                                    </>
                                )}
                                {/* Data Points */}
                                {historicalGrowth.map((d, i) => (
                                    <circle
                                        key={i}
                                        cx={`${(i / (historicalGrowth.length - 1)) * 100}%`}
                                        cy={`${100 - (d.returns / maxVal) * 80}%`}
                                        r="4"
                                        fill="#0a1f0a"
                                        stroke="#a3e635"
                                        strokeWidth="2"
                                    />
                                ))}
                            </svg>
                            <div className="flex justify-between mt-4">
                                {historicalGrowth.map((d, i) => (
                                    <span key={i} className="text-[10px] text-gray-500 font-bold uppercase">{d.date.split('-')[1]}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Allocation Circular */}
                    <div className="p-8 rounded-3xl backdrop-blur-md border"
                        style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <h3 className="text-xl font-bold text-white mb-2">Asset Allocation</h3>
                        <AllocationPieChart data={allocationPercentages} />

                        <div className="mt-8 space-y-3">
                            {allocationPercentages.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-xs text-gray-400">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-white">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Breakdown Table */}
                <div className="p-8 rounded-3xl backdrop-blur-md border"
                    style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white">Active Portfolio Breakdown</h3>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Across {stats?.activeInvestments?.length} Assets</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats?.activeInvestments?.map((inv, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#a3e635]/30 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-[#a3e635]/10 group-hover:border-[#a3e635]/20 transition-all">
                                        <TrendingUp className="w-6 h-6 text-gray-500 group-hover:text-[#a3e635] transition-all" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{inv.product}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{inv.status}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                            <span className="text-[10px] text-gray-500">Since {inv.startDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-white">{formatAmount(inv.currentValue)}</div>
                                    <div className="text-xs font-bold text-[#a3e635]">{inv.returns}</div>
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
