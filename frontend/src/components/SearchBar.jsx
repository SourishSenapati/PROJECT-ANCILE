import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch }) => {
    const [location, setLocation] = useState('');
    
    return (
        <div 
            className="glass-card"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                maxWidth: '900px',
                margin: '-40px auto 60px', /* Negative margin to overlap Hero */
                position: 'relative',
                zIndex: 20
            }}
        >
            <div style={{ flex: 1.5, position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                <input 
                    type="text" 
                    placeholder="Where do you crave safety?" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        padding: '14px 14px 14px 48px',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                 <input 
                    type="text" 
                    placeholder="Dates" 
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => e.target.type = 'text'}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        padding: '14px 14px 14px 48px',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ flex: 0.8, position: 'relative' }}>
                <Users size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                 <input 
                    type="number" 
                    placeholder="Guest" 
                    min={1}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        padding: '14px 14px 14px 48px',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
            </div>

            <button 
                className="btn-primary"
                style={{ height: '50px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => onSearch && onSearch(location)}
            >
                <Search size={20} />
                <span>Search</span>
            </button>
        </div>
    );
};

export default SearchBar;
