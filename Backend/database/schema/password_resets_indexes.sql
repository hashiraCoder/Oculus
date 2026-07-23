CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_expiry ON password_resets(expires_at);