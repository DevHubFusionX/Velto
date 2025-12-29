import { useState, useEffect } from 'react';
import { Search, MessageCircle, Book, Video, Mail, Phone, Clock, ChevronRight, X } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { userService } from '../services';
import { theme } from '../theme';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchHelpData();
  }, []);

  const fetchHelpData = async () => {
    try {
      setLoading(true);
      const data = await userService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch help data:', error);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { question: 'How do I start investing?', category: 'Getting Started', answer: 'Create an account, complete verification, and browse investment opportunities.' },
    { question: 'What are the minimum investment amounts?', category: 'Investments', answer: 'Minimum investments start from ₦50,000 depending on the product.' },
    { question: 'How do I withdraw my funds?', category: 'Withdrawals', answer: 'Navigate to your wallet and request a withdrawal to your linked bank account.' },
    { question: 'What are the fees?', category: 'Fees', answer: 'We charge a 2% management fee on returns. No hidden charges.' },
    { question: 'How secure is my investment?', category: 'Security', answer: 'All investments are insured and we use bank-level encryption.' },
    { question: 'Can I cancel an investment?', category: 'Investments', answer: 'Investments can be cancelled within 24 hours of purchase.' }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
        <div className="w-12 h-12 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout activeItem="help">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Help & Support</h1>
            <p className="text-gray-400">Everything you need to manage your investments</p>
          </div>
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="px-6 py-3 bg-[#a3e635] text-[#0a1f0a] rounded-2xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] flex items-center gap-2"
          >
            <MessageCircle size={18} />
            New Support Ticket
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-fit mb-8">
          {[
            { id: 'faq', label: 'Knowledge Base', icon: Book },
            { id: 'tickets', label: 'Support Tickets', icon: Mail }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400 hover:text-white'}`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === 'tickets' && dashboardData?.supportTickets?.length > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-white/10 text-white rounded-full text-[10px]">
                  {dashboardData.supportTickets.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'faq' ? (
              <div className="p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                <div className="relative mb-8">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Describe your issue or ask a question..."
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#a3e635] transition-all"
                  />
                </div>

                <div className="space-y-4">
                  {filteredFaqs.map((faq, i) => (
                    <details key={i} className="group border border-white/5 rounded-2xl overflow-hidden">
                      <summary className="flex items-center justify-between p-5 cursor-pointer bg-white/5 hover:bg-white/10 transition-all font-bold text-white">
                        <span>{faq.question}</span>
                        <ChevronRight className="group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="p-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 bg-black/20">
                        <span className="px-3 py-1 bg-[#a3e635]/10 text-[#a3e635] text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">{faq.category}</span>
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.supportTickets?.map((ticket, i) => (
                  <div key={i} className="p-6 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5 hover:border-[#a3e635]/30 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded-lg uppercase tracking-widest">{ticket.id}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ticket.category}</span>
                      </div>
                      <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${ticket.status === 'Open' ? 'bg-[#a3e635]/20 text-[#a3e635]' : 'bg-white/5 text-gray-500'}`}>
                        {ticket.status}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#a3e635] transition-all">{ticket.subject}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Last updated {ticket.lastUpdate}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <MessageCircle size={14} className="text-[#a3e635]" />
                        {ticket.messages} Messages
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white mb-6">Contact Support</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email Support', val: 'support@velto.com' },
                  { icon: Phone, label: 'Call Center', val: '+234 800 123 4500' },
                  { icon: Clock, label: 'Available', val: '24/7 Priority Access' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#a3e635]">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm font-bold text-white">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl backdrop-blur-md border border-[#a3e635]/20 bg-[#a3e635]/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <MessageCircle className="text-[#a3e635] mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm mb-6">Average response time: 2 minutes</p>
              <button className="w-full py-4 bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-bold rounded-2xl hover:scale-105 transition-all">
                Connect Now
              </button>
            </div>
          </div>
        </div>

        {/* New Ticket Modal */}
        {showNewTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <div className="w-full max-w-lg bg-[#0a1f0a] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(163,230,53,0.1)] relative">
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Create Support Ticket</h2>
              <p className="text-gray-400 text-sm mb-8">We'll get back to you as soon as possible</p>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Category</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#a3e635] transition-all appearance-none cursor-pointer">
                    <option className="bg-[#0a1f0a]">General Inquiry</option>
                    <option className="bg-[#0a1f0a]">Deposit/Withdrawal</option>
                    <option className="bg-[#0a1f0a]">Technical Issue</option>
                    <option className="bg-[#0a1f0a]">Investment Question</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Subject</label>
                  <input
                    type="text"
                    placeholder="Brief summary of your issue"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#a3e635] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Description</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us more about your problem..."
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#a3e635] transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowNewTicketModal(false);
                      // Add toast logic here
                    }}
                    className="flex-1 py-4 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                  >
                    Submit Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;
