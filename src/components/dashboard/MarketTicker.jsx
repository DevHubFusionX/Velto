import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { theme } from '../../theme';
import { userService } from '../../services';

const MarketTicker = () => {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const data = await userService.getDashboard();
                setMarketData(data.marketData || []);
            } catch (error) {
                console.error('Failed to fetch market data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMarketData();
    }, []);

    // Double the data for seamless loop
    const tickerItems = [...marketData, ...marketData];

    if (loading || marketData.length === 0) return (
        <div className="w-full bg-[#0a1f0a]/80 backdrop-blur-md border-b border-[#a3e635]/10 py-4 overflow-hidden">
            <div className="animate-pulse flex gap-8 px-8">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-4 w-32 bg-white/5 rounded"></div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full bg-[#0a1f0a]/80 backdrop-blur-md border-b border-[#a3e635]/10 py-3 overflow-hidden">
            <div className="flex animate-ticker whitespace-nowrap">
                {tickerItems.map((item, i) => (
                    <div key={i} className="inline-flex items-center gap-4 px-10 border-r border-white/5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{item.symbol}</span>
                        <span className="text-sm font-black text-white">{item.price}</span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-[#a3e635]">
                            <CheckCircle2 size={12} className="opacity-80" />
                            {item.change}
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 30s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}} />
        </div>
    );
};

export default MarketTicker;
