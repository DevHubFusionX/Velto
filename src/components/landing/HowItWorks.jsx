import React, { useEffect, useRef, useState } from 'react';
import { howItWorksData } from '../../data/data';
import { theme } from '../../theme';

const icons = {
    UserPlus: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
    ),
    CreditCard: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    TrendingUp: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    PieChart: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
    ),
};

const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [visibleSteps, setVisibleSteps] = useState(new Set());
    const stepsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.dataset.index);
                    if (entry.isIntersecting) {
                        setVisibleSteps(prev => new Set([...prev, index]));
                        if (entry.intersectionRatio > 0.4) {
                            setActiveStep(index);
                        }
                    }
                });
            },
            { threshold: [0.2, 0.4], rootMargin: '-10% 0px -10% 0px' }
        );

        stepsRef.current.forEach(step => step && observer.observe(step));
        return () => observer.disconnect();
    }, []);

    const progressPct = ((activeStep + 1) / howItWorksData.length) * 100;

    return (
        <section
            className="relative py-24 sm:py-32 overflow-hidden"
            style={{ backgroundColor: theme.colors.dark }}
            id="how-it-works"
        >
            {/* Background blobs — reduced blur, hidden on mobile to save GPU */}
            <div className="hidden md:block absolute top-1/4 right-0 w-72 h-72 rounded-full bg-[#a3e635] blur-[80px] opacity-[0.07] pointer-events-none" />
            <div className="hidden md:block absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-[#1a2e1a] blur-[60px] opacity-20 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 sm:mb-24">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-[#a3e635]/20 bg-[#a3e635]/5 text-[#a3e635] text-xs font-semibold tracking-wide uppercase mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">How It Works</h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                        Start your journey to financial freedom in four simple steps.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical progress line */}
                    <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-px">
                        <div
                            className="w-full bg-[#a3e635]"
                            style={{
                                height: `${progressPct}%`,
                                transition: 'height 0.5s ease',
                                boxShadow: '0 0 8px rgba(163,230,53,0.4)',
                            }}
                        />
                    </div>

                    <div className="space-y-12 sm:space-y-20 md:space-y-28">
                        {howItWorksData.map((step, index) => {
                            const isActive = index <= activeStep;
                            const isVisible = visibleSteps.has(index);

                            return (
                                <div
                                    key={step.id}
                                    data-index={index}
                                    ref={el => stepsRef.current[index] = el}
                                    className="relative flex gap-6 md:gap-0 md:items-center"
                                    style={{
                                        opacity: isVisible ? 1 : 0,
                                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                                        transitionDelay: `${index * 60}ms`,
                                        willChange: isVisible ? 'auto' : 'opacity, transform',
                                    }}
                                >
                                    {/* Icon bubble */}
                                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex-shrink-0 z-10">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-colors duration-300"
                                            style={{
                                                backgroundColor: isActive ? '#a3e635' : 'rgba(26,46,26,1)',
                                                borderColor: isActive ? '#a3e635' : 'rgba(255,255,255,0.1)',
                                                color: isActive ? '#0a1f0a' : '#6b7280',
                                                boxShadow: isActive ? '0 0 16px rgba(163,230,53,0.35)' : 'none',
                                                transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                                            }}
                                        >
                                            {icons[step.icon]}
                                        </div>
                                    </div>

                                    {/* Content card — alternate sides on desktop */}
                                    <div className={`flex-1 md:w-[45%] ${index % 2 === 0 ? 'md:mr-auto md:pr-20 md:text-right' : 'md:ml-auto md:pl-20'}`}>
                                        <div
                                            className="p-6 sm:p-8 rounded-2xl border"
                                            style={{
                                                backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                                                borderColor: isActive ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.06)',
                                                transition: 'background-color 0.3s ease, border-color 0.3s ease',
                                            }}
                                        >
                                            <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                                <span
                                                    className="text-4xl font-bold leading-none"
                                                    style={{ color: isActive ? '#a3e635' : 'rgba(255,255,255,0.1)', transition: 'color 0.3s ease' }}
                                                >
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <div
                                                    className="h-px flex-1"
                                                    style={{ backgroundColor: isActive ? 'rgba(163,230,53,0.25)' : 'rgba(255,255,255,0.05)', transition: 'background-color 0.3s ease' }}
                                                />
                                            </div>
                                            <h3
                                                className="text-xl sm:text-2xl font-bold mb-2"
                                                style={{ color: isActive ? '#ffffff' : '#6b7280', transition: 'color 0.3s ease' }}
                                            >
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
