CREATE TABLE routes(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  distance FLOAT,
  estimated_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their own routes" ON routes 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert their own routes" ON routes
  For INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update their own routes" ON routes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routes" ON routes 
  FOR DELETE USING (auth.uid() = user_id);

