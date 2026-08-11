CREATE TABLE gallery_items (
  id VARCHAR(80) PRIMARY KEY,
  location_id VARCHAR(32) NOT NULL REFERENCES locations(slug) ON DELETE CASCADE,
  media_asset_id UUID NULL REFERENCES media_assets(id) ON DELETE SET NULL,
  title VARCHAR(140) NOT NULL,
  alt_text VARCHAR(300) NOT NULL,
  caption VARCHAR(400) NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by_admin_id UUID NULL REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX gallery_items_location_sort_idx ON gallery_items(location_id, sort_order);
CREATE INDEX gallery_items_location_active_idx ON gallery_items(location_id, active);

INSERT INTO gallery_items(id, location_id, title, alt_text, featured, sort_order)
SELECT 'gallery-' || location_id || '-' || position, location_id, title, title,
       position = 1, position * 10
FROM (VALUES ('moscow'), ('spb'), ('kazan')) locations(location_id)
CROSS JOIN (VALUES
  (1, 'Интерьер — общий план'), (2, 'Зона отдыха'),
  (3, 'Знакомство с ёжиками'), (4, 'Африканский ёжик'),
  (5, 'Праздник в кафе'), (6, 'Событие в Ежеминутке')
) slots(position, title);
