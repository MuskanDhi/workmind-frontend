import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Key, ArrowRight, Brain } from 'lucide-react';

/**
 * Mandatory one-time page for new admins to create their company key.
 * Admin cannot access any other page until this is done.
 */
const SetupKey = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = useState(location.state?.prefilledKey || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (key.length < 5) return toast.error('Key must be at least 5 characters');

    setLoading(true);
    try {
      const { data } = await api.put('/api/auth/company-key', { newKey: key });
      // Refresh user in context so companyKey is populated
      const meRes = await api.get('/api/auth/me');
      setUser(meRes.data.user);
      toast.success(`Company Key "${key}" is set! Share it with your team.`);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to set key');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Brain className="w-12 h-12 text-brandLight mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">One Last Step!</h1>
          <p className="text-gray-300 text-sm">
            Create a <strong className="text-brandLight">Company Key</strong> to connect your team.<br />
            You'll share this key with employees so they can join your company.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6 p-4 bg-brandLight/20 rounded-xl border border-brand/30">
            <Key className="w-5 h-5 text-brand shrink-0" />
            <p className="text-sm text-navy font-medium">
              This key is <span className="font-bold text-brand">unique to your company</span>. 
              Employees will use it to register and log in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Company Key
              </label>
              <input
                type="text"
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g.  MYCOMPANY-2026"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-mono font-bold tracking-widest text-center text-brand focus:outline-none focus:border-brand transition-colors"
                minLength={5}
                maxLength={20}
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                5–20 characters. Letters and numbers only. Example: <span className="font-mono font-bold">TECHCORP-01</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || key.length < 5}
              className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-brand text-white rounded-xl font-bold text-base hover:bg-brand/90 disabled:opacity-50 transition-colors"
            >
              <span>{loading ? 'Setting up...' : 'Create Key & Go to Dashboard'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Logged in as <span className="font-semibold text-navy">{user?.name}</span> · {user?.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupKey;
