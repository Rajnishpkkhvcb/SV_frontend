import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import api from '../config/api';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState({ residential: [], commercial: [] });

  useEffect(() => {
    if (isAdmin) return;
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        const allProjects = res.data.data;
        setProjects({
          residential: allProjects.filter(p => p.projectType === 'Residential' || p.projectType === 'Township' || p.projectType === 'Villa'),
          commercial: allProjects.filter(p => p.projectType === 'Commercial')
        });
      } catch (err) {
        console.error('Failed to fetch projects for navbar', err);
      }
    };
    fetchProjects();
  }, [isAdmin]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (isAdmin) return null;

  return (
    <nav style={{
      background: 'var(--white)',
      padding: '1rem 2rem',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Logo />
      </Link>

      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <Link to="/" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: location.pathname === '/' ? 'var(--gold-dark)' : 'var(--text-secondary)' }}>HOME</Link>
        
        <div 
          style={{ position: 'relative', padding: '1rem 0' }}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link 
            to="/projects" 
            style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              color: location.pathname.includes('/project') ? 'var(--gold-dark)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            PROJECTS
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Mega Menu Dropdown */}
          <div className="mega-menu" style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: `translateX(-50%) translateY(${showDropdown ? '0' : '10px'})`,
            opacity: showDropdown ? 1 : 0,
            visibility: showDropdown ? 'visible' : 'hidden',
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(16px)',
            color: 'var(--white)',
            width: '600px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            transition: 'all 0.3s ease',
            pointerEvents: showDropdown ? 'auto' : 'none'
          }}>
            <div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Residential</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.residential.slice(0, 4).map(p => (
                  <li key={p.id}>
                    <Link to={`/project/${p.slug}`} style={{ display: 'block' }}>
                      <span style={{ color: 'var(--white)', fontSize: '0.9rem', display: 'block' }} className="dropdown-link">{p.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>{p.location}</span>
                    </Link>
                  </li>
                ))}
                <li><Link to="/projects" style={{ color: 'var(--gold-dark)', fontSize: '0.875rem', fontWeight: 600 }}>View All Residential &rarr;</Link></li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Commercial</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.commercial.slice(0, 4).map(p => (
                  <li key={p.id}>
                    <Link to={`/project/${p.slug}`} style={{ display: 'block' }}>
                      <span style={{ color: 'var(--white)', fontSize: '0.9rem', display: 'block' }} className="dropdown-link">{p.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>{p.location}</span>
                    </Link>
                  </li>
                ))}
                <li><Link to="/projects" style={{ color: 'var(--gold-dark)', fontSize: '0.875rem', fontWeight: 600 }}>View All Commercial &rarr;</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <Link to="/about" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: location.pathname === '/about' ? 'var(--gold-dark)' : 'var(--text-secondary)' }}>ABOUT</Link>
        <button onClick={() => window.dispatchEvent(new Event('open-contact'))} className="btn btn-primary" style={{ border: 'none', cursor: 'pointer', padding: '0.75rem 1.5rem' }}>GET IN TOUCH</button>
      </div>

      {/* Hamburger Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          zIndex: 1001
        }}
      >
        <div style={{
          width: '24px',
          height: '2px',
          background: 'var(--text-primary)',
          marginBottom: '6px',
          transition: '0.3s',
          transform: isMobileMenuOpen ? 'translateY(8px) rotate(45deg)' : 'none'
        }} />
        <div style={{
          width: '24px',
          height: '2px',
          background: 'var(--text-primary)',
          marginBottom: '6px',
          opacity: isMobileMenuOpen ? 0 : 1,
          transition: '0.3s'
        }} />
        <div style={{
          width: '24px',
          height: '2px',
          background: 'var(--text-primary)',
          transition: '0.3s',
          transform: isMobileMenuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none'
        }} />
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        height: '100vh',
        background: 'var(--white)',
        zIndex: 1000,
        padding: '80px 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        overflowY: 'auto',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)'
      }}>
        <Link to="/" className="mobile-link">HOME</Link>
        
        {/* Mobile Projects Accordion */}
        <div style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.5rem 0',
              cursor: 'pointer'
            }}
          >
            <span className="mobile-link" style={{ border: 'none', padding: 0 }}>PROJECTS</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
              <path d="M1 1L6 6L11 1" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div style={{ 
            maxHeight: showDropdown ? '500px' : '0', 
            overflow: 'hidden', 
            transition: 'max-height 0.4s ease',
            paddingLeft: '1rem'
          }}>
            <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/projects" style={{ color: 'var(--gold-dark)', fontWeight: 600, textDecoration: 'none' }}>View All Projects</Link>
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Residential</p>
                {projects.residential.slice(0, 3).map(p => (
                  <Link key={p.id} to={`/project/${p.slug}`} style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-primary)', textDecoration: 'none' }}>{p.name}</Link>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Commercial</p>
                {projects.commercial.slice(0, 3).map(p => (
                  <Link key={p.id} to={`/project/${p.slug}`} style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-primary)', textDecoration: 'none' }}>{p.name}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Link to="/about" className="mobile-link">ABOUT US</Link>
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            window.dispatchEvent(new Event('open-contact'));
          }} 
          className="btn btn-primary"
          style={{ marginTop: 'auto', padding: '1.25rem', flexShrink: 0 }}
        >
          GET IN TOUCH
        </button>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }

        .mobile-link {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          letter-spacing: -0.02em;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .dropdown-link:hover {
          color: var(--gold-primary) !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
