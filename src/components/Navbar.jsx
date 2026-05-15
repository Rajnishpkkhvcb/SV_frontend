import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import api from '../config/api';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [showDropdown, setShowDropdown] = useState(false);
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

  if (isAdmin) return null; // Don't show public navbar in admin pages

  return (
    <nav style={{
      background: 'var(--white)',
      padding: '1.25rem 2rem',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Logo />
      </Link>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="nav-menu">
        <Link to="/" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: location.pathname === '/' ? 'var(--gold-dark)' : 'var(--text-secondary)' }}>HOME</Link>
        
        {/* Projects Dropdown */}
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
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: `translateX(-50%) translateY(${showDropdown ? '0' : '10px'})`,
            opacity: showDropdown ? 1 : 0,
            visibility: showDropdown ? 'visible' : 'hidden',
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
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
            {/* Residential Column */}
            <div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Residential</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {projects.residential.slice(0, 5).map(p => (
                  <li key={p.id}>
                    <Link to={`/project/${p.slug}`} style={{ display: 'block' }}>
                      <span style={{ color: 'var(--white)', fontSize: '0.95rem', display: 'block', transition: 'color 0.2s' }} className="dropdown-link">{p.name}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{p.location}</span>
                    </Link>
                  </li>
                ))}
                {projects.residential.length === 0 && <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No projects found</li>}
                {projects.residential.length > 5 && (
                  <li><Link to="/projects" style={{ color: 'var(--gold-dark)', fontSize: '0.875rem', fontWeight: 600 }}>View all &rarr;</Link></li>
                )}
              </ul>
            </div>

            {/* Commercial Column */}
            <div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Commercial</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {projects.commercial.slice(0, 5).map(p => (
                  <li key={p.id}>
                    <Link to={`/project/${p.slug}`} style={{ display: 'block' }}>
                      <span style={{ color: 'var(--white)', fontSize: '0.95rem', display: 'block', transition: 'color 0.2s' }} className="dropdown-link">{p.name}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{p.location}</span>
                    </Link>
                  </li>
                ))}
                {projects.commercial.length === 0 && <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No projects found</li>}
                {projects.commercial.length > 5 && (
                  <li><Link to="/projects" style={{ color: 'var(--gold-dark)', fontSize: '0.875rem', fontWeight: 600 }}>View all &rarr;</Link></li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <Link to="/about" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: location.pathname === '/about' ? 'var(--gold-dark)' : 'var(--text-secondary)' }}>ABOUT</Link>
        <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-contact')); }} className="btn btn-primary" style={{ textDecoration: 'none', border: 'none', cursor: 'pointer' }}>GET IN TOUCH</button>
      </div>

      <style>{`
        .dropdown-link:hover {
          color: var(--gold-primary) !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
