-- Create table to store internship PDF URLs
CREATE TABLE public.internship_pdfs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  internship_id TEXT NOT NULL UNIQUE,
  pdf_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.internship_pdfs ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read PDF URLs
CREATE POLICY "Anyone can view internship PDFs"
ON public.internship_pdfs
FOR SELECT
USING (true);

-- Only admins can insert/update/delete PDF URLs
CREATE POLICY "Admins can manage internship PDFs"
ON public.internship_pdfs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_internship_pdfs_updated_at
BEFORE UPDATE ON public.internship_pdfs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_internship_pdfs_internship_id ON public.internship_pdfs(internship_id);