
-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Create index on email for better query performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
