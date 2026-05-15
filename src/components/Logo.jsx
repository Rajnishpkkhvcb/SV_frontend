import React from 'react';

const Logo = ({ className = '', style = {}, textStyle = {}, showText = true, isDark = false }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', ...style }}>
      <img 
        src="https://imcmvlmkbdooggmcwflp.supabase.co/storage/v1/object/sign/Logo/SiddhiVinayak_Logo.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMGQ3ZWNmOC00MWQ5LTQwNmUtODRlMy0zNmQ0NTlmOTU2MzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMb2dvL1NpZGRoaVZpbmF5YWtfTG9nby5qcGVnIiwiaWF0IjoxNzc4MjIxNTQyLCJleHAiOjE4MDk3NTc1NDJ9.-rHbZ_CQ0MqAHyTJB162eFi_J5sjPbjSjgwwk4T2bPk" 
        alt="Siddhivinayak Builders Logo" 
        style={{ 
          height: '60px', 
          objectFit: 'contain',
          borderRadius: '4px'
        }} 
      />
      
      {/* Text part */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', ...textStyle }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.25rem', color: isDark ? 'var(--white)' : 'var(--text-primary)', lineHeight: 1.1 }}>
            Siddhivinayak
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.65rem', color: 'var(--gold-dark)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Builders & Developers
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
