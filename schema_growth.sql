-- Phase 6: Growth & Viral Loop Schema Updates
-- ENTITY: AGENTS (The Users)
-- We need to track who referred whom to calculate the 0.5% override.
CREATE TABLE agents (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    stripe_connect_id VARCHAR(100),
    -- For payouts
    referred_by UUID REFERENCES agents(id),
    -- The Viral Link
    total_volume DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ENTITY: COMMISSIONS (Tracking Growth)
CREATE TABLE commission_ledger (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    -- Who gets paid
    source_agent_id UUID REFERENCES agents(id),
    -- From whose volume (if override)
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('DIRECT_MARKUP', 'REFERRAL_OVERRIDE')),
    status VARCHAR(20) DEFAULT 'PENDING',
    -- PENDING, PAID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- INDEXES for Reporting
CREATE INDEX idx_agents_referred_by ON agents(referred_by);
CREATE INDEX idx_commissions_agent_id ON commission_ledger(agent_id);