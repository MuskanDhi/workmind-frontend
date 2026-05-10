import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

// Floating orb background component
const Orbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div style={{
      position:'absolute', width:500, height:500, borderRadius:'50%',
      background:'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
      top:-120, left:-100, animation:'floatA 12s ease-in-out infinite'
    }}/>
    <div style={{
      position:'absolute', width:380, height:380, borderRadius:'50%',
      background:'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
      bottom:-80, right:-60, animation:'floatB 15s ease-in-out infinite'
    }}/>
    <div style={{
      position:'absolute', width:220, height:220, borderRadius:'50%',
      background:'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
      top:'40%', right:'15%', animation:'floatC 10s ease-in-out infinite'
    }}/>
  </div>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-200 bg-gray-50/60 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 focus:bg-white transition-all duration-200"
    />
  </div>
);

const RegisterEmployee = ({ role = "employee" }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', inviteCode: '', department: ''
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = '/api/auth/join-company';
      await api.post(endpoint, {
        ...formData,
        role: role
      });
      toast.success('Registration successful!');
      
      const user = await login(formData.email, formData.password);
      if (user) {
        navigate(user.role === 'employee' ? '/employee/dashboard' : '/recruiter/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to register');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        @keyframes floatA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.05)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(1.08)} }
        @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(15px,-20px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes pulse-ring { 0%{transform:scale(0.92);opacity:.7} 100%{transform:scale(1.08);opacity:0} }
        .slide-up { animation: slideUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
        .fade-in  { animation: fadeIn 0.4s ease both; }
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #0d1b2a 100%)',
        display:'flex', flexDirection:'column', justifyContent:'center',
        alignItems:'center', padding:'2rem', position:'relative',
      }}>
        <Orbs />

        <div
          className={mounted ? 'slide-up' : ''}
          style={{ width:'100%', maxWidth:440, position:'relative', zIndex:10 }}
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div style={{ position:'relative', display:'inline-block', marginBottom:16 }}>
              <div style={{
                position:'absolute', inset:-8, borderRadius:'50%',
                border:'2px solid rgba(124,58,237,0.5)',
                animation:'pulse-ring 2.5s ease-out infinite',
              }}/>
              <div style={{
                width:56, height:56, borderRadius:'50%',
                background:'linear-gradient(135deg,#7C3AED,#5B21B6)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 32px rgba(124,58,237,0.5)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3.08A3 3 0 0 1 6 10.5V8a2.5 2.5 0 0 1 3.5-2.3V4.5A2.5 2.5 0 0 1 9.5 2Z"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3.08A3 3 0 0 0 18 10.5V8a2.5 2.5 0 0 0-3.5-2.3V4.5A2.5 2.5 0 0 0 14.5 2Z"/>
                </svg>
              </div>
            </div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'white', letterSpacing:'-0.5px', marginBottom:4 }}>
              WorkMind
            </h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, fontWeight:400 }}>
              AI-Powered Workplace Wellness
            </p>
          </div>

          <div style={{
            background:'rgba(255,255,255,0.97)',
            borderRadius:24, padding:'36px 40px',
            boxShadow:'0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
          }}>
            <div className="fade-in">
              <h2 style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:4 }}>Join Company</h2>
              <p style={{ fontSize:13, color:'#6B7280', marginBottom:24 }}>Register as {role}</p>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <InputField
                  label="Invite Code"
                  type="text"
                  required
                  value={formData.inviteCode}
                  onChange={e => setFormData({...formData, inviteCode: e.target.value})}
                  placeholder="JOIN-XXXX-XXXX"
                />
                <InputField
                  label="Full Name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Jane Smith"
                />
                <InputField
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="jane@company.com"
                />
                <InputField
                  label="Department (Optional)"
                  type="text"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  placeholder="Engineering"
                />
                <InputField
                  label="Password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />



                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop:8,
                    padding:'14px',
                    background: loading ? '#9CA3AF' : 'linear-gradient(135deg,#10B981,#059669)',
                    color:'white', border:'none', borderRadius:12,
                    fontSize:14, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(16,185,129,0.3)',
                    transition:'all 0.2s', fontFamily:'inherit',
                  }}
                >
                  {loading ? 'Joining...' : 'Join Company →'}
                </button>
              </form>

              <div style={{ textAlign:'center', marginTop:24 }}>
                <Link to="/login" style={{ fontSize:13, color:'#7C3AED', textDecoration:'none', fontWeight:600 }}>
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </div>

          <p style={{ textAlign:'center', marginTop:20, color:'rgba(255,255,255,0.25)', fontSize:12 }}>
            You will need an Invite Code from your administrator
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterEmployee;
