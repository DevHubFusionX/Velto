import React from 'react';
import { theme } from '../../theme';

const CTA = () => {
    return (
        <section
            className="relative py-32 sm:py-40 overflow-hidden"
            style={{ backgroundColor: theme.colors.dark }}
            id="cta"
        >
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#a3e635] blur-[150px] opacity-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#84cc16] blur-[150px] opacity-10 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="relative rounded-[3rem] overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#a3e635] via-[#84cc16] to-[#65a30d]"></div>

                    {/* Animated Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-white rounded-full animate-float"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 5}s`,
                                        animationDuration: `${5 + Math.random() * 5}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative px-6 py-10 sm:px-10 sm:py-14 md:p-20 text-center">
                        {/* Badge */}
                        <div className="inline-block mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-[#0a1f0a]/30 backdrop-blur-sm text-white text-xs font-semibold tracking-wide uppercase border border-white/20">
                                Limited Time Offer
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-[#0a1f0a] mb-6 tracking-tight leading-tight">
                            Start Growing Your
                            <br />
                            Wealth Today
                        </h2>

                        {/* Subheading */}
                        <p className="text-base sm:text-lg md:text-xl text-[#0a1f0a]/80 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                            Join thousands of investors who trust us with their financial future. Get started in under 2 minutes with as little as $10.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8">
                            <button className="group relative w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-4 rounded-full bg-[#0a1f0a] text-white font-semibold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(10,31,10,0.3)] overflow-hidden">
                                <span className="relative z-10">Open an Account</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e1a] to-[#0a1f0a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                            <button className="w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-4 rounded-full bg-white/20 backdrop-blur-sm text-[#0a1f0a] font-semibold text-base sm:text-lg hover:bg-white/30 transition-all duration-300 border-2 border-[#0a1f0a]/20 hover:border-[#0a1f0a]/40">
                                Schedule a Demo
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs sm:text-sm text-[#0a1f0a]/70">
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">No credit card required</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Cancel anytime</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">FDIC Insured</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
                    50% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default CTA;
