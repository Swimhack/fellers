import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';
const supabase = createClient(supabaseUrl, serviceKey);

console.log('🗑️  Removing all fabricated sample images...');

async function removeFakeImages() {
  try {
    // Delete all records (they're all fake sample data)
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log('✅ All fabricated images removed successfully');
    
    // Verify table is empty
    const { data, error: checkError } = await supabase
      .from('gallery_images')
      .select('*');
    
    if (checkError) {
      console.error('Error checking table:', checkError.message);
      return;
    }
    
    console.log(`📊 Gallery table now has ${data.length} images`);
    
    if (data.length === 0) {
      console.log('✅ Gallery is clean - will only show admin-uploaded images');
      console.log('📋 Until admin uploads real images, gallery will show "No images available"');
    }
    
  } catch (error) {
    console.error('💥 Failed:', error);
  }
}

removeFakeImages().then(() => {
  console.log('\n🎯 Gallery now restricted to ADMIN UPLOADS ONLY');
  console.log('🌐 https://fellersresources.fly.dev will show empty state until real images uploaded');
  process.exit(0);
});