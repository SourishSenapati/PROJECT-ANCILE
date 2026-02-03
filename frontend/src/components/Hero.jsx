import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Lock } from 'lucide-react';

const Hero = () => {
  return (
    <section style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      position: 'relative',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', padding: '0 20px' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid var(--gold-dim)',
            borderRadius: '50px',
            color: 'var(--gold-primary)',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '32px',
            background: 'rgba(212, 175, 55, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Shield size={14} /> The Global Sanctuary Network
        </motion.div>
        
        <motion.h1 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           style={{
             fontSize: 'clamp(3rem, 6vw, 5.5rem)',
             lineHeight: '1.05',
             margin: '0 0 32px 0',
             background: 'linear-gradient(135deg, #fff 20%, #888 100%)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             letterSpacing: '-2px',
             fontWeight: 700
           }}
        >
          Silence is the ultimate<br />
          <span style={{ color: 'var(--gold-primary)', WebkitTextFillColor: 'initial', fontStyle: 'italic', fontFamily: 'serif' }}>Luxury.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: '48px',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}
        >
          Access a curated network of hyper-secure properties. 
          Audited by PrivacyShield™ for zero-trace stays.
        </motion.p>
        
        {/* Trust Indicators */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           style={{
             display: 'flex',
             justifyContent: 'center',
             gap: '40px',
             borderTop: '1px solid var(--border-subtle)',
             paddingTop: '32px',
             marginTop: '32px'
           }}
        >
           <div style={{ textAlign: 'center' }}>
             <h4 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>120+</h4>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Cities</span>
           </div>
           <div style={{ width: '1px', background: 'var(--border-subtle)' }}></div>
           <div style={{ textAlign: 'center' }}>
             <h4 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>ISO</h4>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>27001 Security</span>
           </div>
           <div style={{ width: '1px', background: 'var(--border-subtle)' }}></div>
           <div style={{ textAlign: 'center' }}>
             <h4 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>24/7</h4>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rapid Response</span>
           </div>
        </motion.div>

       {/* Hologram Overlay removed */}
      </div>

      {/* Decorative Background Elements */}
      <div style={{
         position: 'absolute',
         left: '50%',
         top: '50%',
         transform: 'translate(-50%, -50%)',
         width: '120vw',
         height: '60vw',
         background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)',
         zIndex: 0,
         pointerEvents: 'none'
      }}></div>
      
      <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0, 
          right: 0,
          height: '150px',
          background: 'linear-gradient(to top, var(--bg-deep) 0%, transparent 100%)',
          zIndex: 1
      }}></div>
    </section>
  );
};

export default Hero;
