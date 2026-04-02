SELECT auth.uid();

CREATE TABLE bikes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  engine_size INTEGER,
  license_plate TEXT,
  odometer INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bikes" ON bikes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bikes" ON bikes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bikes" ON bikes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bikes" ON bikes
  FOR DELETE USING (auth.uid() = user_id);
