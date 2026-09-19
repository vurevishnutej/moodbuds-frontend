-- Media asset storage (referenced by MediaService and product/size-chart images)
CREATE TABLE media_assets (
  id BIGINT NOT NULL AUTO_INCREMENT,
  storage_key VARCHAR(300) NOT NULL,
  original_filename VARCHAR(300),
  content_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT NOT NULL,
  width_px INT,
  height_px INT,
  checksum_sha256 VARCHAR(64),
  created_by INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_media_storage_key (storage_key)
);

-- Link uploaded media to product images and size charts
ALTER TABLE product_images ADD COLUMN media_asset_id BIGINT;
ALTER TABLE product_images ADD COLUMN sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE size_charts ADD COLUMN media_asset_id BIGINT;

-- Product publication workflow columns (required by ConsolidatedProductService)
ALTER TABLE products ADD COLUMN publication_status VARCHAR(20) NOT NULL DEFAULT 'DRAFT';
ALTER TABLE products ADD COLUMN published_at DATETIME;
ALTER TABLE products ADD COLUMN updated_by INT;

-- Seed GST rates so products can be created/published
INSERT INTO gst_rates (name, rate_percentage, hsn_code, is_active) VALUES
  ('GST 5%', 5.00, '6109', 1),
  ('GST 12%', 12.00, '6203', 1),
  ('GST 18%', 18.00, '6404', 1);

-- Seed moods matching the storefront mood palette
INSERT INTO moods (name, slug, tagline, personality_tagline, color, is_active) VALUES
  ('Happy', 'happy', 'sunshine in everything.', 'You bring the light.', '#FFD93D', 1),
  ('Confident', 'confident', 'dressed like you won.', 'Own the room.', '#F0D060', 1),
  ('Cool', 'cool', 'effortless. always.', 'Never trying too hard.', '#7EB8F0', 1),
  ('Professional', 'professional', 'sharp. refined. ready.', 'Business, elevated.', '#CBB27A', 1),
  ('Party', 'party', 'tonight deserves this.', 'Made for the moment.', '#D070F0', 1),
  ('Energetic', 'energetic', 'move louder, feel brighter.', 'Always in motion.', '#FF8040', 1),
  ('Romantic', 'romantic', 'soft evenings, slow hearts.', 'Love is in the details.', '#F0A0B0', 1),
  ('Calm', 'calm', 'stillness is a style.', 'Quiet and grounded.', '#70C0D0', 1),
  ('Minimal', 'minimal', 'quiet confidence.', 'Less, but better.', '#AAAAAA', 1);
