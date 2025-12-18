import React, { useEffect, useRef, useState } from 'react';
import { howItWorksData } from '../../data/data';
import { theme } from '../../theme';

// Simple Icon placeholder component
const Icon = ({ name, className }) => {
    // In a real app, use Lucide or Heroicons. 
    // Map names to SVGs here for simplicity and zero deps.
    const icons = {
        UserPlus: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
        CreditCard: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
        TrendingUp: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        PieChart: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
        ),
    };
    return icons[name] || null;
};

const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(0);
    const stepsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.index);
                        // Only update if we're scrolling down naturally or it's clearly active
                        if (entry.intersectionRatio > 0.5) {
                            setActiveStep(index);
                        }
                    }
                });
            },
            {
                threshold: 0.5,
                rootMargin: "-20% 0px -20% 0px" // Trigger when element is near center
            }
        );

        stepsRef.current.forEach((step) => {
            if (step) observer.observe(step);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section
            className="relative py-32 sm:py-40 overflow-hidden"
            style={{ backgroundColor: theme.colors.dark }}
            id="how-it-works"
        >
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#a3e635] blur-[150px] opacity-10"></div>
            <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-30"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-24 scroll-mt-20">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-1.5 rounded-full border border-[#a3e635]/20 bg-[#a3e635]/5 text-[#a3e635] text-xs font-semibold tracking-wide uppercase">
                            Simple Process
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">How It Works</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">Start your journey to financial freedom in four simple steps.</p>
                </div>

                <div className="relative">
                    {/* Progress bar line container */}
                    <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/5 via-white/10 to-white/5 -ml-0.5 md:ml-0 md:-translate-x-1/2 rounded-full overflow-hidden">
                        {/* Dynamic progress fill */}
                        <div
                            className="w-full bg-gradient-to-b from-[#a3e635] to-[#84cc16] transition-all duration-700 ease-out shadow-[0_0_20px_rgba(163,230,53,0.5)]"
                            style={{ height: `${((activeStep + 1) / howItWorksData.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="space-y-16 md:space-y-32">
                        {howItWorksData.map((step, index) => {
                            const isActive = index <= activeStep;
                            const isCurrent = index === activeStep;

                            return (
                                <div
                                    key={step.id}
                                    data-index={index}
                                    ref={el => stepsRef.current[index] = el}
                                    className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center transition-all duration-700 ease-out 
                                ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-30 translate-y-16 scale-95'}`}
                                >
                                    {/* Icon / Number Bubble */}
                                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex-shrink-0 z-20 group">
                                        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 rotate-45
                                    ${isActive ? 'bg-gradient-to-br from-[#a3e635] to-[#84cc16] border-[#a3e635] shadow-[0_0_30px_rgba(163,230,53,0.6)] scale-110' : 'bg-[#1a2e1a] border-white/10 scale-100'}
                                `}>
                                            <div className="-rotate-45">
                                                <Icon name={step.icon} className={`w-7 h-7 ${isActive ? 'text-[#0a1f0a]' : 'text-gray-400'}`} />
                                            </div>

                                            {/* Hover Tip */}
                                            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] text-xs font-bold px-5 py-2.5 rounded-xl shadow-[0_0_30px_rgba(163,230,53,0.7)] transform group-hover:translate-y-0 translate-y-2">
                                                {step.tip}
                                                {/* Little triangular arrow */}
                                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#84cc16] rotate-45"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Side - Alternate left/right on desktop */}
                                    <div className={`flex-1 md:w-1/2 ${index % 2 === 0 ? 'md:pr-28 md:text-right' : 'md:pl-28 md:ml-auto'}`}>
                                        <div className={`relative p-10 rounded-3xl transition-all duration-500 border overflow-hidden group
                                     ${isActive ? 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md shadow-2xl border-white/10' : 'bg-white/[0.02] border-white/5'}
                                     hover:bg-white/[0.15] hover:border-[#a3e635]/20 hover:shadow-[0_0_40px_rgba(163,230,53,0.15)]
                                `}>
                                            {/* Decorative corner accent */}
                                            <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-20 h-20 bg-gradient-to-br from-[#a3e635]/20 to-transparent blur-2xl transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                                            
                                            <div className="relative">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className={`text-5xl font-bold transition-colors duration-500 ${isActive ? 'text-[#a3e635]' : 'text-gray-700'}`}>
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    <div className={`h-[2px] flex-1 transition-colors duration-500 ${isActive ? 'bg-[#a3e635]/30' : 'bg-white/5'}`}></div>
                                                </div>
                                                <h3 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-500'}`}>{step.title}</h3>
                                                <p className="text-gray-400 text-base md:text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
