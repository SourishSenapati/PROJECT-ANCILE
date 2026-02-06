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
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left: Details */}
            <div className="flex-[2] p-6 md:p-8 overflow-y-auto custom-scrollbar">
                {/* Tabs */}
                <div className="flex gap-4 md:gap-6 border-b border-white/10 mb-6 md:mb-8 overflow-x-auto pb-1 scrollbar-hide">
                    {['Overview', 'Security Specs', 'Concierge', 'Reviews'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                            className={`pb-4 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${
                                activeTab === tab.toLowerCase().split(' ')[0] 
                                    ? 'text-[#d4af37] border-b-2 border-[#d4af37]' 
                                    : 'text-gray-500 hover:text-white'
                            }`}
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
                            <h3 className="text-white text-lg font-bold mb-4">Sanctuary Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
                                {room.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
                                        <Check size={16} className="text-[#d4af37]" />
                                        <span className="text-gray-300 text-sm">{feat}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <h3 className="text-white text-lg font-bold mb-4">About this Fortress</h3>
                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
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
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
                                <Shield size={24} className="text-red-500 shrink-0" />
                                <div>
                                    <h4 className="text-white font-bold text-sm m-0">Clearance Level 5 Required</h4>
                                    <p className="text-gray-400 text-xs m-0">Only approved members can book this asset.</p>
                                </div>
                            </div>

                            <h3 className="text-white mb-4">Defense Capabilities</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <span className="text-gray-400 text-sm">Parameter Surveillance</span>
                                    <span className="text-green-500 text-sm font-mono">Active (AI)</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <span className="text-gray-400 text-sm">Ballistic Rating</span>
                                    <span className="text-white text-sm font-mono">BR6 (Glass/Walls)</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <span className="text-gray-400 text-sm">Cyber Shield</span>
                                    <span className="text-white text-sm font-mono">Air-Gapped Network</span>
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
                            <div className="mb-6">
                                <div className="text-4xl font-bold text-white">4.92</div>
                                <div className="text-gray-500 text-sm">Based on 12 verified stays</div>
                            </div>
                            
                            {[1, 2].map((review) => (
                                <div key={review} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d4af37]">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">Verified Diplomat</div>
                                            <div className="text-gray-500 text-xs">Oct 2025</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 italic text-sm">
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
            <div className="flex-1 bg-[#0a0a0c] p-6 md:p-8 border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-2xl font-bold text-white">${room.price}</span>
                        <span className="text-gray-500 text-sm"> / night</span>
                    </div>
                </div>

                <div className="mb-6 p-3 bg-[#d4af37]/5 rounded-lg border border-[#d4af37]/10 flex items-center gap-3">
                    <Activity size={16} className="text-green-500 shrink-0" />
                    <span className="text-xs text-[#d4af37]">APT-1 Risk Assessment: <strong>Passed</strong></span>
                </div>

                <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-500 text-[10px] tracking-wider mb-2">CHECK-IN</label>
                            <input type="date" className="p-3 bg-white/5 border border-white/10 rounded text-white w-full text-xs focus:border-[#d4af37] focus:outline-none" />
                        </div>
                         <div>
                            <label className="block text-gray-500 text-[10px] tracking-wider mb-2">CHECK-OUT</label>
                            <input type="date" className="p-3 bg-white/5 border border-white/10 rounded text-white w-full text-xs focus:border-[#d4af37] focus:outline-none" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-gray-500 text-[10px] tracking-wider mb-2">GUESTS</label>
                        <select className="p-3 bg-white/5 border border-white/10 rounded text-white w-full text-xs focus:border-[#d4af37] focus:outline-none appearance-none">
                            <option>1 Guest</option>
                            <option>2 Guests</option>
                            <option>4 Guests + Security Detail</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-[#d4af37]/10 rounded border border-[#d4af37]/20 transition-colors hover:bg-[#d4af37]/20">
                        <input type="checkbox" id="diplomatic-immunity" className="accent-[#d4af37] w-4 h-4 cursor-pointer" />
                        <label htmlFor="diplomatic-immunity" className="text-xs text-[#d4af37] flex items-center gap-1 cursor-pointer select-none font-medium">
                            <Briefcase size={12} /> Claim Diplomatic Status
                        </label>
                    </div>

                    <button 
                        type="button" 
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/identity/verify', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        guest_name: 'Verified Diplomat',
                                        passport_number: 'N-7829-X',
                                        id_type: 'Diplomatic Passport'
                                    })
                                });
                                const data = await response.json();
                                alert(`Identity Verification: ${data.status.toUpperCase()}\nRisk Level: ${data.risk_assessment}\nFacial Match: ${(data.facial_match_probability * 100).toFixed(2)}%`);
                                if (data.status === 'passed') {
                                    alert('Secure Booking Authorized. Proceeding to encrypted checkout...');
                                }
                            } catch (error) {
                                console.error('Verification failed:', error);
                                alert('Identity Verification Node Offline. Retrying secure link...');
                            }
                        }}
                        className="btn-primary w-full mt-4 flex justify-center items-center gap-2 py-4 text-sm font-bold tracking-wide"
                    >
                        <Lock size={16} /> INITIATE SECURE BOOKING
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-600 mt-2">
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
