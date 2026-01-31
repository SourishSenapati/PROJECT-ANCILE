-- Phase 0: The Infrastructure & Data Foundation
-- Instruction Set 0.1: Database Schema Design (PostgreSQL)
-- ENTITY: GROUPS (The Wedding/Event)
-- Represents the core event container that holds inventory and revenue.
CREATE TABLE groups (
    id UUID PRIMARY KEY,
    agent_id UUID NOT NULL,
    -- Links to the travel agent managing this group
    name VARCHAR(255) NOT NULL,
    -- e.g., "Smith Wedding"
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    -- e.g., "smith2026", used for the guest-facing landing page
    event_date DATE NOT NULL,
    total_revenue_held DECIMAL(10, 2) DEFAULT 0.00,
    -- The Float: Total cash collected/held before settlement
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'SETTLED', 'ARCHIVED')) -- Lifecycle status
);
-- ENTITY: INVENTORY_BLOCKS (The "Shielded" Rooms)
-- Manages the specific allocations of rooms from a hotel API (e.g., TBO).
-- Includes a critical CHECK constraint to enforce atomic inventory locking.
CREATE TABLE inventory_blocks (
    id UUID PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    tbo_hotel_id VARCHAR(50) NOT NULL,
    -- External API ID for the hotel
    room_type_code VARCHAR(50) NOT NULL,
    -- Specific room type identifier
    total_allocated INT NOT NULL,
    -- The hard limit of rooms negotiated
    total_booked INT DEFAULT 0,
    -- Current count of booked rooms
    markup_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    -- Agent's added margin percentage
    release_date DATE NOT NULL,
    -- Date when unbooked inventory must be released
    CONSTRAINT check_inventory_limit CHECK (total_booked <= total_allocated) -- CRITICAL: Prevents overbooking at the schema level
);
-- ENTITY: GUESTS (The Data Goldmine)
-- Stores guest details and links them to the prediction engine.
CREATE TABLE guests (
    id UUID PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    origin_city VARCHAR(100),
    -- Critical input feature for APT-1 Prediction Model
    is_confirmed BOOLEAN DEFAULT FALSE,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (
        payment_status IN ('PENDING', 'PAID_HELD', 'SETTLED')
    ),
    -- Tracks the flow of funds
    apt1_cancellation_risk_score DECIMAL(3, 2) -- AI Prediction Score: 0.00 (Low Risk) to 1.00 (High Risk)
);
-- INDEXES
-- Optimization for common lookup patterns
CREATE INDEX idx_groups_subdomain ON groups(subdomain);
CREATE INDEX idx_inventory_blocks_group_id ON inventory_blocks(group_id);
CREATE INDEX idx_guests_group_id ON guests(group_id);
CREATE INDEX idx_guests_email ON guests(email);