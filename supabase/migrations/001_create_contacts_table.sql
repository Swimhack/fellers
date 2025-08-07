-- Create contacts table for storing form submissions
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    location TEXT NOT NULL,
    details TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    contacted_at TIMESTAMPTZ,
    contacted_by TEXT
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read contacts
CREATE POLICY "Authenticated users can read contacts" ON public.contacts
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for service role to insert contacts
CREATE POLICY "Service role can insert contacts" ON public.contacts
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create policy for authenticated users to update contacts
CREATE POLICY "Authenticated users can update contacts" ON public.contacts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX idx_contacts_status ON public.contacts(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE
    ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();