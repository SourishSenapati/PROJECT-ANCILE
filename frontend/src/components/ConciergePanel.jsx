import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Wifi, Stethoscope, Shield, CheckCircle } from 'lucide-react';

const SERVICES = [
    {
        id: 'transport',
        title: 'Armored Transit',
        icon: Car,
        options: [
            { name: 'Mercedes-Maybach S680 Guard', price: 2500, desc: 'VR10 Ballistic Protection' },
            { name: 'Sikorsky S-76 Helilift', price: 5000, desc: 'Direct rooftop landing' }
        ]
    },
    {
        id: 'comms',
        title: 'Secure Connectivity',
        icon: Wifi,
        options: [
            { name: 'Starlink Maritime', price: 500, desc: 'Low-latency satellite link' },
            { name: 'Quantum Key Distribution', price: 1200, desc: 'Unbreakable encryption channel' }
        ]
    },
    {
        id: 'wellness',
        title: 'Bio-Hacking Suite',
        icon: Stethoscope,
        options: [
            { name: 'Hyperbaric Chamber', price: 300, desc: 'Oxygen therapy session' },
            { name: 'IV Nutrient Drip', price: 250, desc: 'Custom compounds on arrival' }
        ]
    }
];

const ConciergePanel = () => {
    const [selected, setSelected] = useState({});

    const toggleOption = (catId, optName) => {
        setSelected(prev => ({
            ...prev,
            [`${catId}-${optName}`]: !prev[`${catId}-${optName}`]
        }));
    };

    return (
        <div className="animate-fade-in">
            <h3 className="text-white mb-6 flex items-center gap-2">
                <Shield className="text-[#d4af37]" size={20} /> 
                7-Star Concierge Add-ons
            </h3>
            
            <div className="space-y-6">
                {SERVICES.map((cat) => (
                    <div key={cat.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-4 text-[#d4af37]">
                            <cat.icon size={20} />
                            <h4 className="font-semibold text-lg">{cat.title}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cat.options.map((opt) => {
                                const isSelected = selected[`${cat.id}-${opt.name}`];
                                return (
                                    <div 
                                        key={opt.name}
                                        onClick={() => toggleOption(cat.id, opt.name)}
                                        className={`cursor-pointer border rounded-lg p-3 transition-all ${isSelected ? 'bg-[#d4af37]/20 border-[#d4af37]' : 'bg-black/20 border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-white font-medium text-sm">{opt.name}</span>
                                            {isSelected && <CheckCircle size={14} className="text-[#d4af37]" />}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">{opt.desc}</p>
                                        <div className="text-[#d4af37] text-sm font-mono">+${opt.price}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-lg text-center">
                <p className="text-[#d4af37] text-sm">
                    Total Concierge Value: <span className="font-bold text-white text-lg ml-2">
                        ${Object.keys(selected).filter(k => selected[k]).reduce((acc, key) => {
                            // Find price (quick hack for demo)
                            const name = key.split('-')[1];
                            let price = 0;
                            SERVICES.forEach(c => c.options.forEach(o => { if(o.name === name) price = o.price }));
                            return acc + price;
                        }, 0).toLocaleString()}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ConciergePanel;
