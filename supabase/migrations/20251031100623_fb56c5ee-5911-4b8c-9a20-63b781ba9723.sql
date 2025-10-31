-- Create storage bucket for internship PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('internship-pdfs', 'internship-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for internship-pdfs bucket
CREATE POLICY "Anyone can view internship PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'internship-pdfs');

CREATE POLICY "Admins can upload internship PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'internship-pdfs' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update internship PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'internship-pdfs' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete internship PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'internship-pdfs' 
  AND has_role(auth.uid(), 'admin'::app_role)
);