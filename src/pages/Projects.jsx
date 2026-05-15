import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.data);
      } catch (err) {
        console.error('Error fetching projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <Navbar />
      
      <section style={{ padding: '6rem 0', background: 'var(--bg-color)', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: 'var(--gold-dark)', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 600 }}>Our Portfolio</p>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>All Projects</h1>
            <div style={{ width: '80px', height: '3px', background: 'var(--gold-dark)', margin: '0 auto' }}></div>
          </div>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {['All', 'Ongoing', 'Completed', 'Residential', 'Commercial'].map((filterOption) => {
              // Handle label display
              const label = filterOption === 'Ongoing' ? 'Under Construction' : filterOption;
              const isActive = filter === filterOption;
              return (
                <button 
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '30px',
                    border: `1px solid ${isActive ? 'var(--gold-dark)' : 'var(--border-color)'}`,
                    background: isActive ? 'var(--gold-dark)' : 'transparent',
                    color: isActive ? 'var(--white)' : 'var(--text-secondary)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading projects...</div>
          ) : (
            <div className="grid-3">
              {projects
                .filter(p => {
                  if (filter === 'All') return true;
                  if (filter === 'Ongoing') return p.status === 'Ongoing' || p.status === 'Under Construction';
                  if (filter === 'Completed') return p.status === 'Completed';
                  if (filter === 'Residential' || filter === 'Commercial') return p.projectType === filter;
                  return true;
                })
                .map((project, index) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ position: 'relative', height: '280px' }}>
                    <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                      <span className={`badge ${(project.status === 'Ongoing' || project.status === 'Under Construction') ? 'badge-ongoing' : 'badge-completed'}`} style={{ backgroundColor: project.status === 'Completed' ? 'var(--success)' : 'var(--gold-dark)' }}>
                        • {project.status === 'Ongoing' ? 'Under Construction' : project.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{project.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{color: 'var(--gold-dark)'}}>📍</span> {project.location}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                      <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{project.projectType}</span>
                      <a href={`/project/${project.slug}`} style={{ color: 'var(--gold-dark)', fontWeight: 600, fontSize: '1rem' }}>View Details &rarr;</a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {projects.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No projects found.</div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Projects;
