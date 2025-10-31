-- Add skills column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- Add other profile fields that are missing
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS degree TEXT,
ADD COLUMN IF NOT EXISTS year TEXT,
ADD COLUMN IF NOT EXISTS gpa TEXT,
ADD COLUMN IF NOT EXISTS university TEXT,
ADD COLUMN IF NOT EXISTS preferred_duration TEXT,
ADD COLUMN IF NOT EXISTS preferred_mode TEXT DEFAULT 'Remote',
ADD COLUMN IF NOT EXISTS preferred_location TEXT;