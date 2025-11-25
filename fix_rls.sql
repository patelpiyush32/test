-- Fix RLS policies for hotels table
DROP POLICY IF EXISTS "Users can view their own hotels" ON hotels;
DROP POLICY IF EXISTS "Users can insert their own hotels" ON hotels;
DROP POLICY IF EXISTS "Users can update their own hotels" ON hotels;

CREATE POLICY "Users can view their own hotels"
ON hotels FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hotels"
ON hotels FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hotels"
ON hotels FOR UPDATE
USING (auth.uid() = user_id);

-- Allow public to view active hotels
CREATE POLICY "Public can view active hotels"
ON hotels FOR SELECT
USING (is_active = true AND is_published = true);
