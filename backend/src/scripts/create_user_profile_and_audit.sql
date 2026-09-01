-- Migration: create_user_profile_and_audit.sql
-- Create application-specific user profile table linked to Clerk user ID
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY,                -- Clerk user ID (stable identifier)
    preferences JSONB DEFAULT '{}'::jsonb,   -- Arbitrary user preferences, UI settings, etc.
    metadata JSONB DEFAULT '{}'::jsonb,      -- Additional app‑specific fields (e.g., role overrides, custom flags)
    status TEXT NOT NULL DEFAULT 'active',   -- active | suspended
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to update "updated_at" on row change
CREATE OR REPLACE FUNCTION update_user_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_profile_timestamp ON user_profiles;
CREATE TRIGGER trg_user_profile_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_user_profile_timestamp();

-- Audit log table for admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id TEXT NOT NULL,            -- Clerk ID of the admin performing the action
    target_user_id TEXT NOT NULL,           -- Clerk ID of the user being acted upon
    action TEXT NOT NULL,                   -- e.g., 'role_change', 'suspend', 'reactivate', 'delete', 'profile_update'
    old_value JSONB,
    new_value JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles (status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs (target_user_id);
