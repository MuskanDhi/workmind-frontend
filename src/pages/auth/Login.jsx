import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const InputField = ({ label, hint, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
      {hint && <span className="ml-1.5 text-xs font-normal text-gray-400">{hint}</span>}
    </label>
    <input
      {...props}
      className="w-full border border-gray-200 bg-gray-50/60 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 focus:bg-white transition-all duration-200"
    />
  </div>
);

const Login = () => {
  const [view, setView]         = useState('options');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const { login, isAuthenticated, user }   = useAuth();
  const navigate    = useNavigate();

  useEffect(() => { 
    setMounted(true); 
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        if (!user.companyKey || user.companyKey.trim() === '') {
          navigate('/admin/setup-key');
        } else {
          navigate('/admin/dashboard');
        }
      } else if (user.role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back! 👋');
      
      if (user.role === 'admin') {
        if (!user.companyKey || user.companyKey.trim() === '') {
          navigate('/admin/setup-key');
        } else {
          navigate('/admin/dashboard');
        }
      } else if (user.role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid credentials');
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

        {/* Card */}
        <div
          className={mounted ? 'slide-up' : ''}
          style={{
            width:'100%', maxWidth:440, position:'relative', zIndex:10,
            animationDelay:'0.1s',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div style={{ position:'relative', display:'inline-block', marginBottom:16 }}>
              {/* Pulse ring */}
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
                {/* Brain icon inline SVG */}
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

          {/* Glass card */}
          <div style={{
            background:'rgba(255,255,255,0.97)',
            borderRadius:24, padding:'36px 40px',
            boxShadow:'0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
          }}>

            {/* ── VIEW: Options ── */}
            {view === 'options' && (
              <div className="fade-in">
                <h2 style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:6 }}>
                  Welcome back 👋
                </h2>
                <p style={{ fontSize:13, color:'#6B7280', marginBottom:28 }}>
                  Sign in to your WorkMind workspace
                </p>

                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {/* Admin Login */}
                  <button
                    onClick={() => setView('login')}
                    style={{
                      display:'flex', alignItems:'center', gap:14,
                      border:'1.5px solid #EDE9FE', borderRadius:14,
                      padding:'14px 18px', background:'#FAFAFA',
                      cursor:'pointer', transition:'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='#7C3AED'; e.currentTarget.style.background='#FAF5FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='#EDE9FE'; e.currentTarget.style.background='#FAFAFA'; }}
                  >
                    <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#7C3AED,#5B21B6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:18 }}>🏢</span>
                    </div>
                    <div style={{ textAlign:'left' }}>
                      <div style={{ fontSize:14, fontWeight:600, color:'#111827' }}>Admin Login</div>
                      <div style={{ fontSize:12, color:'#9CA3AF' }}>Manage surveys & view insights</div>
                    </div>
                    <div style={{ marginLeft:'auto', color:'#9CA3AF', fontSize:18 }}>→</div>
                  </button>

                  {/* Employee Login */}
                  <button
                    onClick={() => setView('login')}
                    style={{
                      display:'flex', alignItems:'center', gap:14,
                      border:'1.5px solid #D1FAE5', borderRadius:14,
                      padding:'14px 18px', background:'#FAFAFA',
                      cursor:'pointer', transition:'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='#10B981'; e.currentTarget.style.background='#F0FDF9'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='#D1FAE5'; e.currentTarget.style.background='#FAFAFA'; }}
                  >
                    <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#10B981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:18 }}>👤</span>
                    </div>
                    <div style={{ textAlign:'left' }}>
                      <div style={{ fontSize:14, fontWeight:600, color:'#111827' }}>Employee Login</div>
                      <div style={{ fontSize:12, color:'#9CA3AF' }}>Answer surveys & track wellness</div>
                    </div>
                    <div style={{ marginLeft:'auto', color:'#9CA3AF', fontSize:18 }}>→</div>
                  </button>
                </div>

                {/* Divider */}
                <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
                  <div style={{ flex:1, height:1, background:'#F3F4F6' }}/>
                  <span style={{ fontSize:12, color:'#9CA3AF', fontWeight:500 }}>New to WorkMind?</span>
                  <div style={{ flex:1, height:1, background:'#F3F4F6' }}/>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <Link
                    to="/register/admin"
                    style={{
                      display:'block', textAlign:'center', padding:'12px',
                      background:'linear-gradient(135deg,#7C3AED,#5B21B6)',
                      color:'white', borderRadius:12, fontSize:14, fontWeight:600,
                      textDecoration:'none', transition:'opacity 0.2s',
                      boxShadow:'0 4px 14px rgba(124,58,237,0.35)',
                    }}
                  >
                    🚀 Create a Company (Admin)
                  </Link>
                  <Link
                    to="/register/employee"
                    style={{
                      display:'block', textAlign:'center', padding:'12px',
                      background:'linear-gradient(135deg,#10B981,#059669)',
                      color:'white', borderRadius:12, fontSize:14, fontWeight:600,
                      textDecoration:'none', transition:'opacity 0.2s',
                      boxShadow:'0 4px 14px rgba(16,185,129,0.3)',
                    }}
                  >
                    ✨ Join a Company (Employee)
                  </Link>
                </div>

                <div style={{ textAlign:'center', marginTop:20 }}>
                  <Link to="/register/recruiter" style={{ fontSize:12, color:'#9CA3AF', textDecoration:'none' }}>
                    Register as Recruiter →
                  </Link>
                </div>
              </div>
            )}

            {/* ── VIEW: Login Form ── */}
            {view === 'login' && (
              <div className="fade-in">
                <button
                  onClick={() => setView('options')}
                  style={{ fontSize:13, color:'#9CA3AF', background:'none', border:'none', cursor:'pointer', padding:'0 0 20px 0', display:'flex', alignItems:'center', gap:4, fontFamily:'inherit' }}
                >
                  ← Back
                </button>

                <h2 style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:4 }}>Sign In</h2>
                <p style={{ fontSize:13, color:'#6B7280', marginBottom:24 }}>Enter your credentials to continue</p>

                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <InputField
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                  <InputField
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      marginTop:8,
                      padding:'14px',
                      background: loading ? '#9CA3AF' : 'linear-gradient(135deg,#7C3AED,#5B21B6)',
                      color:'white', border:'none', borderRadius:12,
                      fontSize:14, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: loading ? 'none' : '0 4px 14px rgba(124,58,237,0.4)',
                      transition:'all 0.2s', fontFamily:'inherit',
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In →'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom caption */}
          <p style={{ textAlign:'center', marginTop:20, color:'rgba(255,255,255,0.25)', fontSize:12 }}>
            Secure · Private · AI-Powered
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
