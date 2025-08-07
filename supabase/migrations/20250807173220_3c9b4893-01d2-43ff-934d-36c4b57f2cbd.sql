-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  location TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert contact submissions (for the contact form)
CREATE POLICY "Anyone can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated users to view all submissions (for admin)
CREATE POLICY "Authenticated users can view all contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to update contact submissions (for admin)
CREATE POLICY "Authenticated users can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (auth.role() = 'authenticated');