import React, { useState } from 'react';
import { faqData } from '../../data/data';
import { theme } from '../../theme';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section
            className="relative py-32 sm:py-40 overflow-hidden"
            style={{ backgroundColor: theme.colors.dark }}
            id="faq"
        >
            {/* Decorative Background */}
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-[#a3e635] blur-[150px] opacity-5"></div>
            <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-30"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-1.5 rounded-full border border-[#a3e635]/20 bg-[#a3e635]/5 text-[#a3e635] text-xs font-semibold tracking-wide uppercase">
                            FAQ
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Got Questions?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                        Find answers to the most common questions about our platform.
                    </p>
                </div>

                {/* Split Layout: Visual + FAQ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Decorative Visual */}
                    <div className="relative order-2 lg:order-1">
                        <div className="sticky top-32">
                            <div className="relative aspect-square rounded-3xl overflow-hidden">
                                {/* Animated gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#a3e635]/20 via-[#1a2e1a]/40 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-12">
                                    {/* Floating question marks */}
                                    <div className="absolute top-1/4 left-1/4 text-6xl text-[#a3e635] opacity-20 animate-float">?</div>
                                    <div className="absolute bottom-1/4 right-1/4 text-8xl text-[#84cc16] opacity-10 animate-float" style={{ animationDelay: '1s' }}>?</div>
                                    <div className="absolute top-1/2 right-1/3 text-4xl text-[#65a30d] opacity-15 animate-float" style={{ animationDelay: '2s' }}>?</div>

                                    {/* Center content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(163,230,53,0.6)]">
                                            <svg className="w-16 h-16 text-[#0a1f0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
                                        <p className="text-gray-400 mb-6">Our support team is here to help 24/7</p>
                                        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                                            Contact Support
                                        </button>
                                    </div>

                                    {/* Decorative circles */}
                                    <div className="absolute top-10 right-10 w-20 h-20 border-4 border-[#a3e635]/30 rounded-full"></div>
                                    <div className="absolute bottom-10 left-10 w-16 h-16 border-4 border-[#84cc16]/30 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: FAQ Accordion */}
                    <div className="space-y-4 order-1 lg:order-2">
                        {faqData.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={faq.id}
                                    className="group relative rounded-2xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 hover:border-[#a3e635]/30 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Question Button */}
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full text-left p-6 md:p-8 flex items-start justify-between gap-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-bold text-[#a3e635]">0{index + 1}</span>
                                                <div className="h-px flex-1 bg-gradient-to-r from-[#a3e635]/30 to-transparent"></div>
                                            </div>
                                            <h3 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-[#a3e635]' : 'text-white group-hover:text-[#a3e635]'
                                                }`}>
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#a3e635] rotate-180' : 'group-hover:bg-white/10'
                                            }`}>
                                            <svg
                                                className={`w-5 h-5 transition-colors ${isOpen ? 'text-[#0a1f0a]' : 'text-gray-400'}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    {/* Answer */}
                                    <div
                                        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="px-6 md:px-8 pb-6 md:pb-8">
                                            <p className="text-gray-400 leading-relaxed pl-8">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom accent */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a3e635] to-transparent transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'
                                        }`}></div>

                                    {/* Hover glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635] rounded-full blur-3xl opacity-10"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default FAQ;
