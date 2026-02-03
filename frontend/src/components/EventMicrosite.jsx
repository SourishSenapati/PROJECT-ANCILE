import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Clock, FileText, CheckCircle, Shield } from 'lucide-react';
import InventoryGrid from './InventoryGrid';

// Mock Data for a Specific Event
const EVENT_DATA = {
    id: "evt_davos_2026",
    name: "The Davos Secure Summit 2026",
    host: "Global Economic Forum",
    dates: "Jan 15 - Jan 20, 2026",
    location: "Davos-Klosters, Switzerland",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Globe.svg/1200px-Globe.svg.png", // Placeholder
    description: "Exclusive lodging arrangements for summit delegates. All properties within the Secure Zone (Sector 4).",
    itinerary: [
        { day: "Day 1", time: "18:00", event: "Welcome Gala at The Belvedere" },
        { day: "Day 2", time: "09:00", event: "Opening Plenary: Global Resilience" },
        { day: "Day 3", time: "14:00", event: "Strategic Breakout Sessions" }
    ]
};

const EventMicrosite = () => {
    // We reuse the InventoryGrid but in a real app we'd pass a "filter" prop or specific data
    // For demo purposes, we wrap it with event branding
    
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24">
            {/* Event Header / Hero */}
            <section className="relative px-6 max-w-[1440px] mx-auto mb-16">
                <div className="absolute top-0 right-0 p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-[#d4af37] text-sm font-bold uppercase tracking-widest">
                        <Shield size={16} /> Ancile Secured Event
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-end gap-8 border-b border-white/10 pb-12"
                >
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                        {/* Simulated Logo */}
                        <Globe className="text-black" size={48} />
                    </div>
                    <div>
                        <h1 className="text-5xl font-bold mb-4 font-['Outfit']">{EVENT_DATA.name}</h1>
                        <div className="flex flex-wrap gap-6 text-gray-400">
                            <span className="flex items-center gap-2"><Calendar size={18} /> {EVENT_DATA.dates}</span>
                            <span className="flex items-center gap-2"><MapPin size={18} /> {EVENT_DATA.location}</span>
                            <span className="flex items-center gap-2"><Users size={18} /> Delegate Access Only</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Main Content Grid */}
            <div className="px-6 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left: Itinerary & Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 px-0">
                            <FileText className="text-[#d4af37]" /> Event Instructions
                        </h3>
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                            {EVENT_DATA.description}
                        </p>
                        <ul className="space-y-4">
                            {EVENT_DATA.itinerary.map((item, i) => (
                                <li key={i} className="flex gap-4 border-l-2 border-[#d4af37]/30 pl-4 py-1">
                                    <div className="text-[#d4af37] font-mono text-xs w-12 pt-1">{item.day}</div>
                                    <div>
                                        <div className="font-semibold">{item.event}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock size={10} /> {item.time}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl text-center">
                        <CheckCircle className="mx-auto text-[#d4af37] mb-3" size={32} />
                        <h4 className="font-bold mb-2">Group Rate Applied</h4>
                        <p className="text-xs text-gray-400">
                            Your inventory is locked. Negotiated rates are 40% below public listings.
                        </p>
                    </div>
                </div>

                {/* Right: Inventory Selection */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Select Your Accommodation</h2>
                        <div className="text-sm text-gray-500">Showing allotted inventory for <span className="text-white">Delegates</span></div>
                    </div>
                    
                    {/* We render the inventory grid here. In a real app, we'd pass a prop like `eventId="davos_2026"` 
                        to filter only the rooms allocated to this event. */}
                    <InventoryGrid onBook={() => {}} />
                </div>

            </div>
        </div>
    );
};

export default EventMicrosite;
