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

  return (
    <DashboardLayout activeItem="profile">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your identity and security</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl transition-all font-bold">
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'profile', label: 'Personal Info', icon: User },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'plans', label: 'Membership', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === tab.id ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-[#a3e635] flex items-center justify-center text-[#0a1f0a] text-3xl font-bold">
                          {formData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-[#0a1f0a] rounded-xl flex items-center justify-center border-4 border-[#0a1f0a] hover:scale-110 transition-all">
                          <Camera size={14} />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{formData.name}</h3>
                        <p className="text-gray-400 text-sm">Joined {formData.joinDate}</p>
                      </div>
                    </div>
                    <button onClick={handleSave} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all font-bold flex items-center gap-2">
                      {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#a3e635] transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#a3e635] transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#a3e635] transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#a3e635] transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                  <h3 className="text-xl font-bold text-white mb-8">Security Features</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#a3e635]/10 flex items-center justify-center">
                          <Shield size={24} className="text-[#a3e635]" />
                        </div>
                        <div>
                          <p className="font-bold text-white">Two-Factor Authentication</p>
                          <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSecuritySettings({ ...securitySettings, twoFactor: !securitySettings.twoFactor })}
                        className={`w-14 h-8 rounded-full relative transition-all ${securitySettings.twoFactor ? 'bg-[#a3e635]' : 'bg-gray-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${securitySettings.twoFactor ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#a3e635]/10 flex items-center justify-center">
                          <Edit2 size={24} className="text-[#a3e635]" />
                        </div>
                        <div>
                          <p className="font-bold text-white">Password Settings</p>
                          <p className="text-xs text-gray-500">Last changed: {securitySettings.lastPasswordChange}</p>
                        </div>
                      </div>
                      <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all font-bold">Update</button>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                  <h3 className="text-xl font-bold text-white mb-6">Active Sessions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="text-gray-400">
                          <X size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">iPhone 15 Pro • Lagos, NG</p>
                          <p className="text-xs text-gray-500">Active Now • Velto App</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#a3e635]">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white mb-8">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'deposits', label: 'Deposits', desc: 'When you add funds to your account' },
                    { id: 'withdrawals', label: 'Withdrawals', desc: 'When you take money out' },
                    { id: 'investments', label: 'Investment Alerts', desc: 'Growth updates and new opportunities' },
                    { id: 'security', label: 'Security Alerts', desc: 'Login notifications and setting changes' }
                  ].map(pref => (
                    <div key={pref.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div>
                        <p className="font-bold text-white">{pref.label}</p>
                        <p className="text-xs text-gray-500">{pref.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({ ...notificationSettings, [pref.id]: !notificationSettings[pref.id] })}
                        className={`w-14 h-8 rounded-full relative transition-all ${notificationSettings[pref.id] ? 'bg-[#a3e635]' : 'bg-gray-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notificationSettings[pref.id] ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
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
