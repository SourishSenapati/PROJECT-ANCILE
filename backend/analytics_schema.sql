-- PHASE 8: THE DATA MOAT
-- SQL Schema for Cross-Event Identity and Demand Analytics
-- To be run in Snowflake (or PostgreSQL for prototype)
-- 1. THE EVENT GRAPH (IDENTITY RESOLUTION)
-- Creates a 'Golden Record' for high-value guests across multiple weddings.
CREATE TABLE IF NOT EXISTS guest_identity_graph (
    global_guest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_email VARCHAR(255) UNIQUE,
    secondary_emails ARRAY,
    -- Snowflake supports ARRAY, Postgres too (text[])
    phone_number VARCHAR(50),
    -- Valuable Metadata
    total_lifetime_spend DECIMAL(10, 2) DEFAULT 0.00,
    total_events_attended INT DEFAULT 0,
    no_show_rate DECIMAL(3, 2) DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 2. CROSS-EVENT LINKAGE TABLE
-- Maps specific event bookings to the global identity
CREATE TABLE IF NOT EXISTS event_guest_map (
    event_id VARCHAR(50),
    -- e.g. "WED-DXB-2026"
    local_guest_id VARCHAR(50),
    global_guest_id UUID REFERENCES guest_identity_graph(global_guest_id),
    -- Event Specifics
    spend_at_event DECIMAL(10, 2),
    did_attend BOOLEAN,
    PRIMARY KEY (event_id, local_guest_id)
);
-- 3. DEMAND HEATMAP (ANALYTICS VIEW)
-- used by Mapbox Dashboard to warn Execs
CREATE VIEW view_demand_vs_inventory AS
SELECT l.country,
    l.city,
    l.month_year,
    -- e.g. '2026-06'
    -- Demand Signal (from guest lists uploaded to Privacy Shield)
    COUNT(DISTINCT egm.global_guest_id) as unique_guest_demand,
    SUM(gig.total_lifetime_spend) as potential_wallet_share,
    -- Supply Signal (from TBO Inventory)
    i.total_contracted_rooms,
    i.avg_contracted_rate,
    -- The Insight
    (COUNT(DISTINCT egm.global_guest_id) * 0.8) - i.total_contracted_rooms as supply_gap_alert
FROM event_locations l
    JOIN event_guest_map egm ON l.event_id = egm.event_id
    JOIN guest_identity_graph gig ON egm.global_guest_id = gig.global_guest_id
    LEFT JOIN tbo_inventory_supply i ON l.city_id = i.city_id
GROUP BY l.country,
    l.city,
    l.month_year;