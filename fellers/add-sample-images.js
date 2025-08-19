import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';
const supabase = createClient(supabaseUrl, serviceKey);

console.log('🖼️  Adding sample images to gallery...');

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
  {
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
    alt: 'Company logo',
    is_logo: true,
    order_index: 0
  }
];

async function addSampleImages() {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert(sampleImages)
      .select();
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log('✅ Sample images added successfully!');
    console.log(`📊 Added ${data.length} images:`);
    
    data.forEach(img => {
      console.log(`  • ${img.alt} ${img.is_logo ? '(LOGO - will be filtered out)' : '(CUSTOMER IMAGE)'}`);
    });
    
    console.log('\n🎲 Testing random selection...');
    const { data: testData } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_logo', false);
    
    if (testData) {
      const shuffled = [...testData].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      
      console.log('🖼️  3 random images for gallery:');
      selected.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.alt}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Failed:', error);
  }
}

addSampleImages().then(() => {
  console.log('\n🎉 Gallery is ready!');
  console.log('🌐 Visit https://fellersresources.fly.dev to see 3 random customer images');
  process.exit(0);
});