import React, { useEffect, useRef, useState } from 'react';
import { benefitsData, statsData } from '../../data/data';
import { theme } from '../../theme';

// Icon components
const Icon = ({ name, className }) => {
    const icons = {
        Shield: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        TrendingUp: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        Eye: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ),
        Zap: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        DollarSign: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        Users: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        Star: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        HeadphonesIcon: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        ),
    };
    return icons[name] || null;
};

const Benefits = () => {
    const [visibleBenefits, setVisibleBenefits] = useState([]);
    const benefitsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.index);
                        setVisibleBenefits((prev) => [...new Set([...prev, index])]);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: "0px 0px -10% 0px"
            }
        );

        benefitsRef.current.forEach((benefit) => {
            if (benefit) observer.observe(benefit);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section
            className="relative py-32 sm:py-40 overflow-hidden"
            style={{ backgroundColor: theme.colors.dark }}
            id="benefits"
        >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#a3e635] blur-[150px] opacity-5"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-30"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-1.5 rounded-full border border-[#a3e635]/20 bg-[#a3e635]/5 text-[#a3e635] text-xs font-semibold tracking-wide uppercase">
                            Why Choose Us
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Built on Trust & Excellence
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                        Join thousands of investors who trust us with their financial future.
                    </p>
                </div>

                {/* Stats Grid - Bento Style */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-32">
                    {statsData.map((stat, index) => (
                        <div
                            key={stat.id}
                            className={`group relative p-6 md:p-10 rounded-3xl bg-gradient-to-br backdrop-blur-md border transition-all duration-500 hover:scale-[1.02] overflow-hidden
                                ${index === 0 ? 'from-[#a3e635]/10 to-[#84cc16]/5 border-[#a3e635]/20' : 'from-white/10 to-white/5 border-white/10'}
                                hover:border-[#a3e635]/40 hover:shadow-[0_20px_60px_rgba(163,230,53,0.25)]
                            `}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#a3e635] rounded-full blur-3xl opacity-20"></div>
                            </div>
                            
                            <div className="relative flex flex-col items-center text-center">
                                <div className="mb-4 p-3 rounded-2xl bg-[#a3e635]/10 group-hover:bg-[#a3e635]/20 transition-colors">
                                    <Icon name={stat.icon} className="w-7 h-7 md:w-9 md:h-9 text-[#a3e635] group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent mb-2 group-hover:from-[#a3e635] group-hover:to-[#84cc16] transition-all">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bento Grid Layout: Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {benefitsData.map((benefit, index) => {
                        const isVisible = visibleBenefits.includes(index);
                        const isLarge = index === 0 || index === 3;
                        
                        return (
                            <div
                                key={benefit.id}
                                data-index={index}
                                ref={el => benefitsRef.current[index] = el}
                                className={`group relative rounded-3xl bg-gradient-to-br backdrop-blur-md border transition-all duration-700 overflow-hidden
                                    ${isLarge ? 'md:col-span-2 lg:col-span-2 p-10 md:p-12' : 'p-8 md:p-10'}
                                    ${index === 0 ? 'from-[#a3e635]/10 to-[#84cc16]/5 border-[#a3e635]/20' : 'from-white/5 to-transparent border-white/10'}
                                    hover:border-[#a3e635]/40 hover:shadow-[0_20px_60px_rgba(163,230,53,0.2)] hover:scale-[1.02]
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                                `}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Floating background orbs */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635] rounded-full blur-3xl opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#84cc16] rounded-full blur-3xl opacity-15"></div>
                                </div>

                                <div className={`relative flex ${isLarge ? 'flex-col md:flex-row items-start md:items-center gap-8' : 'flex-col gap-6'}`}>
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_30px_rgba(163,230,53,0.4)]
                                        ${isLarge ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16'}
                                    `}>
                                        <Icon name={benefit.icon} className={`text-[#0a1f0a] ${isLarge ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8'}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-white mb-3 group-hover:text-[#a3e635] transition-colors
                                            ${isLarge ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}
                                        `}>
                                            {benefit.title}
                                        </h3>
                                        <p className={`text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors
                                            ${isLarge ? 'text-base md:text-lg' : 'text-sm md:text-base'}
                                        `}>
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative corner gradient */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#a3e635]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a3e635] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
