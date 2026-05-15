import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#111111',
      color: 'white',
      padding: '4rem 0 0',
      marginTop: 'auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Element */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '30%',
        height: '100%',
        background: 'linear-gradient(45deg, transparent, rgba(197, 144, 79, 0.05))',
        pointerEvents: 'none'
      }}></div>

      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '4rem', 
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 1
        }}>
          
          {/* Brand & Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Logo isDark={true} />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.8' }}>
              Crafting architectural masterpieces and sustainable communities since 2009. We believe in building more than just structures—we build legacies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--white)', fontFamily: 'Playfair Display', fontSize: '1.25rem', marginBottom: '2rem', position: 'relative' }}>
              Explore
              <div style={{ position: 'absolute', bottom: '-8px', left: 0, width: '30px', height: '2px', background: 'var(--gold-dark)' }}></div>
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {['Home', 'About Us', 'Projects'].map((item, idx) => (
                <li key={idx}>
                  <Link to={item === 'Home' ? '/' : (item === 'About Us' ? '/about' : `/${item.toLowerCase()}`)} style={{ 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: '0.95rem', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: '0.3s'
                  }} className="footer-link">
                    <ArrowRight size={14} style={{ opacity: 0 }} className="footer-arrow" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'var(--white)', fontFamily: 'Playfair Display', fontSize: '1.25rem', marginBottom: '2rem', position: 'relative' }}>
              Get In Touch
              <div style={{ position: 'absolute', bottom: '-8px', left: 0, width: '30px', height: '2px', background: 'var(--gold-dark)' }}></div>
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--gold-primary)', marginTop: '4px' }}><MapPin size={20} /></div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  123 Builder Square, Dadar West,<br />Mumbai, Maharashtra - 400028
                </div>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--gold-primary)' }}><Phone size={20} /></div>
                <a href="tel:+919876543210" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>+91 98765 43210</a>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--gold-primary)' }}><Mail size={20} /></div>
                <a href="mailto:info@svbuilders.com" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>info@svbuilders.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          padding: '2rem 0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1.5rem' 
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Siddhivinayak Builders. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {['Privacy Policy', 'Terms & Conditions', 'Cookies Settings'].map((item, idx) => (
              <a key={idx} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', transition: '0.3s' }} className="bottom-link">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--gold-light) !important;
          padding-left: 5px;
        }
        .footer-link:hover .footer-arrow {
          opacity: 1 !important;
          transform: translateX(3px);
        }
        .bottom-link:hover {
          color: var(--white) !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
