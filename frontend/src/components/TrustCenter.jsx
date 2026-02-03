import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Globe, Server, AlertCircle } from 'lucide-react';

const TrustCenter = () => {
    const [hoveredBadge, setHoveredBadge] = useState(null);

    const BADGES = [
        { id: 1, label: "ISO 27001", icon: ShieldCheck, status: "Certified", color: "#2ECC71", desc: "Information Security Management System.", longDesc: "Our ISMS ensures the highest level of security for all customer data and internal processes." },
        { id: 2, label: "GDPR Compliant", icon: Globe, status: "Active", color: "#3498DB", desc: "Full data sovereignty for EU citizens.", longDesc: "Complete data portability and right-to-be-forgotten protocols implemented across all nodes." },
        { id: 3, label: "SOC 2 Type II", icon: Server, status: "Audited", color: "#9B59B6", desc: "Service organization control audit passed.", longDesc: "Independent audit verifies our control over security, availability, and confidentiality." },
        { id: 4, label: "PrivacyShield™", icon: Lock, status: "Live", color: "#D4AF37", desc: "Proprietary AI defense matrix (APT-1).", longDesc: "Real-time AI-driven monitoring detects and neutralizes privacy threats at the edge." }
    ];

    return (
        <section className="bg-black py-24 border-t border-white/5 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>

            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
                                <ShieldCheck className="text-[#d4af37]" size={20} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-0">Global Trust Center</h2>
                        </div>
                        <p className="text-gray-400 max-w-lg leading-relaxed">
                            Transparency is our currency. Real-time compliance monitoring 
                            and security posture for all Ancile assets. Verified by independent auditors.
                        </p>
                    </div>
                     <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-green-500/5 border border-green-500/20 rounded-full text-green-500 text-sm font-bold tracking-tight">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                            ALL SYSTEMS OPERATIONAL
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono">LAST SCAN: {new Date().toLocaleTimeString()} UTC</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BADGES.map((badge) => (
                        <motion.div 
                            key={badge.id}
                            onHoverStart={() => setHoveredBadge(badge.id)}
                            onHoverEnd={() => setHoveredBadge(null)}
                            whileHover={{ y: -5 }}
                            className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl relative overflow-hidden group glass-card hover:border-[#d4af37]/30 transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-xl bg-black/40 border border-white/5 transition-transform group-hover:scale-110 duration-500">
                                    <badge.icon size={24} style={{ color: badge.color }} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: badge.color }}>{badge.status}</span>
                                    <div className="h-1 w-8 rounded-full" style={{ backgroundColor: badge.color, opacity: 0.3 }}></div>
                                </div>
                            </div>
                            
                            <h3 className="text-white font-bold text-lg mb-3">{badge.label}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                {badge.desc}
                            </p>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Verified by Ancile Core</span>
                                <Check size={14} className="text-green-500" />
                            </div>
                            
                            {/* Hover Expansion Effect */}
                            <AnimatePresence>
                                {hoveredBadge === badge.id && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute inset-x-0 bottom-0 bg-[#121214] border-t border-[#d4af37]/40 p-6 z-20"
                                    >
                                        <p className="text-xs text-gray-300 leading-relaxed italic">
                                            "{badge.longDesc}"
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-wrap justify-center gap-8 text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                        <a href="#" className="hover:text-[#d4af37] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#d4af37] transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-[#d4af37] transition-colors">Bug Bounty Program</a>
                        <a href="#" className="hover:text-[#d4af37] transition-colors">System Archive</a>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-2 text-right">
                        <div className="text-[11px] text-gray-500 font-bold tracking-[0.2em] mb-1">
                            © 2026 ANCILE GLOBAL DEFENSE. ALL RIGHTS ENCRYPTED.
                        </div>
                        <div className="flex gap-2">
                             {[1,2,3,4].map(i => <div key={i} className="w-1 h-3 bg-white/10 rounded-full"></div>)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustCenter;
