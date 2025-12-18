import { useState } from 'react';
import { Menu, MessageSquare, ThumbsUp, Share2, TrendingUp, Users, Award, Send, Image, Smile } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const CommunityPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  const posts = [
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Top Investor',
      time: '2h ago',
      content: 'Just hit 25% ROI on my real estate portfolio! The key is diversification and patience. Started with small investments and gradually scaled up. Happy to answer questions!',
      likes: 124,
      comments: 18,
      shares: 7,
      trending: true
    },
    {
      id: 2,
      author: 'Michael Chen',
      avatar: 'MC',
      role: 'Investment Analyst',
      time: '4h ago',
      content: 'Market analysis: Tech sector showing strong growth potential this quarter. Looking at sustainable energy investments as well. What are your thoughts?',
      likes: 89,
      comments: 23,
      shares: 12
    },
    {
      id: 3,
      author: 'Aisha Okafor',
      avatar: 'AO',
      role: 'Community Member',
      time: '6h ago',
      content: 'New to investing and just made my first investment through Velto! The platform makes it so easy to understand. Excited for this journey! 🚀',
      likes: 156,
      comments: 31,
      shares: 5
    },
    {
      id: 4,
      author: 'David Martinez',
      avatar: 'DM',
      role: 'Portfolio Manager',
      time: '8h ago',
      content: 'Pro tip: Always review your portfolio quarterly. Made some adjustments today and feeling confident about Q2 performance. Consistency is key!',
      likes: 67,
      comments: 14,
      shares: 9
    }
  ];

  const trendingTopics = [
    { tag: 'RealEstate', posts: 234 },
    { tag: 'TechInvesting', posts: 189 },
    { tag: 'Sustainability', posts: 156 },
    { tag: 'PortfolioTips', posts: 143 }
  ];

  const topInvestors = [
    { name: 'Emma Wilson', roi: '32%', avatar: 'EW' },
    { name: 'James Brown', roi: '28%', avatar: 'JB' },
    { name: 'Lisa Anderson', roi: '25%', avatar: 'LA' }
  ];

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1f0a] via-[#0d2b0d] to-[#0a1f0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Community</h1>
                <p className="text-gray-400 text-sm mt-1">Connect with investors worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
              <button onClick={() => setActiveTab('feed')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'feed' ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400 hover:text-white'}`}>
                Feed
              </button>
              <button onClick={() => setActiveTab('trending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'trending' ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400 hover:text-white'}`}>
                Trending
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center text-[#0a1f0a] font-bold">
                    You
                  </div>
                  <div className="flex-1">
                    <textarea placeholder="Share your investment insights..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 resize-none" rows="3"></textarea>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#a3e635] hover:bg-white/5 rounded-lg transition-all">
                          <Image size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-[#a3e635] hover:bg-white/5 rounded-lg transition-all">
                          <Smile size={20} />
                        </button>
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-semibold rounded-lg hover:scale-105 transition-all flex items-center gap-2">
                        <Send size={16} />
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {posts.map((post) => (
                <div key={post.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#a3e635]/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a3e635]/20 to-[#84cc16]/20 flex items-center justify-center text-[#a3e635] font-bold border border-[#a3e635]/30">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-semibold">{post.author}</h3>
                            {post.trending && (
                              <span className="px-2 py-0.5 bg-[#a3e635]/20 text-[#a3e635] text-xs font-semibold rounded-full flex items-center gap-1">
                                <TrendingUp size={12} />
                                Trending
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{post.role} • {post.time}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">{post.content}</p>
                      <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-[#a3e635] transition-all group">
                          <ThumbsUp size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-[#a3e635] transition-all group">
                          <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-[#a3e635] transition-all group">
                          <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-[#a3e635]" size={20} />
                  <h3 className="text-white font-semibold">Trending Topics</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <button key={index} className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#a3e635]/30 transition-all group">
                      <span className="text-[#a3e635] font-medium">#{topic.tag}</span>
                      <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{topic.posts} posts</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-[#a3e635]" size={20} />
                  <h3 className="text-white font-semibold">Top Investors</h3>
                </div>
                <div className="space-y-3">
                  {topInvestors.map((investor, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a3e635]/20 to-[#84cc16]/20 flex items-center justify-center text-[#a3e635] font-bold border border-[#a3e635]/30 text-sm">
                        {investor.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{investor.name}</p>
                        <p className="text-gray-400 text-xs">ROI: {investor.roi}</p>
                      </div>
                      <span className="text-[#a3e635] font-bold">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#a3e635]/10 to-[#84cc16]/5 backdrop-blur-xl rounded-2xl p-6 border border-[#a3e635]/20">
                <Users className="text-[#a3e635] mb-3" size={24} />
                <h3 className="text-white font-semibold mb-2">Join the Discussion</h3>
                <p className="text-gray-400 text-sm mb-4">Connect with 10,000+ investors sharing insights daily</p>
                <button className="w-full py-2.5 bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-semibold rounded-lg hover:scale-105 transition-all">
                  Explore Groups
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityPage;
