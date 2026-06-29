import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building2, Calendar, FileText, X, ChevronLeft, ChevronRight, CheckCircle2, Download, Phone, Mail, User, Info, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ImageWithLoader = ({ src, alt, style }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading && (
        <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} 
            style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--gold-primary)', borderRadius: '50%' }} 
          />
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoading(false)}
        style={{ 
          ...style, 
          opacity: loading ? 0 : 1, 
          transition: 'opacity 0.4s ease' 
        }} 
      />
    </div>
  );
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Gallery Modal
  const [showGallery, setShowGallery] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxTitle, setLightboxTitle] = useState("");

  // Brochure form state
  const [brochureForm, setBrochureForm] = useState({ name: '', email: '', phone: '' });
  const [brochureErrors, setBrochureErrors] = useState({});
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

  const validateBrochureForm = () => {
    const newErrors = {};

    // Name Validation
    if (!brochureForm.name || brochureForm.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!brochureForm.email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(brochureForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Validation
    const cleanPhone = brochureForm.phone.replace(/[^0-9]/g, '');
    const isIndian = cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone);
    const isIntl = cleanPhone.length >= 10 && cleanPhone.length <= 15;
    if (!brochureForm.phone) {
      newErrors.phone = 'Mobile number is required';
    } else if (!isIndian && !isIntl) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setBrochureErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBrochureDownload = async (e) => {
    e.preventDefault();
    if (!validateBrochureForm()) return;
    setBrochureStatus('submitting');
    try {
      await api.post('/enquiries', {
        ...brochureForm,
        message: `Requested brochure download for ${project.name}`,
        projectId: project.id
      });
      setBrochureStatus('success');
      setBrochureErrors({});
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
      <section style={{ height: '70vh', position: 'relative', overflow: 'hidden', backgroundColor: '#111' }}>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          src={project.coverImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'} 
          alt={project.name} 
          className="lazy-image"
          onLoad={(e) => e.target.classList.add('loaded')}
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
                  {project.layoutImageUrls.map((layout, i) => {
                    const cleanUrl = layout.split('?')[0];
                    const layoutName = (() => {
                      try {
                        const match = layout.match(/[?&]name=([^&#]+)/);
                        if (match) return decodeURIComponent(match[1]);
                      } catch (e) {}
                      return `Layout Plan ${i + 1}`;
                    })();
                    
                    return (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        style={{ 
                          background: 'white', 
                          padding: '1rem', 
                          borderRadius: '16px', 
                          border: '1px solid var(--border-color)',
                          cursor: 'zoom-in',
                          backgroundColor: '#F3ECE3'
                        }}
                        onClick={() => {
                          setLightboxImages(project.layoutImageUrls.map(u => u.split('?')[0]) || []);
                          setLightboxTitle("Floor Plans");
                          setActiveImg(i);
                          setShowGallery(true);
                        }}
                      >
                        <img src={cleanUrl} alt={layoutName} className="lazy-image" onLoad={(e) => e.target.classList.add('loaded')} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
                        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{layoutName}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', color: 'var(--text-primary)' }}>Project Gallery</h2>
                  <button 
                    onClick={() => {
                      setLightboxImages(galleryImages);
                      setLightboxTitle("Project Gallery");
                      setActiveImg(0);
                      setShowGallery(true);
                    }} 
                    style={{ color: 'var(--gold-dark)', fontWeight: 600, fontSize: '0.95rem', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '6px', cursor: 'pointer' }}
                  >
                    Expand Gallery
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {displayImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setLightboxImages(galleryImages);
                        setLightboxTitle("Project Gallery");
                        setActiveImg(idx);
                        setShowGallery(true);
                      }}
                      style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative', backgroundColor: '#F3ECE3' }}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="lazy-image" onLoad={(e) => e.target.classList.add('loaded')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <form onSubmit={handleBrochureDownload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required 
                      value={brochureForm.name} 
                      onChange={e => {
                        setBrochureForm({...brochureForm, name: e.target.value});
                        if (brochureErrors.name) setBrochureErrors({...brochureErrors, name: ''});
                      }} 
                      style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                    {brochureErrors.name && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{brochureErrors.name}</span>}
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required 
                      value={brochureForm.email} 
                      onChange={e => {
                        setBrochureForm({...brochureForm, email: e.target.value});
                        if (brochureErrors.email) setBrochureErrors({...brochureErrors, email: ''});
                      }} 
                      style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                    {brochureErrors.email && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{brochureErrors.email}</span>}
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      required 
                      value={brochureForm.phone} 
                      onChange={e => {
                        setBrochureForm({...brochureForm, phone: e.target.value});
                        if (brochureErrors.phone) setBrochureErrors({...brochureErrors, phone: ''});
                      }} 
                      style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                    {brochureErrors.phone && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{brochureErrors.phone}</span>}
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    <Phone size={16} style={{ marginTop: '3px' }} /> 
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <a href="tel:+918382838260" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>+91 83828 38260</a>
                      <a href="tel:+918382838297" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>+91 83828 38297</a>
                    </div>
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
        {showGallery && lightboxImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 1000, 
              background: 'rgba(10,10,10,0.98)', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 500, fontFamily: 'Playfair Display' }}>
                {project.name} • {lightboxTitle}
              </span>
              <button 
                onClick={() => setShowGallery(false)} 
                style={{ 
                  background: 'none', 
                  color: 'white', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Image Viewer Container */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '1rem 3rem' }}>
              {/* Prev Button */}
              {lightboxImages.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImg((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
                  }}
                  style={{
                    position: 'absolute',
                    left: '2rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: '0.3s'
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Central Image with loading spinner */}
              <div style={{ position: 'relative', maxWidth: '85vw', maxHeight: '70vh', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageWithLoader 
                  src={lightboxImages[activeImg]} 
                  alt={`${lightboxTitle} ${activeImg + 1}`} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '70vh', 
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                  }} 
                />
              </div>

              {/* Next Button */}
              {lightboxImages.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImg((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
                  }}
                  style={{
                    position: 'absolute',
                    right: '2rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: '0.3s'
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
            
            {/* Footer / Counter */}
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                {activeImg + 1} / {lightboxImages.length}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                Use arrows to navigate
              </span>
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
