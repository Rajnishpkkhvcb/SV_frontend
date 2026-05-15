import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    projectId: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.data.slice(0, 3)); // Only get top 3 for featured
      } catch (err) {
        console.error('Error fetching projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await api.post('/enquiries', {
        ...formData,
        projectId: formData.projectId ? parseInt(formData.projectId, 10) : undefined
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '', projectId: '' });
      setTimeout(() => setFormStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section" style={{
        backgroundImage: 'url(https://imcmvlmkbdooggmcwflp.supabase.co/storage/v1/object/sign/Logo/home_about_2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMGQ3ZWNmOC00MWQ5LTQwNmUtODRlMy0zNmQ0NTlmOTU2MzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMb2dvL2hvbWVfYWJvdXRfMi5qcGciLCJpYXQiOjE3Nzg3Mzk4OTQsImV4cCI6MTgxMDI3NTg5NH0.2rkzZDVkAYrdM8S0_3SsU9WTM6_TPPBma2vMNPQAr78)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0 2rem'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2))' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '600px' }}
          >
            <h1 style={{ color: 'var(--white)', fontSize: '3.5rem', lineHeight: 1.2, marginBottom: '1.5rem' }}>
              Crafting Luxury Spaces For Modern Living
            </h1>
            <p style={{ color: 'var(--white)', opacity: 0.9, fontSize: '1.125rem', marginBottom: '2rem' }}>
              Discover premium residences that blend architectural excellence with uncompromising comfort. Your dream home awaits.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#projects" className="btn btn-primary" style={{ padding: '14px 28px' }}>Explore Projects</a>
              <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-contact')); }} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)', cursor: 'pointer' }}>Contact Us</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Building Trust Section */}
      <section style={{ padding: '6rem 0', background: '#FDF9F1' }}>
        <div className="container grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ width: '60px', height: '2px', background: '#D46A40', marginBottom: '2rem' }}></div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem', color: '#3E2723', fontFamily: 'Playfair Display, serif', lineHeight: 1.2 }}>
              Building Trust<br/>Since 2009
            </h2>
            <p style={{ color: '#5D4037', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Siddhivinayak Builders was founded with a singular vision — to create living spaces that transcend the ordinary. For over a decade, we have delivered exceptional residential and commercial developments across Maharashtra.
            </p>
            <p style={{ color: '#5D4037', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Our philosophy is rooted in integrity, quality craftsmanship, and an unwavering commitment to customer satisfaction. Every project is a reflection of our promise to build homes that stand the test of time.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'stretch' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '400px', transform: 'translateY(2rem)' }}>
              <img src="https://imcmvlmkbdooggmcwflp.supabase.co/storage/v1/object/sign/Logo/home_about_1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMGQ3ZWNmOC00MWQ5LTQwNmUtODRlMy0zNmQ0NTlmOTU2MzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMb2dvL2hvbWVfYWJvdXRfMS5qcGciLCJpYXQiOjE3Nzg3Mzk4NzUsImV4cCI6MTgxMDI3NTg3NX0.RlPEun_dzSsq8UTAVTP94LKmcyLy18NqE9GSSD18-SA" alt="Keys and house" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '400px' }}>
              <img src="https://imcmvlmkbdooggmcwflp.supabase.co/storage/v1/object/sign/Logo/home_about_2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMGQ3ZWNmOC00MWQ5LTQwNmUtODRlMy0zNmQ0NTlmOTU2MzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMb2dvL2hvbWVfYWJvdXRfMi5qcGciLCJpYXQiOjE3Nzg3Mzk4OTQsImV4cCI6MTgxMDI3NTg5NH0.2rkzZDVkAYrdM8S0_3SsU9WTM6_TPPBma2vMNPQAr78" alt="Building" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Featured Projects - New Design */}
      <section id="projects" style={{ padding: '6rem 0', background: '#FDF9F1' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '4rem' }}>
            <p style={{ color: '#D46A40', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 600 }}>
              FEATURED DEVELOPMENTS
            </p>
            <h2 style={{ fontSize: '3.5rem', color: '#3E2723', fontFamily: 'Playfair Display, serif', lineHeight: 1.1 }}>
              Our Signature<br/>Projects
            </h2>
          </motion.div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading projects...</div>
          ) : (
            <div className="grid-3">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ background: 'var(--white)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative' }}
                >
                  <div style={{ position: 'relative', height: '240px' }}>
                    <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', zIndex: 2 }}>
                      <span style={{ background: project.status === 'Completed' ? 'var(--success)' : '#D46A40', color: 'var(--white)', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', borderRadius: '4px', textTransform: 'uppercase' }}>
                        • {project.status === 'Ongoing' ? 'Under Construction' : project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#3E2723', fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
                      {project.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6, minHeight: '45px' }}>
                      {project.shortDescription || `Premium ${project.projectType?.toLowerCase()} offering modern amenities.`}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D46A40', fontSize: '0.875rem' }}>
                        <span>❖</span> <span style={{ color: 'var(--text-secondary)' }}>{project.location}</span>
                      </div>
                      {project.configuration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#333', fontSize: '0.875rem' }}>
                          <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#333' }}></span> {project.configuration}
                        </div>
                      )}
                    </div>
                    
                    <a href={`/project/${project.slug}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}></a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {projects.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No featured projects currently available.</div>}
        </div>
      </section>



      <Footer />
    </>
  );
};

export default Home;
