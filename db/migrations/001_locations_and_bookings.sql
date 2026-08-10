CREATE TABLE locations (
  slug VARCHAR(32) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO locations (slug, name) VALUES
  ('moscow', 'Москва'),
  ('spb', 'Санкт-Петербург'),
  ('kazan', 'Казань')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  public_number VARCHAR(40) UNIQUE NOT NULL,
  location_id VARCHAR(32) NOT NULL REFERENCES locations(slug),
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count >= 1 AND guest_count <= 50),
  visit_type VARCHAR(50) NOT NULL,
  comment TEXT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'NEW'
    CHECK (status IN ('NEW', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
  admin_note TEXT NULL,
  consent_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX bookings_location_id_idx ON bookings (location_id);
CREATE INDEX bookings_visit_date_idx ON bookings (visit_date);
CREATE INDEX bookings_status_idx ON bookings (status);
CREATE INDEX bookings_created_at_idx ON bookings (created_at);
CREATE INDEX bookings_location_visit_date_idx ON bookings (location_id, visit_date);
