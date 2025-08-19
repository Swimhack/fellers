// Fix RLS policy for contacts table in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRLSPolicy() {
  console.log('🔧 Fixing RLS policy for contacts table...');
  console.log('');
  console.log('⚠️  CRITICAL: RLS policy is blocking contact form submissions!');
  console.log('');
  console.log('📋 COPY AND RUN THIS SQL IN SUPABASE DASHBOARD:');
  console.log('');
  console.log('1. Go to: https://supabase.com/dashboard/project/mzqbheqosfjddmbytkzz');
  console.log('2. Click: SQL Editor (in left sidebar)');
  console.log('3. Click: + New query');
  console.log('4. Copy and paste this SQL:');
  console.log('');
  console.log('```sql');
  console.log('-- Drop existing policies if they exist');
  console.log('DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;');
  console.log('DROP POLICY IF EXISTS "Enable insert for anon" ON public.contacts;');
  console.log('DROP POLICY IF EXISTS "Enable insert for all users" ON public.contacts;');
  console.log('');
  console.log('-- Create new policy that allows anonymous users to insert');
  console.log('CREATE POLICY "Enable insert for anonymous users"');
  console.log('ON public.contacts');
  console.log('FOR INSERT');
  console.log('TO anon, authenticated');
  console.log('WITH CHECK (true);');
  console.log('');
  console.log('-- Ensure read access for authenticated users (admin)');
  console.log('DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;');
  console.log('CREATE POLICY "Enable read for authenticated users"');
  console.log('ON public.contacts');
  console.log('FOR SELECT');
  console.log('TO authenticated');
  console.log('USING (true);');
  console.log('');
  console.log('-- Ensure update access for authenticated users (admin)');
  console.log('DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;');
  console.log('CREATE POLICY "Enable update for authenticated users"');
  console.log('ON public.contacts');
  console.log('FOR UPDATE');
  console.log('TO authenticated');
  console.log('USING (true)');
  console.log('WITH CHECK (true);');
  console.log('');
  console.log('-- Ensure delete access for authenticated users (admin)');
  console.log('DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON public.contacts;');
  console.log('CREATE POLICY "Enable delete for authenticated users"');
  console.log('ON public.contacts');
  console.log('FOR DELETE');
  console.log('TO authenticated');
  console.log('USING (true);');
  console.log('```');
  console.log('');
  console.log('5. Click: Run');
  console.log('6. Verify success message appears');
  console.log('7. Test contact form at: https://fellersresources.fly.dev');
  console.log('');
  
  // Test current permissions
  try {
    console.log('🧪 Testing current permissions...');
    
    // Test with anon key
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODY4NjcsImV4cCI6MjA3MDE2Mjg2N30.7ROhIh8x-puqKxYVY2fmAPCzxx536BFvMmTVQBZwgdQ';
    const anonSupabase = createClient(supabaseUrl, anonKey);
    
    const { data, error } = await anonSupabase
      .from('contacts')
      .insert({
        name: 'RLS Test Contact',
        phone: '555-TEST-RLS',
        location: 'Test Location',
        details: 'Testing RLS policy fix'
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '42501') {
        console.log('❌ Confirmed: RLS policy is blocking anonymous inserts');
        console.log('Error:', error.message);
        console.log('');
        console.log('⚠️  THE CONTACT FORM WILL NOT WORK UNTIL YOU RUN THE SQL ABOVE!');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    } else {
      console.log('✅ RLS policy is already fixed! Contact form should work.');
      console.log('Test contact created with ID:', data.id);
    }
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

fixRLSPolicy()
  .then(() => {
    console.log('');
    console.log('📌 NEXT STEPS:');
    console.log('1. Run the SQL commands above in Supabase dashboard');
    console.log('2. Test the contact form at https://fellersresources.fly.dev');
    console.log('3. Verify submissions appear in /admin/contacts');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });