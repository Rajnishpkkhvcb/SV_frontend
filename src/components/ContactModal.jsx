import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/api';

const ContactModal = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', projectId: '' });
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const fetchProjects = async () => {
        try {
          const res = await api.get('/projects');
          setProjects(res.data.data);
        } catch (err) {}
      };
      if (projects.length === 0) fetchProjects();
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await api.post('/enquiries', {
        ...formData,
        projectId: formData.projectId && formData.projectId !== 'general' ? parseInt(formData.projectId, 10) : undefined
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '', projectId: '' });
      setTimeout(() => {
        setFormStatus(null);
        onClose();
      }, 3000);
    } catch (err) {
      setFormStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
        />
        <motion.div 
          className="contact-modal-container"
          initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          style={{ position: 'relative', width: '95%', maxWidth: '1000px', background: 'var(--white)', borderRadius: '16px', overflow: 'hidden', display: 'flex', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', maxHeight: '90vh' }}
        >
          {/* Close Button */}
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--white)', border: '1px solid var(--border-color)', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>×</button>

          <div className="contact-modal-grid" style={{ width: '100%', overflowY: 'auto' }}>
            {/* Left Info Side */}
            <div className="contact-info-side" style={{ background: '#FDF9F1', padding: '4rem 3rem', display: 'flex', flexDirection: 'column' }}>
              <h2 className="contact-modal-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#3E2723', fontFamily: 'Playfair Display, serif', lineHeight: 1.1 }}>Let's Start a<br/>Conversation</h2>
              <div style={{ width: '50px', height: '2px', background: 'var(--gold-dark)', marginBottom: '3rem' }}></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 144, 79, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-dark)', flexShrink: 0 }}>📍</div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Office Address</p>
                    <p style={{ fontWeight: 500, color: '#3E2723', fontSize: '0.95rem' }}>123 Builder Square, Dadar, Mumbai</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 144, 79, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-dark)', flexShrink: 0 }}>📞</div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Phone</p>
                    <p style={{ fontWeight: 500, color: '#3E2723', fontSize: '0.95rem' }}>+91 98765 43210</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 144, 79, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-dark)', flexShrink: 0 }}>✉️</div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Email</p>
                    <p style={{ fontWeight: 500, color: '#3E2723', fontSize: '0.95rem' }}>info@svbuilders.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Form Side */}
            <div className="contact-form-side" style={{ padding: '4rem 3rem' }}>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: '#3E2723' }}>Send an Enquiry</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="contact-form-row">
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required placeholder="Rahul Sharma" style={{ background: '#F8F9FA' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
                    <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleInputChange} required placeholder="+91 98765 43210" style={{ background: '#F8F9FA' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                  <input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} required placeholder="rahul@example.com" style={{ background: '#F8F9FA' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Interested In</label>
                  <select name="projectId" className="form-input" value={formData.projectId} onChange={handleInputChange} style={{ background: '#F8F9FA' }}>
                    <option value="">Select a Project</option>
                    <option value="general">General Enquiry</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Message</label>
                  <textarea name="message" className="form-input" value={formData.message} onChange={handleInputChange} rows="4" placeholder="How can we help you?" style={{ background: '#F8F9FA' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.125rem' }} disabled={formStatus === 'submitting'}>
                  {formStatus === 'submitting' ? 'Sending...' : 'Submit Enquiry'}
                </button>
                {formStatus === 'success' && <p style={{ color: 'var(--success)', marginTop: '1rem', textAlign: 'center' }}>Thank you! We will get back to you soon.</p>}
                {formStatus === 'error' && <p style={{ color: 'var(--danger)', marginTop: '1rem', textAlign: 'center' }}>Failed to submit. Please try again.</p>}
              </form>
            </div>
          </div>
        </motion.div>

        <style>{`
          .contact-modal-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .contact-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          @media (max-width: 850px) {
            .contact-modal-grid {
              grid-template-columns: 1fr;
            }
            .contact-info-side {
              padding: 3rem 2rem !important;
            }
            .contact-form-side {
              padding: 2.5rem 2rem !important;
            }
            .contact-modal-title {
              font-size: 2rem !important;
            }
            .contact-form-row {
              grid-template-columns: 1fr;
            }
            .contact-modal-container {
              width: 95% !important;
              max-height: 95vh !important;
            }
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
