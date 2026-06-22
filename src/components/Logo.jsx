import React from 'react';

const Logo = ({ className = '', style = {}, textStyle = {}, showText = true, isDark = false }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', ...style }}>
      <img 
        src="/assets/images/SiddhiVinayak_Logo.webp" 
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
