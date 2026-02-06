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

const WorldMap = ({ onSelectLocation }) => {
    return (
        <section className="py-12 sm:py-24 relative overflow-hidden bg-black">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mb-8 sm:mb-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8">
                    <div className="text-left">
                        <h2 
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                        >
                            Global Sanctuary Network
                        </h2>
                        <p className="text-gray-400 max-w-xl text-sm sm:text-base">
                            A distributed network of 142 hardened properties across 38 countries.
                            Connected by encrypted satellite links. Click a node to inspect.
                        </p>
                    </div>
                    <div className="hidden md:grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono">
                        {LOCATIONS.map(loc => (
                            <div key={loc.id} className="flex items-center gap-2 text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                                <span className="text-white">{loc.city}</span>
                                <span className="opacity-50">• Safe</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative w-full max-w-[1200px] mx-auto aspect-[16/9] bg-[#0a0a0c] rounded-3xl border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] gloss-effect group/map">
                {/* Scanner Effect */}
                <div className="scan-line"></div>
                
                {/* Abstract Map Background */}
                <div className="absolute inset-0 opacity-[0.15]" 
                    style={{ 
                        backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'invert(1) grayscale(1)'
                    }}
                ></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0" style={{ 
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>

                {/* Nodes */}
                {LOCATIONS.map((loc) => (
                    <div 
                        key={loc.id}
                        onClick={() => onSelectLocation && onSelectLocation(loc.city)}
                        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                        style={{ top: loc.y, left: loc.x }}
                    >
                        <div className="relative flex items-center justify-center w-full h-full">
                            {/* Pinging Rings */}
                            <div 
                                className="absolute w-12 h-12 rounded-full border border-[#d4af37]/30 animate-ping"
                                style={{ animationDuration: '3s' }}
                            ></div>
                            
                            <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-[0_0_15px_#d4af37] z-10 transition-transform group-hover:scale-150"></div>
                            
                            {/* Detailed Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20 pointer-events-none sm:pointer-events-auto">
                                <div className="bg-[#121214] border border-[#d4af37]/40 p-3 rounded-lg shadow-2xl backdrop-blur-md min-w-[140px]">
                                    <div className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase mb-1">Status: Operational</div>
                                    <div className="text-white font-bold text-sm mb-2">{loc.city} Sanctuary</div>
                                    <div className="flex gap-1">
                                        {[1,2,3].map(i => <div key={i} className="h-1 flex-1 bg-green-500/40 rounded-full"></div>)}
                                    </div>
                                    <div className="text-[9px] text-gray-500 mt-2 font-mono">CLICK TO INSPECT</div>
                                </div>
                                <div className="w-3 h-3 bg-[#121214] border-r border-b border-[#d4af37]/40 rotate-45 mx-auto -mt-1.5"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Mobile Location List (Fallback) */}
            <div className="md:hidden mt-8 px-6 grid grid-cols-2 gap-4">
                 {LOCATIONS.map(loc => (
                    <button 
                        key={loc.id}
                        onClick={() => onSelectLocation && onSelectLocation(loc.city)}
                        className="p-3 bg-white/5 border border-white/10 rounded-lg text-left text-sm text-gray-300 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all flex items-center justify-between"
                    >
                        {loc.city}
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </button>
                ))}
            </div>
        </section>
    );
};
export default WorldMap;
