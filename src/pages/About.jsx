import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div style={{ background: '#FDF9F1', minHeight: '100vh' }}>
      <Navbar />

      {/* Why Choose Section */}
      <section style={{ padding: 'var(--mobile-padding, 8rem 0 4rem)' }} className="about-hero-section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p style={{ color: 'var(--gold-dark)', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 600 }}>
              Our Commitment
            </p>
            <h1 className="about-title" style={{ fontSize: '3.5rem', marginBottom: '4rem', color: '#3E2723', fontFamily: 'Playfair Display, serif', maxWidth: '600px', lineHeight: 1.1 }}>
              Why Choose<br/>Siddhivinayak
            </h1>
          </motion.div>

          <div className="about-grid">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ background: 'var(--white)', padding: '3rem 2.5rem', borderRadius: '16px', border: '1px solid #F0E6D2', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🏆</div>
              <h3 style={{ fontSize: '1.5rem', color: '#D46A40', marginBottom: '1rem', fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
                15+ Years Trust
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                A proven track record of delivering quality homes on time, every time.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              style={{ background: 'var(--white)', padding: '3rem 2.5rem', borderRadius: '16px', border: '1px solid #F0E6D2', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🔑</div>
              <h3 style={{ fontSize: '1.5rem', color: '#D46A40', marginBottom: '1rem', fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
                RERA Certified
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                All projects are fully RERA registered and legally compliant for your peace of mind.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              style={{ background: 'var(--white)', padding: '3rem 2.5rem', borderRadius: '16px', border: '1px solid #F0E6D2', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>💎</div>
              <h3 style={{ fontSize: '1.5rem', color: '#D46A40', marginBottom: '1rem', fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
                Premium Finish
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Every detail is crafted with superior materials and uncompromising attention.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section style={{ padding: '4rem 0 8rem' }} className="mission-section">
        <div className="container">
          <div className="mission-grid">
            
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="mission-card mission-card-first"
              style={{ background: 'var(--white)', padding: '4rem 3rem', borderTop: '1px solid #F0E6D2', borderBottom: '1px solid #F0E6D2', borderLeft: '4px solid #D46A40', boxShadow: '-10px 10px 40px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontSize: '2rem', color: '#D46A40', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
                Our Mission
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                To create exceptional living and working environments through innovation, quality, and customer-first thinking.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="mission-card"
              style={{ background: '#FAF6EF', padding: '4rem 3rem', borderTop: '1px solid #F0E6D2', borderBottom: '1px solid #F0E6D2', borderLeft: '2px solid #D46A40', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontSize: '2rem', color: '#D46A40', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
                Our Vision
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                To be India's most trusted real estate brand, known for timeless design and uncompromising quality.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="mission-card mission-card-last"
              style={{ background: 'var(--white)', padding: '4rem 3rem', borderTop: '1px solid #F0E6D2', borderBottom: '1px solid #F0E6D2', borderLeft: '2px solid #D46A40', borderRight: '1px solid #F0E6D2', boxShadow: '10px 10px 40px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontSize: '2rem', color: '#D46A40', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
                Our Values
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                Transparency, integrity, and excellence guide everything we do — from land acquisition to final handover.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }

        .mission-card-first { border-radius: 16px 0 0 16px; }
        .mission-card-last { border-radius: 0 16px 16px 0; }

        @media (max-width: 991px) {
          .about-title { font-size: 2.5rem !important; }
          .about-grid, .mission-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .mission-card { border-radius: 16px !important; border-right: 1px solid #F0E6D2 !important; padding: 2.5rem !important; }
          .about-hero-section { padding: 5rem 0 2rem !important; }
          .mission-section { padding: 2rem 0 5rem !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default About;
