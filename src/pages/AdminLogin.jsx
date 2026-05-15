import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import Logo from '../components/Logo';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F9FAFB', fontFamily: "'Inter', sans-serif" }}>
      {/* Visual Side */}
      <div style={{ 
        flex: 1.2, 
        position: 'relative', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '4rem', 
        backgroundImage: 'url(https://imcmvlmkbdooggmcwflp.supabase.co/storage/v1/object/sign/Logo/home_about_2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMGQ3ZWNmOC00MWQ5LTQwNmUtODRlMy0zNmQ0NTlmOTU2MzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMb2dvL2hvbWVfYWJvdXRfMi5qcGciLCJpYXQiOjE3Nzg3Mzk4OTQsImV4cCI6MTgxMDI3NTg5NH0.2rkzZDVkAYrdM8S0_3SsU9WTM6_TPPBma2vMNPQAr78)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} className="login-visual">
        {/* Dark Overlay for readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(230, 74, 25, 0.9), rgba(255, 112, 67, 0.4))', zIndex: 0 }}></div>
        
        {/* Animated Orbs for premium look */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)', filter: 'blur(50px)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Logo isDark={true} />
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginTop: '3rem', marginBottom: '1.5rem', lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
            Management <br />Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem', maxWidth: '450px', fontWeight: 300, lineHeight: 1.6 }}>
            Welcome back to the Siddhivinayak Builders administrative suite. Manage your properties and clients with ease.
          </p>
        </div>
        
        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', zIndex: 1 }}>
          <div style={{ width: '60px', height: '2px', background: 'white', marginBottom: '1.5rem' }}></div>
          <span style={{ color: 'white', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Administrative Control</span>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
          
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', color: '#1F2937', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif" }}>Sign In</h2>
            <p style={{ color: '#6B7280', fontSize: '1rem' }}>Please enter your credentials to proceed.</p>
          </div>
          
          {error && (
            <div style={{ 
              background: '#FEF2F2', 
              borderLeft: '4px solid #EF4444', 
              color: '#B91C1C', 
              padding: '1.25rem', 
              borderRadius: '8px', 
              marginBottom: '2rem', 
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Email</label>
              <input 
                type="email" 
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  borderRadius: '12px', 
                  border: '1px solid #E5E7EB', 
                  background: 'white', 
                  fontSize: '1rem',
                  outline: 'none',
                  transition: '0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                className="login-input"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="admin@svbuilders.com" 
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Password</label>
              <input 
                type="password" 
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  borderRadius: '12px', 
                  border: '1px solid #E5E7EB', 
                  background: 'white', 
                  fontSize: '1rem',
                  outline: 'none',
                  transition: '0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                className="login-input"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              style={{ 
                width: '100%', 
                padding: '18px', 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                borderRadius: '14px',
                background: '#FF7043',
                color: 'white',
                boxShadow: '0 8px 25px rgba(255, 112, 67, 0.25)',
                marginTop: '1rem',
                transition: '0.3s',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.75rem'
              }} 
              disabled={loading}
              className="login-btn"
            >
              {loading ? 'Verifying Access...' : 'Authenticate Access'}
            </button>
          </form>

        </div>
      </div>

      <style>{`
        .login-input:focus {
          border-color: #FF7043 !important;
          box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.1) !important;
        }
        .login-btn:hover {
          background: #E64A19 !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 112, 67, 0.35) !important;
        }
        .login-btn:active {
          transform: translateY(0);
        }
        @media (max-width: 1024px) {
          .login-visual { flex: 0.8 !important; }
        }
        @media (max-width: 850px) {
          .login-visual { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
