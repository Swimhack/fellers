import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';
const supabase = createClient(supabaseUrl, serviceKey);

console.log('🔍 Checking gallery_images table...');

async function checkGalleryTable() {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .limit(5);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ gallery_images table does not exist');
        console.log('\n📋 Creating gallery_images table...');
        
        // Create the table
        const createResult = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.gallery_images (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              url TEXT NOT NULL,
              alt TEXT,
              order_index INTEGER DEFAULT 0,
              is_logo BOOLEAN DEFAULT false,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

            CREATE POLICY "Anyone can read gallery images" ON public.gallery_images
              FOR SELECT USING (true);

            CREATE POLICY "Authenticated users can manage gallery images" ON public.gallery_images
              FOR ALL TO authenticated USING (true) WITH CHECK (true);
          `
        });
        
        if (createResult.error) {
          console.log('❌ Failed to create table via RPC');
          console.log('\n📋 MANUAL CREATION REQUIRED:');
          console.log('Run this SQL in Supabase dashboard:');
          console.log(`
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  order_index INTEGER DEFAULT 0,
  is_logo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery images" ON public.gallery_images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage gallery images" ON public.gallery_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
          `);
        } else {
          console.log('✅ gallery_images table created successfully');
        }
      } else {
        throw error;
      }
    } else {
      console.log('✅ gallery_images table exists');
      console.log(`📊 Found ${data.length} images`);
      
      if (data.length > 0) {
        console.log('📄 Sample images:');
        data.forEach((img, i) => {
          console.log(`  ${i + 1}. ${img.alt || 'No alt'} - Logo: ${img.is_logo ? 'Yes' : 'No'}`);
        });
      }
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

checkGalleryTable().then(() => process.exit(0));