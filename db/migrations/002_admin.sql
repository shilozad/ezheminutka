CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL CHECK (username = lower(username)),
  display_name VARCHAR(120) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('SUPERADMIN', 'LOCATION_ADMIN')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  session_version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_user_locations (
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  location_id VARCHAR(32) NOT NULL REFERENCES locations(slug) ON DELETE CASCADE,
  PRIMARY KEY (admin_user_id, location_id)
);

ALTER TABLE bookings
  ADD COLUMN source VARCHAR(20) NOT NULL DEFAULT 'PUBLIC'
    CHECK (source IN ('PUBLIC', 'ADMIN')),
  ADD COLUMN created_by_admin_id UUID NULL REFERENCES admin_users(id) ON DELETE SET NULL,
  ALTER COLUMN consent_at DROP NOT NULL;
