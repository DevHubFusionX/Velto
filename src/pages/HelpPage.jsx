import { useState } from 'react';
import { Menu, Search, MessageCircle, Book, Video, Mail, Phone, Clock, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const HelpPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { question: 'How do I start investing?', category: 'Getting Started', answer: 'Create an account, complete verification, and browse investment opportunities.' },
    { question: 'What are the minimum investment amounts?', category: 'Investments', answer: 'Minimum investments start from ₦50,000 depending on the product.' },
    { question: 'How do I withdraw my funds?', category: 'Withdrawals', answer: 'Navigate to your wallet and request a withdrawal to your linked bank account.' },
    { question: 'What are the fees?', category: 'Fees', answer: 'We charge a 2% management fee on returns. No hidden charges.' },
    { question: 'How secure is my investment?', category: 'Security', answer: 'All investments are insured and we use bank-level encryption.' },
    { question: 'Can I cancel an investment?', category: 'Investments', answer: 'Investments can be cancelled within 24 hours of purchase.' }
  ];

  const resources = [
    { icon: Book, title: 'Investment Guide', desc: 'Learn the basics of investing', color: 'from-blue-500/20 to-blue-600/10' },
    { icon: Video, title: 'Video Tutorials', desc: 'Watch step-by-step guides', color: 'from-purple-500/20 to-purple-600/10' },
    { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with support team', color: 'from-[#a3e635]/20 to-[#84cc16]/10' }
  ];

  const contactMethods = [
    { icon: Mail, label: 'Email', value: 'support@velto.com', action: 'Send Email' },
    { icon: Phone, label: 'Phone', value: '+234 800 123 4567', action: 'Call Now' },
    { icon: Clock, label: 'Hours', value: 'Mon-Fri, 9AM-6PM WAT', action: 'View Schedule' }
  ];

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1f0a] via-[#0d2b0d] to-[#0a1f0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Help & Support</h1>
              <p className="text-gray-400 text-sm mt-1">We're here to help you succeed</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {resources.map((resource, index) => (
              <button key={index} className={`bg-gradient-to-br ${resource.color} backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#a3e635]/30 transition-all text-left group`}>
                <resource.icon className="text-[#a3e635] mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-white font-semibold text-lg mb-1">{resource.title}</h3>
                <p className="text-gray-400 text-sm">{resource.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60"
                  />
                </div>

                <h2 className="text-white font-semibold text-xl mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <details key={index} className="bg-white/5 rounded-xl border border-white/10 hover:border-[#a3e635]/30 transition-all group">
                      <summary className="px-5 py-4 cursor-pointer flex items-center justify-between text-white font-medium group-hover:text-[#a3e635] transition-colors">
                        <span>{faq.question}</span>
                        <ChevronRight className="group-open:rotate-90 transition-transform" size={20} />
                      </summary>
                      <div className="px-5 pb-4 text-gray-400 text-sm border-t border-white/10 pt-4">
                        <span className="inline-block px-2 py-1 bg-[#a3e635]/20 text-[#a3e635] text-xs rounded-full mb-2">{faq.category}</span>
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <method.icon className="text-[#a3e635]" size={20} />
                        <span className="text-gray-400 text-sm">{method.label}</span>
                      </div>
                      <p className="text-white font-medium mb-3">{method.value}</p>
                      <button className="w-full py-2 bg-white/5 hover:bg-[#a3e635]/20 text-[#a3e635] rounded-lg text-sm font-medium transition-all">
                        {method.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#a3e635]/10 to-[#84cc16]/5 backdrop-blur-xl rounded-2xl p-6 border border-[#a3e635]/20">
                <MessageCircle className="text-[#a3e635] mb-3" size={28} />
                <h3 className="text-white font-semibold mb-2">Need Quick Help?</h3>
                <p className="text-gray-400 text-sm mb-4">Our support team is available to assist you</p>
                <button className="w-full py-3 bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-semibold rounded-lg hover:scale-105 transition-all">
                  Start Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;
