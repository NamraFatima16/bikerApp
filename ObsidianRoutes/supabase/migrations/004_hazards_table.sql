-- 004_hazards_table.sql

-- Create hazard_type enum
DO $$ BEGIN
    CREATE TYPE hazard_type AS ENUM ('pothole', 'road_kill', 'near_miss', 'other');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create hazards table
CREATE TABLE IF NOT EXISTS hazards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ride_id UUID REFERENCES ride_history(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location GEOGRAPHY(POINT, 4326),
  hazard_type hazard_type NOT NULL,
  upvotes INTEGER DEFAULT 0,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS hazards_location_gist_idx ON hazards USING GIST (location);
CREATE INDEX IF NOT EXISTS hazards_user_id_idx ON hazards (user_id);
CREATE INDEX IF NOT EXISTS hazards_created_at_idx ON hazards (created_at);

-- Trigger to populate 'location' from latitude/longitude if not provided
CREATE OR REPLACE FUNCTION set_hazard_location_from_latlon()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.location IS NULL AND NEW.longitude IS NOT NULL AND NEW.latitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_hazard_location
BEFORE INSERT OR UPDATE ON hazards
FOR EACH ROW EXECUTE FUNCTION set_hazard_location_from_latlon();

-- Row Level Security
ALTER TABLE hazards ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view hazards" ON hazards
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can insert hazards" ON hazards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to upvote (UPDATE). Restricting column-level updates to upvotes should be enforced in API layer for now.
CREATE POLICY IF NOT EXISTS "Users can upvote hazards" ON hazards
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Note: Further restrictive policies (e.g., preventing edits to other fields) can be added later.
