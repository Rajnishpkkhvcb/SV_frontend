import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div style={{ background: '#FDF9F1', minHeight: '100vh' }}>
      <Navbar />

      {/* Why Choose Section */}
      <section style={{ padding: '8rem 0 4rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p style={{ color: 'var(--gold-dark)', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 600 }}>
              Our Commitment
            </p>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '4rem', color: '#3E2723', fontFamily: 'Playfair Display, serif', maxWidth: '600px', lineHeight: 1.1 }}>
              Why Choose<br/>Siddhivinayak
            </h1>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
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
      <section style={{ padding: '4rem 0 8rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
            
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ background: 'var(--white)', padding: '4rem 3rem', borderRadius: '16px 0 0 16px', borderTop: '1px solid #F0E6D2', borderBottom: '1px solid #F0E6D2', borderLeft: '4px solid #D46A40', boxShadow: '-10px 10px 40px rgba(0,0,0,0.02)' }}
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
              style={{ background: 'var(--white)', padding: '4rem 3rem', borderRadius: '0 16px 16px 0', borderTop: '1px solid #F0E6D2', borderBottom: '1px solid #F0E6D2', borderLeft: '2px solid #D46A40', borderRight: '1px solid #F0E6D2', boxShadow: '10px 10px 40px rgba(0,0,0,0.02)' }}
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

      <Footer />
    </div>
  );
};

export default About;
