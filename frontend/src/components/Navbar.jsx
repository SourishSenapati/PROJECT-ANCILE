import React from 'react';
import { Wallet, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
  const navLinkStyle = {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  };

  const buttonStyle = {
    background: 'var(--gold-primary)',
    color: '#000',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 48px',
      background: 'rgba(5, 5, 5, 0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      boxSizing: 'border-box'
    }}>
      <Link to="/" style={{
        color: 'var(--gold-primary)',
        fontSize: '1.5rem',
        fontWeight: '700',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Shield size={24} /> Ancile
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a href="#inventory" style={navLinkStyle} 
           onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Sanctuaries
        </a>
        <Link to="/admin" style={navLinkStyle}
           onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Partner Access
        </Link>
        <button 
            onClick={() => {
                const rewardsSection = document.getElementById('rewards');
                if (rewardsSection) {
                    rewardsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }}
            style={buttonStyle}>
          <Wallet size={16} />
          <span>Membership</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
