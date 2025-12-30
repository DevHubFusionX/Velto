import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Shield, Bell, CreditCard, LogOut, Edit2, Save, Award, X } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context';
import { userService } from '../services';
import { theme } from '../theme';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    joinDate: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    biometric: false,
    lastPasswordChange: '2 months ago'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    deposits: true,
    withdrawals: true,
    investments: true,
    marketing: false,
    security: true
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setFormData({
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '+234 812 345 6789',
        location: data.location || 'Lagos, Nigeria',
        joinDate: data.joinDate || 'January 2024'
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
        <div className="w-12 h-12 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: User, shortLabel: 'Profile' },
    { id: 'security', label: 'Security', icon: Shield, shortLabel: 'Security' },
    { id: 'notifications', label: 'Notifications', icon: Bell, shortLabel: 'Alerts' },
    { id: 'plans', label: 'Membership', icon: Award, shortLabel: 'Plans' }
  ];

  return (
    <DashboardLayout activeItem="profile">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-sm sm:text-base text-gray-400">Manage your identity and security</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl sm:rounded-2xl transition-all font-bold text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            {/* Mobile: Horizontal scrollable tabs */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-bold text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                    : 'text-gray-400 bg-white/5 border border-white/10'
                    }`}
                >
                  <tab.icon size={18} />
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Desktop: Vertical tabs */}
            <div className="hidden lg:flex lg:flex-col space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === tab.id
                    ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-[#a3e635] flex items-center justify-center text-[#0a1f0a] text-2xl sm:text-3xl font-bold">
                          {formData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white text-[#0a1f0a] rounded-lg sm:rounded-xl flex items-center justify-center border-2 sm:border-4 border-[#0a1f0a] hover:scale-110 transition-all">
                          <Camera size={14} />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">{formData.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">Joined {formData.joinDate}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSave}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white hover:bg-white/10 transition-all font-bold flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:border-[#a3e635] transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:border-[#a3e635] transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:border-[#a3e635] transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:border-[#a3e635] transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-6 sm:mb-8">Security Features</h3>
                  <div className="space-y-4 sm:space-y-6">
                    {/* Two-Factor Auth */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#a3e635]/10 flex items-center justify-center flex-shrink-0">
                          <Shield size={20} className="text-[#a3e635] sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm sm:text-base">Two-Factor Authentication</p>
                          <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSecuritySettings({ ...securitySettings, twoFactor: !securitySettings.twoFactor })}
                        className={`w-14 h-8 rounded-full relative transition-all flex-shrink-0 ${securitySettings.twoFactor ? 'bg-[#a3e635]' : 'bg-gray-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${securitySettings.twoFactor ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>

                    {/* Password Settings */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#a3e635]/10 flex items-center justify-center flex-shrink-0">
                          <Edit2 size={20} className="text-[#a3e635] sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm sm:text-base">Password Settings</p>
                          <p className="text-xs text-gray-500 mt-0.5">Last changed: {securitySettings.lastPasswordChange}</p>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white hover:bg-white/10 transition-all font-bold text-sm sm:text-base">Update</button>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Active Sessions</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="text-gray-400 flex-shrink-0">
                          <X size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">iPhone 15 Pro • Lagos, NG</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Active Now • Velto App</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#a3e635] flex-shrink-0">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-6 sm:mb-8">Notification Preferences</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { id: 'deposits', label: 'Deposits', desc: 'When you add funds to your account' },
                    { id: 'withdrawals', label: 'Withdrawals', desc: 'When you take money out' },
                    { id: 'investments', label: 'Investment Alerts', desc: 'Growth updates and new opportunities' },
                    { id: 'security', label: 'Security Alerts', desc: 'Login notifications and setting changes' }
                  ].map(pref => (
                    <div key={pref.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm sm:text-base">{pref.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({ ...notificationSettings, [pref.id]: !notificationSettings[pref.id] })}
                        className={`w-14 h-8 rounded-full relative transition-all flex-shrink-0 ${notificationSettings[pref.id] ? 'bg-[#a3e635]' : 'bg-gray-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notificationSettings[pref.id] ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Membership Tab */}
            {activeTab === 'plans' && (
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Membership Plan</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#a3e635]/10 to-transparent border border-[#a3e635]/20">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#a3e635] flex items-center justify-center flex-shrink-0">
                      <Award size={24} className="text-[#0a1f0a] sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-base sm:text-lg">Standard Member</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Full access to all investment features</p>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto px-4 py-2 bg-[#a3e635]/20 border border-[#a3e635]/30 rounded-lg text-[#a3e635] text-xs sm:text-sm font-bold text-center">
                    Active
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
