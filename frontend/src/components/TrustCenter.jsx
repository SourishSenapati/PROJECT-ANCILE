import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Globe, Server, AlertCircle } from 'lucide-react';

const TrustCenter = () => {
    const [hoveredBadge, setHoveredBadge] = useState(null);

    const BADGES = [
        { id: 1, label: "ISO 27001", icon: ShieldCheck, status: "Certified", color: "#2ECC71", desc: "Information Security Management System." },
        { id: 2, label: "GDPR Compliant", icon: Globe, status: "Active", color: "#3498DB", desc: "Full data sovereignty for EU citizens." },
        { id: 3, label: "SOC 2 Type II", icon: Server, status: "Audited", color: "#9B59B6", desc: "Service organization control audit passed." },
        { id: 4, label: "PrivacyShield™", icon: Lock, status: "Live", color: "#D4AF37", desc: "Proprietary AI defense matrix (APT-1)." }
    ];

    return (
        <section className="border-t border-white/5 bg-[#080808] py-16 mt-24">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <Lock className="text-[#d4af37]" /> Global Trust Center
                        </h2>
                        <p className="text-gray-500 max-w-lg">
                            Transparency is our currency. Real-time compliance monitoring 
                            and security posture for all Ancile assets.
                        </p>
                    </div>
                     <div className="mt-6 md:mt-0 flex items-center gap-2 px-4 py-2 bg-green-900/10 border border-green-500/20 rounded-full text-green-500 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        All Systems Operational
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BADGES.map((badge) => (
                        <motion.div 
                            key={badge.id}
                            onHoverStart={() => setHoveredBadge(badge.id)}
                            onHoverEnd={() => setHoveredBadge(null)}
                            className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <badge.icon size={28} style={{ color: badge.color }} />
                                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: badge.color }}>{badge.status}</span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">{badge.label}</h3>
                            <p className="text-sm text-gray-400">{badge.desc}</p>
                            
                            {/* Hover Reveal Effect */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: hoveredBadge === badge.id ? 1 : 0 }}
                                className="absolute inset-0 bg-black/90 flex items-center justify-center p-6 text-center"
                            >
                                <span className="text-[#d4af37] text-sm font-bold flex items-center gap-2">
                                    <ShieldCheck size={16} /> Verified by Ancile Core
                                </span>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                    <div className="flex gap-6 mb-4 md:mb-0">
                        <a href="#" className="hover:text-[#d4af37]">Privacy Policy</a>
                        <a href="#" className="hover:text-[#d4af37]">Terms of Service</a>
                        <a href="#" className="hover:text-[#d4af37]">Bug Bounty Program</a>
                    </div>
                    <div>
                        © 2026 Ancile Global Defense. All rights encrypted.
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustCenter;
