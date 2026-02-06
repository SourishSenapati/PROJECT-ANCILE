import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ShieldCheck, Wifi, Coffee, Wind } from 'lucide-react';

const MOCK_PROPERTIES = [
    {
        id: "prop_001",
        name: "Ancile Prime: Palm Jumeirah",
        location: "Dubai, UAE",
        rating: 4.9,
        price: 450,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop",
        tags: ["Sanctuary Certified", "Bulletproof Glass"],
        features: ["Private Beach", "Helipad Access", "Secure Perimeter"]
    },
    {
        id: "prop_002",
        name: "The Obsidian Tower",
        location: "New York, USA",
        rating: 4.8,
        price: 850,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
        tags: ["Diplomat Grade", "Soundproof"],
        features: ["Rooftop Helipad", "Biometric Entry", "City View"]
    },
    {
        id: "prop_003",
        name: "Kyoto Zen Fortress",
        location: "Kyoto, Japan",
        rating: 5.0,
        price: 600,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop",
        tags: ["Heritage Site", "Privacy Shield"],
        features: ["Onsen", "Tea Ceremony", "Hidden Exit"]
    },
    {
        id: "prop_004",
        name: "Alpine Secure Chalet",
        location: "Swiss Alps",
        rating: 4.95,
        price: 1200,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
        tags: ["Nuclear Safe", "Remote"],
        features: ["Ski-in/Ski-out", "Bunker Access", "Satellite Link"]
    }
];

const InventoryGrid = ({ onBook }) => {
    const [filter, setFilter] = useState('All');

    const filteredProperties = MOCK_PROPERTIES.filter(prop => {
        if (filter === 'All') return true;
        if (filter === 'Diplomatic') return prop.tags.includes('Diplomat Grade');
        if (filter === 'Bunker') return prop.tags.includes('Nuclear Safe') || prop.features.includes('Bunker Access');
        if (filter === 'Leisure') return !prop.tags.includes('Nuclear Safe') && !prop.tags.includes('Diplomat Grade');
        return true;
    });

    return (
        <section id="inventory" style={{ position: 'relative', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'white' }}>
                        Curated Sanctuaries
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Hand-picked properties verified for safety, privacy, and luxury.
                    </p>
                </div>
                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '16px' }}>
                     {['All', 'Diplomatic', 'Leisure', 'Bunker'].map(tab => (
                         <button 
                            key={tab} 
                            onClick={() => setFilter(tab)}
                            style={{
                             background: filter === tab ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                             color: filter === tab ? 'black' : 'white',
                             border: 'none',
                             padding: '8px 24px',
                             borderRadius: '50px',
                             cursor: 'pointer',
                             fontWeight: 600,
                             transition: 'all 0.3s ease'
                         }}>
                             {tab}
                         </button>
                     ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                {filteredProperties.map((prop, i) => (
                    <div 
                        key={prop.id}
                        className="glass-card hover-lift"
                        style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => onBook(prop)}
                    >
                        {/* Image Section */}
                        <div style={{ height: '280px', position: 'relative' }}>
                            <img 
                                src={prop.image} 
                                alt={prop.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ 
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)' 
                            }} />
                            
                            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                                <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '4px', color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={12} fill="var(--gold-primary)" stroke="none"/> {prop.rating}
                                </span>
                            </div>

                            <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    {prop.tags.map(tag => (
                                        <span key={tag} style={{ 
                                            background: 'var(--gold-primary)', 
                                            color: 'black', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 700, 
                                            padding: '2px 8px', 
                                            borderRadius: '2px',
                                            textTransform: 'uppercase' 
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>{prop.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <MapPin size={14} /> {prop.location}
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                                {prop.features.map(feat => (
                                    <span key={feat} style={{ 
                                        color: 'var(--text-secondary)', 
                                        fontSize: '0.85rem', 
                                        background: 'rgba(255,255,255,0.05)', 
                                        padding: '6px 12px', 
                                        borderRadius: '50px' 
                                    }}>
                                        {feat}
                                    </span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>STARTING AT</span>
                                    <div style={{ fontSize: '1.5rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                                        ${prop.price}
                                    </div>
                                </div>
                                <button className="btn-primary" style={{ padding: '8px 24px' }}>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default InventoryGrid;
