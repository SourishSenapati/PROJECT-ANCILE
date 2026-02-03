import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AIHologram = () => {
    // Simulated realtime data points
    const [points, setPoints] = useState([]);

    useEffect(() => {
        // Generate initial points on a sphere
        const pts = [];
        const numPoints = 40;
        for (let i = 0; i < numPoints; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 100; // Radius

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            pts.push({ x, y, z, id: i });
        }
        setPoints(pts);
    }, []);

    return (
        <div className="relative w-[300px] h-[300px] mx-auto perspective-1000">
            <motion.div 
                animate={{ rotateY: 360, rotateX: 10 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-full h-full relative transform-style-3d"
            >
                {/* Core Halo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#d4af37]/20 rounded-full blur-xl animate-pulse"></div>

                {/* Nodes */}
                {points.map((pt) => (
                    <div
                        key={pt.id}
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white"
                        style={{
                            transform: `translate3d(${pt.x}px, ${pt.y}px, ${pt.z}px)`,
                            opacity: (pt.z + 100) / 200, // Depth cue
                            boxShadow: '0 0 10px #d4af37'
                        }}
                    >
                        {/* Connecting Lines (Simulated via adjacent divs for a few nodes) */}
                        {pt.id % 5 === 0 && (
                            <div className="absolute top-0 left-0 w-[50px] h-[1px] bg-white/20 transform origin-left rotate-45"></div>
                        )}
                    </div>
                ))}
            </motion.div>
            
            {/* HUD Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-[280px] h-[280px] border border-[#d4af37]/30 rounded-full border-dashed animate-[spin_60s_linear_infinite]"></div>
                 <div className="absolute w-[250px] h-[250px] border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
            </div>
            
            <div className="absolute bottom-0 text-center w-full">
                <div className="text-[#d4af37] text-xs font-mono tracking-widest">NEURAL CORE ACTIVE</div>
            </div>
        </div>
    );
};

export default AIHologram;
