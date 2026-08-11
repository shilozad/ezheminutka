BEGIN;
CREATE TABLE media_assets (
 id UUID PRIMARY KEY, location_id VARCHAR(32) NULL REFERENCES locations(slug) ON DELETE CASCADE,
 storage_key TEXT UNIQUE NOT NULL, original_name VARCHAR(255) NOT NULL,
 mime_type VARCHAR(50) NOT NULL CHECK (mime_type IN ('image/jpeg','image/png','image/webp')),
 byte_size INTEGER NOT NULL CHECK (byte_size > 0), alt_text VARCHAR(300),
 created_by_admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE brand_settings (
 id SMALLINT PRIMARY KEY CHECK(id=1), logo_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
 updated_by_admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO brand_settings(id) VALUES(1);
CREATE TABLE location_page_content (
 location_id VARCHAR(32) PRIMARY KEY REFERENCES locations(slug) ON DELETE CASCADE,
 hero_eyebrow VARCHAR(160), hero_title VARCHAR(240), hero_description VARCHAR(600), hero_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
 amenities_eyebrow VARCHAR(160), amenities_title VARCHAR(240), updated_by_admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO location_page_content(location_id) VALUES ('moscow'),('spb'),('kazan');
CREATE TABLE location_amenities (
 id VARCHAR(80) PRIMARY KEY, location_id VARCHAR(32) NOT NULL REFERENCES locations(slug) ON DELETE CASCADE,
 title VARCHAR(100) NOT NULL, description VARCHAR(250) NOT NULL, icon_key VARCHAR(50), background_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
 sort_order INTEGER NOT NULL DEFAULT 0, active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO location_amenities(id,location_id,title,description,icon_key,sort_order)
SELECT city||'-'||item.id,city,item.title,item.description,item.icon,item.ord FROM
 (VALUES ('moscow'),('spb'),('kazan')) cities(city) CROSS JOIN
 (VALUES ('1','Ёжики','Бережное общение с главными хозяевами.','hedgehog',10),('2','Чай и печенье','Тёплое дополнение к неспешной встрече.','tea',20),('3','Настольные игры','Для двоих, семьи или компании.','board-games',30),('4','Игровые приставки','Для дружеского турнира.','console',40),('5','Wi-Fi','Оставайтесь на связи.','wifi',50),('6','Уютное пространство','Для отдыха и разговоров.','lounge',60)) item(id,title,description,icon,ord);
CREATE INDEX media_assets_location_idx ON media_assets(location_id);
CREATE INDEX location_amenities_order_idx ON location_amenities(location_id,sort_order);
COMMIT;
