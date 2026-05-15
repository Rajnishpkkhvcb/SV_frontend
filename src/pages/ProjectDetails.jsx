import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building2, Calendar, FileText, X, ChevronRight, CheckCircle2, Download, Phone, Mail, User, Info, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Gallery Modal
  const [showGallery, setShowGallery] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Brochure form state
  const [brochureForm, setBrochureForm] = useState({ name: '', email: '', phone: '' });
  const [brochureStatus, setBrochureStatus] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        setProject(res.data.data);
      } catch (err) {
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  const handleBrochureDownload = async (e) => {
    e.preventDefault();
    setBrochureStatus('submitting');
    try {
      await api.post('/enquiries', {
        ...brochureForm,
        message: `Requested brochure download for ${project.name}`,
        projectId: project.id
      });
      setBrochureStatus('success');
      if (project.brochureUrl) {
        window.open(project.brochureUrl, '_blank');
      }
    } catch (err) {
      setBrochureStatus('error');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '40px', height: '40px', border: '3px solid var(--gold-light)', borderTopColor: 'var(--gold-dark)', borderRadius: '50%' }} />
    </div>
  );
  
  if (error || !project) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--bg-color)' }}>
      <h2 style={{ fontFamily: 'Playfair Display' }}>Oops! Project Not Found</h2>
      <Link to="/projects" className="btn btn-outline">Back to Projects</Link>
    </div>
  );

  const galleryImages = project.galleryImageUrls || [];
  const displayImages = galleryImages.slice(0, 3);
  const remainingCount = galleryImages.length - 3;

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ height: '70vh', position: 'relative', overflow: 'hidden' }}>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          src={project.coverImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'} 
          alt={project.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.1) 100%)' }}></div>
        
        <div className="container" style={{ position: 'absolute', bottom: '12%', left: '0', right: '0', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span className="badge" style={{ backgroundColor: project.status === 'Completed' ? 'var(--success)' : 'var(--gold-dark)', color: 'white', padding: '6px 14px', borderRadius: '4px', fontSize: '0.75rem' }}>
                {project.status === 'Ongoing' ? 'Ongoing' : project.status}
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '4px', fontSize: '0.75rem' }}>
                {project.projectType}
              </span>
            </div>
            <h1 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em', fontFamily: 'Playfair Display' }}>{project.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
              <MapPin size={20} color="var(--gold-primary)" /> {project.location}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '5rem', alignItems: 'flex-start' }}>
          
          {/* Left Column */}
          <div>
            {/* Minimal Specs Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '2.5rem 0', 
              borderTop: '1px solid var(--border-color)', 
              borderBottom: '1px solid var(--border-color)', 
              marginBottom: '4rem' 
            }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Configuration</p>
                <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>{project.totalUnits || 'Premium Residences'}</p>
              </div>
              <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Possession</p>
                <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>{project.possession || 'TBD'}</p>
              </div>
              <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>RERA Number</p>
                <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>{project.reraNo || 'Applied'}</p>
              </div>
            </div>

            {/* Content Section */}
            <div style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>The Vision</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '90%' }}>
                {project.description || `${project.name} is a testament to sophisticated urban living. Located in the prestigious ${project.location}, this project harmonizes modern architectural excellence with the serenity of meticulously planned spaces.`}
              </p>
            </div>

            {/* Amenities - Minimalist Grid */}
            {project.amenities && project.amenities.length > 0 && (
              <div style={{ marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', marginBottom: '2.5rem', color: 'var(--text-primary)' }}>Curated Amenities</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                  {project.amenities.map((amenity, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold-dark)' }}></div>
                      <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layouts Section */}
            {project.layoutImageUrls && project.layoutImageUrls.length > 0 && (
              <div style={{ marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', marginBottom: '2.5rem', color: 'var(--text-primary)' }}>Floor Plans & Layouts</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                  {project.layoutImageUrls.map((layout, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      style={{ 
                        background: 'white', 
                        padding: '1rem', 
                        borderRadius: '16px', 
                        border: '1px solid var(--border-color)',
                        cursor: 'zoom-in'
                      }}
                      onClick={() => {
                        // Optionally open in gallery or separate viewer
                        setShowGallery(true);
                        // find index of this layout in the total gallery list if you want to integrate
                      }}
                    >
                      <img src={layout} alt={`Layout ${i + 1}`} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
                      <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Layout Plan {i + 1}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', color: 'var(--text-primary)' }}>Project Gallery</h2>
                  <button onClick={() => setShowGallery(true)} style={{ color: 'var(--gold-dark)', fontWeight: 600, fontSize: '0.95rem', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '6px' }}>
                    Expand Gallery
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {displayImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setShowGallery(true); setActiveImg(idx); }}
                      style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                    >
                      <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {idx === 2 && remainingCount > 0 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 600 }}>
                          +{remainingCount} Photos
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Modernized Brochure */}
          <aside style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: '#111111', color: 'white', borderRadius: '20px', padding: '3rem 2.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontFamily: 'Playfair Display', marginBottom: '0.75rem', color: 'var(--gold-primary)' }}>Get Project Brochure</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.5 }}>Provide your details to receive the detailed project floor plans and price list.</p>
              </div>

              {brochureStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <CheckCircle2 size={48} color="var(--gold-primary)" style={{ margin: '0 auto 1.5rem' }} />
                  <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Sent to your inbox!</p>
                  <button onClick={() => setBrochureStatus(null)} style={{ color: 'var(--gold-primary)', background: 'none', border: '1px solid var(--gold-primary)', padding: '10px 20px', borderRadius: '8px' }}>Send Again</button>
                </div>
              ) : (
                <form onSubmit={handleBrochureDownload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required 
                      value={brochureForm.name} 
                      onChange={e => setBrochureForm({...brochureForm, name: e.target.value})} 
                      style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required 
                      value={brochureForm.email} 
                      onChange={e => setBrochureForm({...brochureForm, email: e.target.value})} 
                      style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      required 
                      value={brochureForm.phone} 
                      onChange={e => setBrochureForm({...brochureForm, phone: e.target.value})} 
                      style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', height: '56px', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, marginTop: '1rem' }} 
                    disabled={brochureStatus === 'submitting'}
                  >
                    {brochureStatus === 'submitting' ? 'Sending...' : 'Download Brochure'}
                  </button>
                </form>
              )}

              <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* <a href={`tel:+919876543210`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gold-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={16} /></div>
                  +91 98765 43210
                </a> */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    {/* <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gold-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Info size={16} /></div> */}
                    {/* Quick Response Guaranteed */}
                    <Phone size={16} /> <span>+91 98765 43210</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    <Mail size={16} /> <span>info@svbuilders.com</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Gallery Lightbox */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.98)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem', color: 'white' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 500, fontFamily: 'Playfair Display' }}>{project.name} • Visuals</span>
              <button onClick={() => setShowGallery(false)} style={{ background: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.2)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', overflowX: 'auto', padding: '2rem', gap: '2rem', alignItems: 'center' }} className="gallery-scroll">
              {galleryImages.map((img, idx) => (
                <div key={idx} style={{ minWidth: '75vw', height: '75vh', borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={img} alt={`Full Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
              Swipe or scroll to navigate
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style>{`
        .gallery-scroll::-webkit-scrollbar { height: 4px; }
        .gallery-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @media (max-width: 1100px) {
          .container { grid-template-columns: 1fr !important; }
          aside { position: relative !important; top: 0 !important; margin-top: 4rem; }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
