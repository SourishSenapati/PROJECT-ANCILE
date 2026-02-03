import React from 'react';
import { motion } from 'framer-motion';

const LOCATIONS = [
    { id: 1, x: '20%', y: '30%', city: 'New York' },
    { id: 2, x: '48%', y: '25%', city: 'London' },
    { id: 3, x: '55%', y: '40%', city: 'Dubai' },
    { id: 4, x: '85%', y: '35%', city: 'Tokyo' },
    { id: 5, x: '50%', y: '32%', city: 'Zurich' },
    { id: 6, x: '82%', y: '75%', city: 'Sydney' },
    { id: 7, x: '15%', y: '65%', city: 'Santiago' }
];

const WorldMap = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 text-center mb-16">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Global Sanctuary Network
                </motion.h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    A distributed network of 142 hardened properties across 38 countries.
                    Connected by encrypted satellite links.
                </p>
            </div>

            <div className="relative w-full max-w-[1200px] mx-auto aspect-[16/9] bg-[#0f0f12] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                {/* Abstract Map Background */}
                <div className="absolute inset-0 opacity-20" 
                    style={{ 
                        backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'invert(1) grayscale(1)'
                    }}
                ></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>

                {/* Nodes */}
                {LOCATIONS.map((loc) => (
                    <div 
                        key={loc.id}
                        className="absolute w-4 h-4"
                        style={{ top: loc.y, left: loc.x }}
                    >
                        <div className="relative flex items-center justify-center">
                            <motion.div 
                                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: loc.id * 0.2 }}
                                className="absolute w-8 h-8 rounded-full bg-[#d4af37]/20"
                            ></motion.div>
                             <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: loc.id * 0.2 }}
                                className="absolute w-4 h-4 rounded-full bg-[#d4af37]/40"
                            ></motion.div>
                            <div className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]"></div>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/80 border border-white/10 px-3 py-1 rounded text-xs whitespace-nowrap text-[#d4af37]">
                                {loc.city} • Safe
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WorldMap;
