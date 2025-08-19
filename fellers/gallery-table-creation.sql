-- Create gallery_images table for Fellers Resources
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  order_index INTEGER DEFAULT 0,
  is_logo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read gallery images
CREATE POLICY "Anyone can read gallery images" ON public.gallery_images
  FOR SELECT USING (true);

-- Allow authenticated users to manage gallery images
CREATE POLICY "Authenticated users can manage gallery images" ON public.gallery_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert sample data for testing
INSERT INTO public.gallery_images (url, alt, is_logo, order_index) VALUES
  ('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop', 'Tree removal project - Large oak tree', false, 1),
  ('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=450&fit=crop', 'Professional tree trimming service', false, 2),
  ('https://images.unsplash.com/photo-1574263867128-41de7c65e6b4?w=800&h=450&fit=crop', 'Stump grinding equipment in action', false, 3),
  ('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop', 'Emergency tree removal after storm', false, 4),
  ('https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=450&fit=crop', 'Professional crew with equipment', false, 5),
  ('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop', 'Company logo', true, 0);