import React from 'react';
import { Activity } from 'lucide-react';

const LiveTicker = () => {
    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'var(--bg-panel)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            zIndex: 90
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={14} color="var(--success-emerald)" />
                <span>LIVE: User 0x7a... just secured a room (2s ago)</span>
            </div>
            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
            <div>Inventory Locked: <span style={{ color: 'var(--gold-primary)' }}>84%</span></div>
            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
            <div>APT-1 Risk Analysis: <span style={{ color: 'var(--success-emerald)' }}>Active</span></div>
        </div>
    );
};

export default LiveTicker;
