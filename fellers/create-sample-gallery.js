import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';
const supabase = createClient(supabaseUrl, serviceKey);

console.log('🖼️  Creating sample gallery images...');

async function createSampleGallery() {
  try {
    // First, create the table if it doesn't exist
    console.log('📋 Creating gallery_images table...');
    
    const createTableSQL = `
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

      CREATE POLICY IF NOT EXISTS "Anyone can read gallery images" ON public.gallery_images
        FOR SELECT USING (true);

      CREATE POLICY IF NOT EXISTS "Authenticated users can manage gallery images" ON public.gallery_images
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
    `;

    // Try direct SQL execution for table creation
    const { error: createError } = await supabase.rpc('sql', { query: createTableSQL });
    if (createError && !createError.message.includes('already exists')) {
      console.log('Note: Table creation via RPC failed, will try direct insert');
    }

    // Sample gallery images (using placeholder images)
    const sampleImages = [
      {
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop',
        alt: 'Tree removal project - Large oak tree',
        is_logo: false,
        order_index: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=450&fit=crop',
        alt: 'Professional tree trimming service',
        is_logo: false,
        order_index: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1574263867128-41de7c65e6b4?w=800&h=450&fit=crop',
        alt: 'Stump grinding equipment in action',
        is_logo: false,
        order_index: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop',
        alt: 'Emergency tree removal after storm',
        is_logo: false,
        order_index: 4
      },
      {
        url: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=450&fit=crop',
        alt: 'Professional crew with equipment',
        is_logo: false,
        order_index: 5
      },
      // Add a logo example to test filtering
      {
        url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        alt: 'Company logo',
        is_logo: true,
        order_index: 0
      }
    ];

    console.log('📤 Inserting sample images...');
    
    const { data, error } = await supabase
      .from('gallery_images')
      .insert(sampleImages)
      .select();

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Table does not exist. Manual creation required:');
        console.log('\n📋 COPY AND RUN THIS SQL IN SUPABASE DASHBOARD:');
        console.log(createTableSQL);
        console.log('\n🔧 Then run this script again.');
        return false;
      } else {
        throw error;
      }
    }

    console.log('✅ Sample gallery images created successfully!');
    console.log(`📊 Created ${data.length} images`);
    
    // Show what was created
    data.forEach(img => {
      console.log(`  • ${img.alt} ${img.is_logo ? '(LOGO)' : ''}`);
    });

    return true;

  } catch (error) {
    console.error('💥 Error creating sample gallery:', error.message);
    return false;
  }
}

async function testGalleryQuery() {
  console.log('\n🧪 Testing gallery query (3 random non-logo images)...');
  
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_logo', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log(`✅ Found ${data.length} non-logo images`);
    
    if (data.length > 0) {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      
      console.log('🎲 3 random images selected for gallery:');
      selected.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.alt}`);
      });
    }

  } catch (error) {
    console.error('💥 Test query failed:', error.message);
  }
}

createSampleGallery()
  .then(success => {
    if (success) {
      return testGalleryQuery();
    }
  })
  .then(() => {
    console.log('\n🎉 Gallery setup complete!');
    console.log('🌐 Gallery will show 3 random customer images at: https://fellersresources.fly.dev');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });