import React, { useEffect, useRef, useState } from 'react';
import { metricsData } from '../../data/data';
import { theme } from '../../theme';

// Icon components
const Icon = ({ name, className }) => {
    const icons = {
        TrendingUp: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        Users: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        DollarSign: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        Shield: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    };
    return icons[name] || null;
};

const Stats = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-32 sm:py-40 overflow-hidden"
            style={{ backgroundColor: theme.colors.dark }}
            id="stats"
        >
            {/* Decorative Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#a3e635] blur-[200px] opacity-5"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-24">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-1.5 rounded-full border border-[#a3e635]/20 bg-[#a3e635]/5 text-[#a3e635] text-xs font-semibold tracking-wide uppercase">
                            Performance Metrics
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Numbers That Speak
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                        Our track record of excellence in numbers.
                    </p>
                </div>

                {/* Circular Metrics Layout - Rare Design */}
                <div className="relative">
                    {/* Center connecting lines */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-64 h-64">
                            {metricsData.map((_, index) => {
                                const angle = (index * 360) / metricsData.length - 90;
                                const radian = (angle * Math.PI) / 180;
                                const x = Math.cos(radian) * 120;
                                const y = Math.sin(radian) * 120;
                                return (
                                    <div
                                        key={index}
                                        className={`absolute top-1/2 left-1/2 w-px h-32 bg-gradient-to-b from-[#a3e635]/30 to-transparent origin-bottom transition-all duration-1000 ${isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                                            }`}
                                        style={{
                                            transform: `translate(-50%, -100%) rotate(${angle + 90}deg)`,
                                            transitionDelay: `${index * 150}ms`,
                                        }}
                                    />
                                );
                            })}
                            {/* Center glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#a3e635] rounded-full shadow-[0_0_40px_rgba(163,230,53,0.8)] animate-pulse"></div>
                        </div>
                    </div>

                    {/* Metrics in circular arrangement */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                        {metricsData.map((metric, index) => (
                            <div
                                key={metric.id}
                                className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                    }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <div className="relative p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-[#a3e635]/40 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(163,230,53,0.2)] overflow-hidden">
                                    {/* Animated background orb */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div
                                            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
                                            style={{ backgroundColor: metric.color }}
                                        ></div>
                                    </div>

                                    <div className="relative">
                                        {/* Icon */}
                                        <div className="mb-6">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_30px_rgba(163,230,53,0.3)]"
                                                style={{ backgroundColor: metric.color }}
                                            >
                                                <Icon name={metric.icon} className="w-8 h-8 text-[#0a1f0a]" />
                                            </div>
                                        </div>

                                        {/* Value with counter animation */}
                                        <div className="mb-4">
                                            <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a3e635] group-hover:from-[#a3e635] group-hover:to-[#84cc16] transition-all duration-500">
                                                {metric.value}
                                            </div>
                                        </div>

                                        {/* Label */}
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#a3e635] transition-colors">
                                            {metric.label}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                            {metric.description}
                                        </p>

                                        {/* Decorative corner accent */}
                                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#a3e635]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a3e635] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
