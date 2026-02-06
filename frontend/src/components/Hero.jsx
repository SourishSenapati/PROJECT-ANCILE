import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Lock, X, MapPin, Award, Clock } from 'lucide-react';

const TRUST_INFO = {
  cities: {
    icon: MapPin,
    title: '120+ Global Cities',
    description: 'Our sanctuary network spans 120+ cities across 6 continents. From Dubai to Zurich, Tokyo to New York, we maintain verified safe-houses in every major financial and political hub. Each location undergoes quarterly security audits and compliance checks.',
    stats: ['45 Countries', '6 Continents', 'Quarterly Audits']
  },
  iso: {
    icon: Shield,
    title: 'ISO 27001 Certified',
    description: 'Every property in our network holds ISO 27001:2022 certification for Information Security Management. This internationally recognized standard ensures your data, communications, and physical security meet the highest global benchmarks.',
    stats: ['Data Encryption', 'Access Control', 'Incident Response']
  },
  response: {
    icon: Clock,
    title: '24/7 Rapid Response',
    description: 'Our global security operations center monitors all properties around the clock. In case of emergency, our tactical response teams can be deployed within 15 minutes in major hubs, with helicopter extraction available in 30 minutes or less.',
    stats: ['15min Response', 'Helicopter Ready', 'Global Monitoring']
  }
};

const Hero = () => {
  const [activeModal, setActiveModal] = useState(null);
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
        <div 
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
        </div>
        
        <h1 
           style={{
             fontSize: 'clamp(3rem, 6vw, 5.5rem)',
             lineHeight: '1.05',
             margin: '0 0 32px 0',
             color: 'white',
             /* background: 'linear-gradient(135deg, #fff 20%, #888 100%)', */
             /* WebkitBackgroundClip: 'text', */
             /* WebkitTextFillColor: 'transparent', */
             letterSpacing: '-2px',
             fontWeight: 700
           }}
        >
          Silence is the ultimate<br />
          <span style={{ color: 'var(--gold-primary)', WebkitTextFillColor: 'initial', fontStyle: 'italic', fontFamily: 'serif' }}>Luxury.</span>
        </h1>

        <p 
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
        </p>
        
        {/* Trust Indicators */}
        <div
           style={{
             display: 'flex',
             flexWrap: 'wrap',
             justifyContent: 'center',
             gap: '24px',
             borderTop: '1px solid var(--border-subtle)',
             paddingTop: '32px',
             marginTop: '32px'
           }}
        >
           <button 
             onClick={() => setActiveModal('cities')}
             className="hover:bg-white/5 transition-all cursor-pointer"
             style={{ 
               textAlign: 'center', 
               background: 'transparent', 
               border: 'none',
               padding: '12px 20px',
               borderRadius: '8px',
               minWidth: '140px'
             }}>
             <h4 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>120+</h4>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Cities</span>
           </button>
           
           <div style={{ width: '1px', background: 'var(--border-subtle)', display: window.innerWidth < 640 ? 'none' : 'block' }}></div>
           
           <button 
             onClick={() => setActiveModal('iso')}
             className="hover:bg-white/5 transition-all cursor-pointer"
             style={{ 
               textAlign: 'center', 
               background: 'transparent', 
               border: 'none',
               padding: '12px 20px',
               borderRadius: '8px',
               minWidth: '140px'
             }}>
             <h4 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>ISO</h4>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>27001 Security</span>
           </button>
           
           <div style={{ width: '1px', background: 'var(--border-subtle)', display: window.innerWidth < 640 ? 'none' : 'block' }}></div>
           
           <button 
             onClick={() => setActiveModal('response')}
             className="hover:bg-white/5 transition-all cursor-pointer"
             style={{ 
               textAlign: 'center', 
               background: 'transparent', 
               border: 'none',
               padding: '12px 20px',
               borderRadius: '8px',
               minWidth: '140px'
             }}>
             <h4 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>24/7</h4>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rapid Response</span>
           </button>
        </div>

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

      {/* Trust Info Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#0f0f12',
                border: '1px solid var(--gold-primary)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                position: 'relative',
                boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)'
              }}
            >
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <X size={20} />
              </button>

              {React.createElement(TRUST_INFO[activeModal].icon, { 
                size: 40, 
                style: { color: 'var(--gold-primary)', marginBottom: '16px' } 
              })}

              <h3 style={{ 
                fontSize: '1.75rem', 
                color: 'white', 
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                {TRUST_INFO[activeModal].title}
              </h3>

              <p style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: '1.7',
                marginBottom: '24px',
                fontSize: '1rem'
              }}>
                {TRUST_INFO[activeModal].description}
              </p>

              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                {TRUST_INFO[activeModal].stats.map((stat, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--gold-primary)',
                      color: 'black',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    {stat}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
