import React, { useState } from 'react';
import { theme } from '../theme';
import Sidebar from '../components/dashboard/Sidebar';

const ProductsPage = () => {
    const [currency, setCurrency] = useState('NGN');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = [
        {
            id: 1,
            name: 'Starter Plan',
            category: 'beginner',
            type: 'Entry Level Investment',
            minInvestment: { ngn: '₦5,000', usd: '$10' },
            returns: '8-12% annually',
            duration: '3-6 months',
            risk: 'Low',
            description: 'Perfect for beginners. Start your investment journey with a small amount and watch it grow.',
            features: ['Low entry barrier', 'Flexible withdrawal', 'No hidden fees', 'Easy to understand'],
            color: '#a3e635',
            popular: true
        },
        {
            id: 2,
            name: 'Growth Fund',
            category: 'high-yield',
            type: 'High Yield Investment',
            minInvestment: { ngn: '₦25,000', usd: '$50' },
            returns: '15-20% annually',
            duration: '6-12 months',
            risk: 'Medium',
            description: 'Invest in a diversified portfolio of high-growth opportunities. Perfect for investors seeking substantial returns with moderate risk.',
            features: ['Quarterly dividends', 'Flexible withdrawal', 'Professional management', 'Regular updates'],
            color: '#84cc16',
            popular: true
        },
        {
            id: 3,
            name: 'Stable Income',
            category: 'fixed-income',
            type: 'Fixed Returns Plan',
            minInvestment: { ngn: '₦50,000', usd: '$100' },
            returns: '10-12% annually',
            duration: '3-6 months',
            risk: 'Low',
            description: 'A conservative investment option with guaranteed returns. Ideal for risk-averse investors looking for steady income.',
            features: ['Guaranteed returns', 'Capital protection', 'Monthly interest', 'Early exit option'],
            color: '#65a30d',
            popular: false
        },
        {
            id: 4,
            name: 'Premium Portfolio',
            category: 'diversified',
            type: 'Diversified Investment',
            minInvestment: { ngn: '₦100,000', usd: '$200' },
            returns: '20-25% annually',
            duration: '12-24 months',
            risk: 'Medium-High',
            description: 'Our flagship product combining multiple asset classes for maximum returns. Designed for experienced investors.',
            features: ['Multi-asset allocation', 'Dedicated advisor', 'Priority support', 'Exclusive opportunities'],
            color: '#4d7c0f',
            popular: true
        },
        {
            id: 5,
            name: 'Retirement Builder',
            category: 'long-term',
            type: 'Long-Term Growth',
            minInvestment: { ngn: '₦150,000', usd: '$300' },
            returns: '18-22% annually',
            duration: '24-60 months',
            risk: 'Medium',
            description: 'Build your retirement fund with consistent long-term growth. Compound your wealth over time.',
            features: ['Compound interest', 'Tax benefits', 'Flexible contributions', 'Retirement planning'],
            color: '#a3e635',
            popular: false
        },
        {
            id: 6,
            name: 'Wealth Maximizer',
            category: 'high-yield',
            type: 'Aggressive Growth',
            minInvestment: { ngn: '₦500,000', usd: '$1,000' },
            returns: '25-30% annually',
            duration: '12-36 months',
            risk: 'High',
            description: 'Maximum returns for high-net-worth investors. Aggressive strategy with premium opportunities.',
            features: ['Highest returns', 'VIP treatment', 'Custom strategies', 'Direct communication'],
            color: '#84cc16',
            popular: false
        },
    ];

    const categories = [
        { id: 'all', name: 'All Products' },
        { id: 'beginner', name: 'Beginner' },
        { id: 'high-yield', name: 'High Yield' },
        { id: 'fixed-income', name: 'Fixed Income' },
        { id: 'diversified', name: 'Diversified' },
        { id: 'long-term', name: 'Long Term' },
    ];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="min-h-screen flex relative" style={{ backgroundColor: theme.colors.dark }}>
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#a3e635] blur-[150px] opacity-5"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-20"></div>
            </div>

            <Sidebar activeItem="opportunities" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto relative z-10 lg:ml-72">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#a3e635]/50 transition-all"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">Investment Products</h1>
                                <p className="text-sm text-gray-400">Choose the perfect plan for your goals</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                                <button
                                    onClick={() => setCurrency('NGN')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currency === 'NGN' ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400'
                                        }`}
                                >
                                    NGN
                                </button>
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currency === 'USD' ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400'
                                        }`}
                                >
                                    USD
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-8">
                        <div className="flex gap-3 overflow-x-auto pb-4">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === category.id
                                        ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="group relative p-6 rounded-3xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                {/* Popular Badge */}
                                {product.popular && (
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#a3e635] text-[#0a1f0a] text-xs font-bold">
                                        Popular
                                    </div>
                                )}

                                {/* Hover Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: product.color }}></div>

                                <div className="relative">
                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${product.color}20` }}>
                                        <svg className="w-8 h-8" style={{ color: product.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                                    <p className="text-xs text-gray-400 mb-4">{product.type}</p>

                                    {/* Key Info */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Returns</span>
                                            <span className="text-sm font-bold" style={{ color: product.color }}>{product.returns}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Min. Investment</span>
                                            <span className="text-sm font-semibold text-white">
                                                {currency === 'NGN' ? product.minInvestment.ngn : product.minInvestment.usd}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Risk</span>
                                            <span className="text-sm font-semibold text-white">{product.risk}</span>
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <button className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 border" style={{ backgroundColor: `${product.color}20`, color: product.color, borderColor: `${product.color}40` }}>
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Product Details Modal */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-3xl backdrop-blur-xl border"
                        style={{ background: 'linear-gradient(135deg, rgba(10, 31, 10, 0.95), rgba(26, 46, 26, 0.95))', borderColor: 'rgba(163, 230, 53, 0.3)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Product Header */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${selectedProduct.color}20` }}>
                                <svg className="w-10 h-10" style={{ color: selectedProduct.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                                <p className="text-gray-400">{selectedProduct.type}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 leading-relaxed mb-6">{selectedProduct.description}</p>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-sm text-gray-400 mb-1">Expected Returns</div>
                                <div className="text-xl font-bold" style={{ color: selectedProduct.color }}>{selectedProduct.returns}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-sm text-gray-400 mb-1">Duration</div>
                                <div className="text-xl font-bold text-white">{selectedProduct.duration}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-sm text-gray-400 mb-1">Min. Investment</div>
                                <div className="text-xl font-bold text-white">
                                    {currency === 'NGN' ? selectedProduct.minInvestment.ngn : selectedProduct.minInvestment.usd}
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                                <div className="text-xl font-bold text-white">{selectedProduct.risk}</div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white mb-4">Key Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {selectedProduct.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                        <svg className="w-5 h-5 flex-shrink-0" style={{ color: selectedProduct.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4">
                            <button
                                className="flex-1 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_0_30px_rgba(163,230,53,0.3)]"
                                style={{ backgroundColor: selectedProduct.color, color: theme.colors.dark }}
                            >
                                Start Investing
                            </button>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="px-6 py-4 rounded-xl font-semibold transition-all hover:bg-white/10 border border-white/20 text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
