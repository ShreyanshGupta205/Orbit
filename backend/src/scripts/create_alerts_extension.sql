-- Migration: create_alerts_extension.sql
-- Extend existing alerts table with Clerk role/user targeting & district scope
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS target_role TEXT;
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS target_user_id TEXT;
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS district_id BIGINT REFERENCES districts (id) ON DELETE SET NULL;

-- Per-user alert state tracking table (for individual read/unread and acknowledgement states)
CREATE TABLE IF NOT EXISTS alert_user_states (
    alert_id BIGINT NOT NULL REFERENCES alerts (id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk User ID
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_at TIMESTAMPTZ,
    PRIMARY KEY (alert_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_alert_user_states_user ON alert_user_states (user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_target_role ON alerts (target_role);
CREATE INDEX IF NOT EXISTS idx_alerts_district ON alerts (district_id);
