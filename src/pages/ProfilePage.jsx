import { useState, useEffect } from 'react';
import { User, Camera, Shield, Bell, LogOut, Edit2, Save, Award, X, Eye, EyeOff, KeyRound } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth, useToast } from '../context';
import { userService } from '../services';
import { theme } from '../theme';
import api from '../services/api';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '', joinDate: '' });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [pwSaving, setPwSaving] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        deposits: true, withdrawals: true, investments: true, security: true
    });

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getProfile();
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                location: data.location || '',
                joinDate: data.joinDate || ''
            });
        } catch {
            addToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!isEditing) { setIsEditing(true); return; }
        try {
            setSaving(true);
            await userService.updateProfile({ name: formData.name, phone: formData.phone, location: formData.location });
            addToast('Profile updated successfully', 'success');
            setIsEditing(false);
        } catch {
            addToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
            return addToast('All fields are required', 'error');
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return addToast('New passwords do not match', 'error');
        }
        if (passwordForm.newPassword.length < 8) {
            return addToast('Password must be at least 8 characters', 'error');
        }
        try {
            setPwSaving(true);
            await api.put('/user/profile', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
            addToast('Password changed successfully', 'success');
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to change password', 'error');
        } finally {
            setPwSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
            <div className="w-12 h-12 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin"></div>
        </div>
    );

    const tabs = [
        { id: 'profile', label: 'Personal Info', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'plans', label: 'Membership', icon: Award }
    ];

    return (
        <DashboardLayout activeItem="profile">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Account Settings</h1>
                        <p className="text-sm sm:text-base text-gray-400">Manage your identity and security</p>
                    </div>
                    <button onClick={logout}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl sm:rounded-2xl transition-all font-bold text-sm w-full sm:w-auto justify-center">
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* Tabs */}
                    <div className="lg:col-span-1">
                        <div className="lg:hidden grid grid-cols-2 gap-2 mb-6">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-center gap-2 px-3 py-4 rounded-2xl transition-all font-bold text-sm border ${activeTab === tab.id ? 'bg-[#a3e635] text-[#0a1f0a] border-[#a3e635]' : 'text-gray-400 bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                    <tab.icon size={18} /><span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="hidden lg:flex lg:flex-col space-y-2">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === tab.id ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                                    <tab.icon size={20} />{tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center text-[#0a1f0a] text-3xl sm:text-4xl font-bold shadow-[0_10px_30px_rgba(163,230,53,0.3)]">
                                                {formData.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                            </div>
                                            <button className="absolute -bottom-1 -right-1 w-9 h-9 bg-white text-[#0a1f0a] rounded-xl flex items-center justify-center border-[4px] border-[#101910] hover:scale-110 transition-all shadow-lg">
                                                <Camera size={16} />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{formData.name}</h3>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]"></span>
                                                Joined {formData.joinDate}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={handleSave} disabled={saving}
                                        className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isEditing ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_25px_rgba(163,230,53,0.4)] hover:scale-105' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'} disabled:opacity-50`}>
                                        {saving ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                                        {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                    {[
                                        { label: 'Full Name', key: 'name', type: 'text' },
                                        { label: 'Email Address', key: 'email', type: 'email', disabled: true },
                                        { label: 'Phone Number', key: 'phone', type: 'text' },
                                        { label: 'Location', key: 'location', type: 'text' }
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">{field.label}</label>
                                            <input type={field.type} value={formData[field.key]}
                                                disabled={!isEditing || field.disabled}
                                                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#a3e635] transition-all outline-none disabled:opacity-50" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Security Features</h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#a3e635]/10 flex items-center justify-center">
                                                    <KeyRound size={20} className="text-[#a3e635]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">Change Password</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Update your account password</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setShowPasswordModal(true)}
                                                className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all font-bold text-sm">
                                                Update
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#a3e635]/10 flex items-center justify-center">
                                                    <Shield size={20} className="text-[#a3e635]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">Two-Factor Authentication</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 px-3 py-1 bg-white/5 rounded-lg">Coming Soon</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Notification Preferences</h3>
                                <p className="text-xs text-gray-500 mb-6">These preferences are saved locally on this device.</p>
                                <div className="space-y-3 sm:space-y-4">
                                    {[
                                        { id: 'deposits', label: 'Deposits', desc: 'When you add funds to your account' },
                                        { id: 'withdrawals', label: 'Withdrawals', desc: 'When you take money out' },
                                        { id: 'investments', label: 'Investment Alerts', desc: 'Growth updates and new opportunities' },
                                        { id: 'security', label: 'Security Alerts', desc: 'Login notifications and setting changes' }
                                    ].map(pref => (
                                        <div key={pref.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
                                            <div>
                                                <p className="font-bold text-white text-sm sm:text-base">{pref.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
                                            </div>
                                            <button onClick={() => setNotificationSettings(s => ({ ...s, [pref.id]: !s[pref.id] }))}
                                                className={`w-14 h-8 rounded-full relative transition-all flex-shrink-0 ${notificationSettings[pref.id] ? 'bg-[#a3e635]' : 'bg-gray-700'}`}>
                                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notificationSettings[pref.id] ? 'right-1' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Membership Tab */}
                        {activeTab === 'plans' && (
                            <div className="p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-md border border-white/10 bg-white/5">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Membership Plan</h3>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#a3e635]/10 to-transparent border border-[#a3e635]/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#a3e635] flex items-center justify-center">
                                            <Award size={24} className="text-[#0a1f0a]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">Standard Member</p>
                                            <p className="text-sm text-gray-400 mt-0.5">Full access to all investment features</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-[#a3e635]/20 border border-[#a3e635]/30 rounded-lg text-[#a3e635] text-sm font-bold">
                                        Active
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0f1f0f] border border-white/10 rounded-3xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Current Password', key: 'currentPassword', show: showPw.current, toggle: () => setShowPw(s => ({ ...s, current: !s.current })) },
                                { label: 'New Password', key: 'newPassword', show: showPw.new, toggle: () => setShowPw(s => ({ ...s, new: !s.new })) },
                                { label: 'Confirm New Password', key: 'confirmPassword', show: showPw.confirm, toggle: () => setShowPw(s => ({ ...s, confirm: !s.confirm })) }
                            ].map(field => (
                                <div key={field.key}>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">{field.label}</label>
                                    <div className="relative">
                                        <input type={field.show ? 'text' : 'password'}
                                            value={passwordForm[field.key]}
                                            onChange={e => setPasswordForm(f => ({ ...f, [field.key]: e.target.value }))}
                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#a3e635] outline-none transition-colors pr-12" />
                                        <button type="button" onClick={field.toggle}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                            {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowPasswordModal(false)}
                                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:bg-white/10 transition-all">
                                Cancel
                            </button>
                            <button onClick={handlePasswordChange} disabled={pwSaving}
                                className="flex-1 py-4 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-black uppercase tracking-wider hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {pwSaving ? <div className="w-5 h-5 border-2 border-[#0a1f0a] border-t-transparent rounded-full animate-spin" /> : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ProfilePage;
