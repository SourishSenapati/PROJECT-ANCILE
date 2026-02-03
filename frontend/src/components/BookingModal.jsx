import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, User, Shield, Star, Lock, Activity, X, Briefcase } from 'lucide-react';
import ConciergePanel from './ConciergePanel';

const PropertyDetailModal = ({ room, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!room) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000
    }} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
            width: '90%',
            maxWidth: '900px',
            height: '85vh',
            background: '#0f0f12',
            border: '1px solid var(--gold-dim)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Area */}
        <div style={{ height: '300px', flexShrink: 0, position: 'relative' }}>
            <img 
                src={room.image} 
                alt={room.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ 
                position: 'absolute', inset: 0, 
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), #0f0f12)' 
            }}></div>
            
            <button 
                onClick={onClose}
                className="hover:bg-black/50 transition-colors"
                style={{
                    position: 'absolute', top: '24px', right: '24px',
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 10
                }}
            >
                <X size={20} />
            </button>

            <div style={{ position: 'absolute', bottom: '24px', left: '32px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    {room.tags && room.tags.map(tag => (
                        <span key={tag} style={{ background: 'var(--gold-primary)', color: 'black', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '4px' }}>
                            {tag}
                        </span>
                    ))}
                </div>
                <h2 style={{ fontSize: '2.5rem', color: 'white', margin: 0 }}>{room.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Star size={16} fill="var(--gold-primary)" stroke="none" /> 
                    <span style={{ color: 'white', fontWeight: 600 }}>{room.rating || 5.0}</span>
                    <span>• {room.location || 'Unknown Location'}</span>
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Left: Details */}
            <div style={{ flex: 2, padding: '32px', overflowY: 'auto' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '32px' }}>
                    {['Overview', 'Security Specs', 'Concierge', 'Reviews'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                            style={{
                                background: 'none', border: 'none',
                                padding: '0 0 16px 0',
                                color: activeTab === tab.toLowerCase().split(' ')[0] ? 'var(--gold-primary)' : 'var(--text-tertiary)',
                                borderBottom: activeTab === tab.toLowerCase().split(' ')[0] ? '2px solid var(--gold-primary)' : 'none',
                                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                                transition: 'color 0.3s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <h3 style={{ color: 'white', marginBottom: '16px' }}>Sanctuary Features</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
                                {room.features.map((feat, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                        <Check size={16} color="var(--gold-primary)" />
                                        <span style={{ color: 'var(--text-secondary)' }}>{feat}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <h3 style={{ color: 'white', marginBottom: '16px' }}>About this Fortress</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                This property has been vetted by our ex-military audit team. It features 
                                standalone power grid capability, encrypted satellite uplinks, and a 
                                panic room certified to NATO Level 4 standards. Perfect for 
                                sensitive negotiations or high-profile isolation.
                            </p>
                        </motion.div>
                    )}
                    
                    {activeTab === 'concierge' && (
                        <motion.div
                             key="concierge"
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0 }}
                        >
                            <ConciergePanel />
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                             key="security"
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0 }}
                        >
                            <div style={{ background: 'rgba(231, 76, 60, 0.1)', border: '1px solid var(--error-crimson)', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Shield size={24} className="text-red-500" />
                                <div>
                                    <h4 style={{ color: 'white', margin: 0 }}>Clearance Level 5 Required</h4>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Only approved members can book this asset.</p>
                                </div>
                            </div>

                            <h3 style={{ color: 'white', marginBottom: '16px' }}>Defense Capabilities</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Parameter Surveillance</span>
                                    <span style={{ color: 'var(--success-emerald)' }}>Active (AI)</span>
                                </li>
                                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Ballistic Rating</span>
                                    <span style={{ color: 'white' }}>BR6 (Glass/Walls)</span>
                                </li>
                                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Cyber Shield</span>
                                    <span style={{ color: 'white' }}>Air-Gapped Network</span>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                    
                    {activeTab === 'reviews' && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                       >
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>4.92</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Based on 12 verified stays</div>
                            </div>
                            
                            {[1, 2].map((review) => (
                                <div key={review} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div style={{ color: 'white', fontWeight: 600 }}>Verified Diplomat</div>
                                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Oct 2025</div>
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        "Exceptional privacy. The extraction team was ready but unneeded. 
                                        The comms array worked perfectly for the summit."
                                    </p>
                                </div>
                            ))}
                       </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right: Booking Form */}
            <div style={{ flex: 1, background: 'var(--bg-panel)', padding: '32px', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <span style={{ fontSize: '1.25rem', color: 'white', fontWeight: 700 }}>${room.price}</span>
                        <span style={{ color: 'var(--text-secondary)' }}> / night</span>
                    </div>
                </div>

                <div style={{ marginBottom: '24px', padding: '12px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.1)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Activity size={16} className="text-green-500" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)' }}>APT-1 Risk Assessment: <strong>Passed</strong></span>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '8px' }}>CHECK-IN</label>
                            <input type="date" className="p-3 bg-white/5 border border-white/10 rounded text-white w-full text-sm" />
                        </div>
                         <div>
                            <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '8px' }}>CHECK-OUT</label>
                            <input type="date" className="p-3 bg-white/5 border border-white/10 rounded text-white w-full text-sm" />
                        </div>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '8px' }}>GUESTS</label>
                        <select className="p-3 bg-white/5 border border-white/10 rounded text-white w-full text-sm">
                            <option>1 Guest</option>
                            <option>2 Guests</option>
                            <option>4 Guests + Security Detail</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-[#d4af37]/10 rounded border border-[#d4af37]/20">
                        <input type="checkbox" id="diplomatic-immunity" className="accent-[#d4af37]" />
                        <label htmlFor="diplomatic-immunity" className="text-xs text-[#d4af37] flex items-center gap-1 cursor-pointer">
                            <Briefcase size={12} /> Claim Diplomatic Status (Vienna Convention)
                        </label>
                    </div>

                    <button 
                        type="button" 
                        onClick={() => alert('Secure booking initiated. Please complete identity verification in the backend integration.')}
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} /> Inititate Secure Booking
                    </button>
                    
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '12px' }}>
                        You won't be charged yet. Identity verification required next.
                    </p>
                </form>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyDetailModal;
