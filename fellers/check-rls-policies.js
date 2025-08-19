import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODY4NjcsImV4cCI6MjA3MDE2Mjg2N30.7ROhIh8x-puqKxYVY2fmAPCzxx536BFvMmTVQBZwgdQ';

async function checkAndFixRLS() {
  console.log('🔍 Checking RLS policies for contacts table...\n');

  // Test with anon key (what the contact form uses)
  const anonSupabase = createClient(supabaseUrl, anonKey);
  
  console.log('📋 Testing with ANON key (simulating contact form)...');
  const testData = {
    name: 'RLS Test User',
    phone: '555-TEST-RLS',
    location: 'Test Location',
    details: 'Testing RLS policies',
    status: 'new'
  };

  const { data: insertData, error: insertError } = await anonSupabase
    .from('contacts')
    .insert([testData])
    .select()
    .single();

  if (insertError) {
    console.log('❌ Insert with ANON key failed:', insertError.message);
    console.log('Error code:', insertError.code);
    
    if (insertError.code === '42501') {
      console.log('\n⚠️  RLS POLICY ISSUE DETECTED!\n');
      console.log('The policy exists but may not be working correctly.');
      console.log('\n📋 FIX: Run this SQL in Supabase Dashboard:\n');
      console.log('```sql');
      console.log('-- First, check existing policies');
      console.log("SELECT * FROM pg_policies WHERE tablename = 'contacts';");
      console.log('');
      console.log('-- Drop ALL existing insert policies');
      console.log('DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.contacts;');
      console.log('DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;');
      console.log('DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contacts;');
      console.log('');
      console.log('-- Create a new, simple insert policy');
      console.log('CREATE POLICY "Allow all inserts"');
      console.log('ON public.contacts');
      console.log('FOR INSERT');
      console.log('WITH CHECK (true);');
      console.log('');
      console.log('-- Verify the policy was created');
      console.log("SELECT * FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Allow all inserts';");
      console.log('```');
    }
  } else {
    console.log('✅ Insert with ANON key succeeded!');
    console.log('Created contact with ID:', insertData.id);
    console.log('\n🎉 RLS policies are working correctly!');
    console.log('The contact form should work now.');
    
    // Clean up test data
    const serviceSupabase = createClient(supabaseUrl, serviceRoleKey);
    await serviceSupabase
      .from('contacts')
      .delete()
      .eq('id', insertData.id);
    console.log('🧹 Test data cleaned up');
  }

  // Test with service role key
  console.log('\n📋 Testing with SERVICE ROLE key...');
  const serviceSupabase = createClient(supabaseUrl, serviceRoleKey);
  
  const { data: serviceData, error: serviceError } = await serviceSupabase
    .from('contacts')
    .insert([testData])
    .select()
    .single();

  if (serviceError) {
    console.log('❌ Even SERVICE ROLE key failed:', serviceError.message);
    console.log('This suggests a table or column issue.');
  } else {
    console.log('✅ Service role insert succeeded');
    console.log('Created contact with ID:', serviceData.id);
    
    // Clean up
    await serviceSupabase
      .from('contacts')
      .delete()
      .eq('id', serviceData.id);
  }
}

checkAndFixRLS()
  .then(() => {
    console.log('\n📌 Done checking RLS policies');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Script error:', error);
    process.exit(1);
  });