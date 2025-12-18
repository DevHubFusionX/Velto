import { useState } from 'react';
import { Menu, User, Mail, Phone, MapPin, Calendar, Camera, Shield, Bell, CreditCard, LogOut, Edit2, Save } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const ProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Naya Johnson',
    email: 'naya.johnson@email.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    joinDate: 'January 2024'
  });

  const stats = [
    { label: 'Total Invested', value: '₦2.4M', change: '+12%' },
    { label: 'Active Investments', value: '24', change: '+3' },
    { label: 'Total Returns', value: '₦456K', change: '+18%' },
    { label: 'Member Since', value: '2024', change: '1 year' }
  ];

  const settings = [
    { icon: Bell, label: 'Notifications', desc: 'Manage notification preferences' },
    { icon: Shield, label: 'Security', desc: 'Password and 2FA settings' },
    { icon: CreditCard, label: 'Payment Methods', desc: 'Manage payment options' }
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
              <h1 className="text-3xl font-bold text-white">Profile</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your account settings</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center text-[#0a1f0a] text-4xl font-bold">
                      NJ
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#a3e635] rounded-full flex items-center justify-center hover:scale-110 transition-all">
                      <Camera size={18} className="text-[#0a1f0a]" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{formData.name}</h2>
                  <p className="text-gray-400 text-sm mb-4">Premium Investor</p>
                  <div className="w-full pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Mail size={16} />
                      <span className="text-sm">{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Phone size={16} />
                      <span className="text-sm">{formData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <MapPin size={16} />
                      <span className="text-sm">{formData.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar size={16} />
                      <span className="text-sm">Joined {formData.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {settings.map((setting, index) => (
                    <button key={index} className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#a3e635]/30 transition-all text-left group">
                      <setting.icon className="text-[#a3e635] group-hover:scale-110 transition-transform" size={20} />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{setting.label}</p>
                        <p className="text-gray-400 text-xs">{setting.desc}</p>
                      </div>
                    </button>
                  ))}
                  <button className="w-full flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all text-left group">
                    <LogOut className="text-red-400 group-hover:scale-110 transition-transform" size={20} />
                    <div className="flex-1">
                      <p className="text-red-400 text-sm font-medium">Logout</p>
                      <p className="text-gray-400 text-xs">Sign out of your account</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                    <p className="text-white text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-[#a3e635] text-xs font-semibold">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-xl">Personal Information</h3>
                  <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-4 py-2 bg-[#a3e635]/20 hover:bg-[#a3e635]/30 text-[#a3e635] rounded-lg transition-all">
                    {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold text-xl mb-4">Investment Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-medium">Risk Tolerance</p>
                      <p className="text-gray-400 text-sm">Moderate</p>
                    </div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#a3e635] rounded-lg text-sm transition-all">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-medium">Investment Goal</p>
                      <p className="text-gray-400 text-sm">Long-term Growth</p>
                    </div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#a3e635] rounded-lg text-sm transition-all">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-medium">Auto-Invest</p>
                      <p className="text-gray-400 text-sm">Enabled</p>
                    </div>
                    <button className="px-4 py-2 bg-[#a3e635]/20 text-[#a3e635] rounded-lg text-sm font-medium">Active</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
