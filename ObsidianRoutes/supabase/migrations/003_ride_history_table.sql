CREATE TABLE ride_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bike_id UUID REFERENCES bikes(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  distance FLOAT DEFAULT 0,
  duration INTEGER DEFAULT 0,
  route_coordinates JSONB DEFAULT '[]',
  max_speed FLOAT,
  avg_speed FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ride_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rides" ON ride_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rides" ON ride_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rides" ON ride_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rides" ON ride_history
  FOR DELETE USING (auth.uid() = user_id);