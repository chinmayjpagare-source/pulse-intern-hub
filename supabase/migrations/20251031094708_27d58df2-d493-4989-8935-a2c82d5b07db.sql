-- First, let's make the created_by field nullable so inserts work without it
ALTER TABLE public.internships 
ALTER COLUMN created_by DROP NOT NULL;

-- Update the default to use auth.uid() only when user is authenticated
ALTER TABLE public.internships 
ALTER COLUMN created_by SET DEFAULT auth.uid();

-- Drop all existing insert policies
DROP POLICY IF EXISTS "Authenticated users can create internships" ON public.internships;

-- Create a simple policy that allows any authenticated user to insert
CREATE POLICY "Allow authenticated inserts" 
ON public.internships 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Also ensure the table's RLS is enabled
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;