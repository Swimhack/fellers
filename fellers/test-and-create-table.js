// Simple test and create table script
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZndreHZoZG5xbmN5aHluY21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTk3NzEsImV4cCI6MjA1ODY3NTc3MX0.2_0pduHQDFktd7f6fOBCHM91WOIDr1U7npqG0MkFgJA';

const supabase = createClient(supabaseUrl, anonKey);

async function testAndCreateTable() {
  console.log('🔍 Testing contact table status...');
  
  try {
    // Test if we can read from contacts table
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Table error:', error.code, error.message);
      
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('✅ Confirmed: contacts table does not exist');
        console.log('📋 MANUAL DATABASE SETUP REQUIRED:');
        console.log('');
        console.log('🔧 IMMEDIATE ACTION NEEDED:');
        console.log('1. Open: https://supabase.com/dashboard');
        console.log('2. Select project: mzqbheqosfjddmbytkzz');
        console.log('3. Click: SQL Editor (in left sidebar)');
        console.log('4. Click: + New query');
        console.log('5. Copy and paste this SQL:');
        console.log('');
        console.log('```sql');
        console.log('CREATE TABLE IF NOT EXISTS public.contacts (');
        console.log('    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
        console.log('    name TEXT NOT NULL,');
        console.log('    phone TEXT NOT NULL,');
        console.log('    email TEXT,');
        console.log('    location TEXT NOT NULL,');
        console.log('    details TEXT NOT NULL,');
        console.log('    status TEXT DEFAULT \'new\' CHECK (status IN (\'new\', \'contacted\', \'completed\', \'cancelled\')),');
        console.log('    notes TEXT,');
        console.log('    created_at TIMESTAMPTZ DEFAULT NOW(),');
        console.log('    updated_at TIMESTAMPTZ DEFAULT NOW(),');
        console.log('    contacted_at TIMESTAMPTZ,');
        console.log('    contacted_by TEXT');
        console.log(');');
        console.log('');
        console.log('ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;');
        console.log('');
        console.log('CREATE POLICY "Anyone can insert contacts" ON public.contacts');
        console.log('    FOR INSERT TO anon WITH CHECK (true);');
        console.log('');
        console.log('CREATE POLICY "Authenticated users can read contacts" ON public.contacts');
        console.log('    FOR SELECT TO authenticated USING (true);');
        console.log('');
        console.log('CREATE POLICY "Authenticated users can update contacts" ON public.contacts');
        console.log('    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);');
        console.log('```');
        console.log('');
        console.log('6. Click: Run');
        console.log('7. Verify success message appears');
        console.log('8. Test contact form at: https://fellersresources.fly.dev');
        console.log('');
        return false;
      } else {
        console.log('❌ Unexpected database error:', error);
        return false;
      }
    } else {
      console.log('✅ Contacts table exists and is accessible!');
      console.log('📊 Current row count:', data.length);
      
      // Test insert to make sure permissions work
      console.log('🧪 Testing insert permission...');
      const { data: insertData, error: insertError } = await supabase
        .from('contacts')
        .insert({
          name: 'Test Contact',
          phone: '555-TEST-123',
          location: 'Test Location',
          details: 'Table functionality test'
        })
        .select()
        .single();
      
      if (insertError) {
        console.log('❌ Insert test failed:', insertError.message);
        console.log('🔧 Possible RLS policy issue - check permissions');
        return false;
      } else {
        console.log('✅ Insert test passed! ID:', insertData.id);
        console.log('🎉 Contact form should be fully functional!');
        return true;
      }
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return false;
  }
}

testAndCreateTable()
  .then(success => {
    if (success) {
      console.log('');
      console.log('🎉 SUCCESS: Database is ready and functional!');
      console.log('🌐 Contact form should work at: https://fellersresources.fly.dev');
      console.log('👤 Admin panel available at: https://fellersresources.fly.dev/admin');
    } else {
      console.log('');
      console.log('⚠️  Database setup required before contact form will work');
      console.log('⏰ This will take about 2-3 minutes to complete');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });