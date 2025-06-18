
-- Allow public access to read profiles (for leaderboard)
CREATE POLICY "Allow public read access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public access to read campaigns (for activity gallery)
CREATE POLICY "Allow public read access to campaigns" 
ON public.campaigns 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public access to read user_point_logs (for leaderboard calculations)
CREATE POLICY "Allow public read access to user_point_logs" 
ON public.user_point_logs 
FOR SELECT 
TO anon, authenticated 
USING (true);
