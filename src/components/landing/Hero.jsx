import React from 'react';
import { heroData } from '../../data/data';
import { theme } from '../../theme';
import heroImage from '../../assets/investment-trust.png';

const Hero = () => {
    return (
        <section
            className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden"
            style={{ backgroundColor: theme.colors.dark }}
        >
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#28a828] blur-[100px] opacity-40"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#31f331] blur-[120px] opacity-30"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

                    {/* Text Content */}
                    <div className="flex flex-col space-y-8 max-w-2xl lg:pr-8">
                        {/* Announcement Badge */}
                        <div className="inline-flex">
                            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#a3e635] text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
                                Secure Investment Platform
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                            {heroData.headline}
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg">
                            {heroData.subheadline}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button
                                className="font-semibold text-base px-8 py-3.5 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(163,230,53,0.4)] text-[#0a1f0a]"
                                style={{ backgroundColor: theme.colors.primary }}
                            >
                                {heroData.ctaPrimary}
                            </button>
                            <button className="bg-white text-[#0a1f0a] font-semibold text-base px-8 py-3.5 rounded-full transition-transform hover:scale-105 hover:bg-gray-100">
                                {heroData.ctaSecondary}
                            </button>
                        </div>

                        <div className="pt-12 border-t border-white/10 mt-8">
                            <p className="text-gray-500 text-sm mb-6">{heroData.trustedText}</p>
                            <div className="flex flex-wrap gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Reuse placeholders or add new ones */}
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-white rounded-full"></div>
                                    <span className="text-white font-semibold">TrustCorp</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-white/80 rounded-sm"></div>
                                    <span className="text-white font-semibold">InvestSafe</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-white/80 transform rotate-45"></div>
                                    <span className="text-white font-semibold">SecureChain</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="relative hidden lg:block">
                        <div className="relative rounded-3xl overflow-hidden glass-card p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/5 backdrop-blur-sm">
                            <img
                                src={heroImage}
                                alt="Investment Growth and Trust"
                                className="rounded-2xl w-full h-auto object-cover shadow-2xl"
                            />
                            {/* Decorative floating elements */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#a3e635] blur-[80px] opacity-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
