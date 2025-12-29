import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCurrency, useSearch } from '../context';
import { userService } from '../services';
import { formatCurrency } from '../utils';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Wallet, ExternalLink, Download, X } from 'lucide-react';
import PropTypes from 'prop-types';

const TransactionsPage = () => {
    const { currency } = useCurrency();
    const { searchQuery, setSearchQuery } = useSearch();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 });
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchTransactions();
    }, [page, filter, debouncedSearch]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await userService.getTransactions({
                page,
                limit: pagination.limit,
                type: filter,
                search: debouncedSearch
            });

            if (response.success) {
                setTransactions(response.data || []);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-[#a3e635]/20 text-[#a3e635]';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'failed':
            case 'rejected': return 'bg-red-500/20 text-red-400';
            default: return 'bg-white/10 text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
                <div className="w-12 h-12 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin"></div>
            </div>
        );
    }

    return (
        <DashboardLayout activeItem="dashboard">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
                        <p className="text-gray-400 text-sm">View and manage your transaction history</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                        <Download size={18} />
                        Export Data
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'Deposit', 'Investment', 'Withdrawal'].map((f) => (
                            <button
                                key={f}
                                onClick={() => {
                                    setFilter(f);
                                    setPage(1);
                                }}
                                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === f
                                    ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.2)]'
                                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#a3e635] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search reference or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full lg:w-80 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-10 text-white focus:outline-none focus:border-[#a3e635]/50 transition-all placeholder-gray-600"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Desktop Transactions Table */}
                <div className="hidden md:block rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-md">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, index) => (
                                <tr key={tx.id || tx._id || index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'Deposit' ? 'bg-[#a3e635]/10 text-[#a3e635]' :
                                                tx.type === 'Investment' ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-red-500/10 text-red-400'
                                                }`}>
                                                {tx.type === 'Deposit' ? <ArrowDownLeft size={20} /> :
                                                    tx.type === 'Investment' ? <Wallet size={20} /> :
                                                        <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white mb-0.5">{tx.type}</div>
                                                <div className="text-xs text-gray-500">{tx.product || tx.method || tx.bank}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-400 font-medium">{tx.date}</td>
                                    <td className={`px-6 py-5 text-sm font-bold ${tx.amount > 0 ? 'text-[#a3e635]' : 'text-white'}`}>
                                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount, currency)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="text-gray-500 hover:text-[#a3e635] transition-colors flex items-center gap-1 ml-auto text-xs font-mono">
                                            {tx.reference}
                                            <ExternalLink size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-4">
                    {transactions.map((tx, index) => (
                        <div key={tx.id || tx._id || index} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'Deposit' ? 'bg-[#a3e635]/10 text-[#a3e635]' :
                                        tx.type === 'Investment' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                        {tx.type === 'Deposit' ? <ArrowDownLeft size={18} /> :
                                            tx.type === 'Investment' ? <Wallet size={18} /> :
                                                <ArrowUpRight size={18} />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{tx.type}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{tx.date}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold text-sm ${tx.amount > 0 ? 'text-[#a3e635]' : 'text-white'}`}>
                                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount, currency)}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(tx.status)} px-2 py-0.5 rounded-full`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] text-gray-600 font-mono tracking-tight">{tx.reference}</span>
                                <span className="text-[10px] text-gray-500">{tx.product || tx.method || tx.bank}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {pagination.pages > 1 && (
                    <div className="mt-8 flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="text-sm text-gray-500">
                            Showing <span className="text-white font-bold">{(page - 1) * pagination.limit + 1}</span> to <span className="text-white font-bold">{Math.min(page * pagination.limit, pagination.total)}</span> of <span className="text-white font-bold">{pagination.total}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold disabled:opacity-30 hover:bg-white/10 transition-all"
                            >
                                Previous
                            </button>
                            <div className="flex gap-1">
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-[#a3e635] text-[#0a1f0a]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold disabled:opacity-30 hover:bg-white/10 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {transactions.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Filter className="text-gray-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto">Try adjusting your filters or search term to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TransactionsPage;
