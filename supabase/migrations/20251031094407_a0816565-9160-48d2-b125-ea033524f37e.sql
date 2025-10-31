-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can create internships" ON public.internships;

-- Create a more flexible policy for authenticated users
CREATE POLICY "Authenticated users can create internships" 
ON public.internships 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Also make created_by auto-populate with the current user's ID
ALTER TABLE public.internships 
ALTER COLUMN created_by SET DEFAULT auth.uid();