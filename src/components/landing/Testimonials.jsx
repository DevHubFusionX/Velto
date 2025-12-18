import React from 'react';
import { testimonialsData, mediaLogos } from '../../data/data';
import { theme } from '../../theme';

// Star rating component
const StarRating = ({ rating }) => {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    className={`w-4 h-4 ${index < rating ? 'text-[#a3e635] fill-current' : 'text-gray-600'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

// Review card component
const ReviewCard = ({ review }) => {
    return (
        <div className="flex-shrink-0 min-w-[260px] xs:min-w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] mx-3 sm:mx-4 group">
            <div className="relative p-6 sm:p-7 md:p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-[#a3e635]/30 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(163,230,53,0.2)] h-full">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#a3e635]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative">
                    {/* Avatar and info */}
                    <div className="flex items-center gap-4 mb-6">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-[#0a1f0a] font-bold text-lg shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                            style={{ backgroundColor: review.color }}
                        >
                            {review.initials}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-lg group-hover:text-[#a3e635] transition-colors">
                                {review.name}
                            </h4>
                            <p className="text-sm text-gray-400">{review.role}</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                        <StarRating rating={review.rating} />
                    </div>

                    {/* Quote */}
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                        "{review.quote}"
                    </p>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a3e635] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    // Duplicate testimonials for infinite scroll effect
    const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

    return (
        <section
            className="relative py-32 sm:py-40 overflow-hidden"
            style={{ backgroundColor: theme.colors.dark }}
            id="testimonials"
        >
            {/* Decorative Background */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-[#a3e635] blur-[150px] opacity-5"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-30"></div>

            <div className="relative z-10">
                {/* Section Header */}
                <div className="text-center mb-14 md:mb-20 px-6">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-1.5 rounded-full border border-[#a3e635]/20 bg-[#a3e635]/5 text-[#a3e635] text-xs font-semibold tracking-wide uppercase">
                            Testimonials
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight">
                        Trusted by Thousands
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
                        See what our investors have to say about their experience.
                    </p>
                </div>

                {/* Scrolling Ticker */}
                <div className="relative mb-16 md:mb-20 px-4 sm:px-6">
                    {/* Gradient overlays for fade effect */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r from-[#0a1f0a] to-transparent z-10"></div>
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-[#0a1f0a] to-transparent z-10"></div>

                    {/* Scrolling container */}
                    <div className="overflow-hidden">
                        <div className="flex animate-scroll hover:pause-animation">
                            {duplicatedTestimonials.map((review, index) => (
                                <ReviewCard key={`${review.id}-${index}`} review={review} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Media Logos */}
                <div className="px-6">
                    <p className="text-center text-gray-500 text-sm mb-8 uppercase tracking-wider">
                        As Featured In
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {mediaLogos.map((logo) => (
                            <div
                                key={logo.id}
                                className={`${logo.width} h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/5 hover:border-[#a3e635]/30 transition-all hover:scale-110`}
                            >
                                <span className="text-white font-bold text-sm">{logo.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS for infinite scroll animation */}
            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                .pause-animation:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
