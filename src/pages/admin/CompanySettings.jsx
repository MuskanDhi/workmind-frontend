import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Key, Copy, CheckCircle2 } from 'lucide-react';

const CompanySettings = () => {
  const { user, setUser } = useAuth();
  const [companyInfo, setCompanyInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    avatar: user?.avatar || '',
    isAnonymous: user?.isAnonymous || false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/api/auth/company-info').then(res => setCompanyInfo(res.data)).catch(console.error);
    }
  }, [user]);

  const handleCopy = () => {
    if (companyInfo) {
      navigator.clipboard.writeText(companyInfo.company.companyKey);
      setCopied(true);
      toast.success('Key copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyUpdate = async (e) => {
    e.preventDefault();
    if (newKey.length < 5) return toast.error('Key must be at least 5 characters');
    setLoading(true);
    try {
      const { data } = await api.put('/api/auth/company-key', { newKey });
      setCompanyInfo({ ...companyInfo, company: data.company });
      setNewKey('');
      toast.success('Company Key updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to update key');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/api/auth/update', profileForm);
      setUser(data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.put('/api/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {user?.role === 'admin' && companyInfo && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-navy mb-4 flex items-center"><Key className="w-5 h-5 mr-2 text-brand" /> Company Info</h3>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center relative">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{companyInfo.company.companyName} KEY</p>
            <div className="text-4xl font-mono font-bold text-brand mb-4 tracking-widest">
              {companyInfo.company.companyKey ? companyInfo.company.companyKey : "NOT SET YET"}
            </div>
            
            <button 
              onClick={handleCopy}
              disabled={!companyInfo.company.companyKey}
              className="inline-flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-teal" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Key'}</span>
            </button>
            <p className="text-xs text-gray-400 mt-4">{companyInfo.memberCount} total members joined</p>
          </div>
          
          <form onSubmit={handleKeyUpdate} className="mt-6 border-t border-gray-100 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Set a new Custom Company Key</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={newKey} 
                onChange={(e) => setNewKey(e.target.value)} 
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand/40" 
                placeholder="e.g. WORK-DEMO-2026" 
              />
              <button disabled={loading || !newKey} type="submit" className="bg-navy text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-navy/90 disabled:opacity-50">
                Update Key
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Setting a new key will instantly update it for all current employees.</p>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-navy mb-6">Your Profile</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" value={profileForm.department} onChange={e => setProfileForm({...profileForm, department: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand/40" />
            </div>
            
            {user?.role === 'employee' && (
              <div className="flex items-center pt-2">
                <input id="anon" type="checkbox" checked={profileForm.isAnonymous} onChange={e => setProfileForm({...profileForm, isAnonymous: e.target.checked})} className="h-4 w-4 text-brand rounded" />
                <label htmlFor="anon" className="ml-2 block text-sm text-gray-700">Hide my name in future surveys</label>
              </div>
            )}
            
            <button type="submit" disabled={loading} className="w-full bg-brand text-white py-2 rounded-xl font-semibold mt-4 hover:bg-brand/90 disabled:opacity-50">
              Save Profile
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-navy mb-6">Change Password</h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" required minLength={6} value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" required minLength={6} value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand/40" />
            </div>
            <button type="submit" disabled={loading} className="w-full border border-brand text-brand py-2 rounded-xl font-semibold mt-4 hover:bg-brand/5 disabled:opacity-50">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
