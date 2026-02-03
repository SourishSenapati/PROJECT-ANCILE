import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart2, Calendar, Link as LinkIcon, Plus, Copy } from 'lucide-react';

const EVENTS = [
    {
        id: "evt_001",
        name: "Spectre Summit 2026",
        dates: "15 Jan - 20 Jan",
        allotted: 450,
        booked: 312,
        revenue: 1450000,
        status: "Active"
    },
    {
        id: "evt_002",
        name: "Royale-Vesper Wedding",
        dates: "14 Feb - 16 Feb",
        allotted: 120,
        booked: 98,
        revenue: 850000,
        status: "Locked"
    },
    {
        id: "evt_003",
        name: "G20 Delegations",
        dates: "01 Mar - 05 Mar",
        allotted: 2000,
        booked: 450,
        revenue: 3200000,
        status: "Draft"
    }
];

const GroupManager = () => {
    const [events, setEvents] = useState(EVENTS);

    return (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-8 mb-12">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Users className="text-[#d4af37]" /> Group & Event Inventory
                    </h3>
                    <p className="text-gray-400 max-w-2xl">
                        Digitize offline spreadsheets. Manage allocations, room blocks, and P&L for MICE and Weddings.
                    </p>
                </div>
                <button className="px-4 py-2 bg-[#d4af37] text-black font-bold rounded flex items-center gap-2 hover:bg-[#e5c14b] transition-colors">
                    <Plus size={16} /> Create New Event
                </button>
            </div>

            <div className="grid gap-6">
                {events.map((evt) => (
                    <motion.div 
                        key={evt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            {/* Event Info */}
                            <div className="md:col-span-4">
                                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[#d4af37] transition-colors">{evt.name}</h4>
                                <div className="text-xs text-gray-400 flex items-center gap-2">
                                    <Calendar size={12} /> {evt.dates}
                                    <span className="text-gray-600">|</span>
                                    <span className="font-mono">{evt.id}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="md:col-span-5 flex justify-between gap-8 border-r border-white/10 pr-8">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Utilization</div>
                                    <div className="text-2xl font-mono text-white">
                                        {Math.round((evt.booked / evt.allotted) * 100)}%
                                    </div>
                                    <div className="text-xs text-gray-400">{evt.booked} / {evt.allotted} rooms</div>
                                </div>
                                
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Projected Rev</div>
                                    <div className="text-2xl font-mono text-[#d4af37]">
                                        ${(evt.revenue / 1000000).toFixed(2)}M
                                    </div>
                                    <div className="text-xs text-gray-400">Locked Rate</div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                                    <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                        evt.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                        evt.status === 'Locked' ? 'bg-red-500/10 text-red-500' :
                                        'bg-gray-500/10 text-gray-400'
                                    }`}>
                                        {evt.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-3 flex flex-col gap-2">
                                <button className="w-full py-2 bg-transparent border border-white/20 rounded text-sm text-gray-300 hover:text-white hover:border-white transition-colors flex items-center justify-center gap-2">
                                    <BarChart2 size={14} /> View Analytics
                                </button>
                                <button className="w-full py-2 bg-transparent border border-[#d4af37]/30 rounded text-sm text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors flex items-center justify-center gap-2">
                                    <LinkIcon size={14} /> Microsite URL
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-200" 
                                style={{ width: `${(evt.booked / evt.allotted) * 100}%` }}
                            ></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GroupManager;
