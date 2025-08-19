// Emergency script to create the missing contacts table
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZndreHZoZG5xbmN5aHluY21qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzA5OTc3MSwiZXhwIjoyMDU4Njc1NzcxfQ.BIqVDfamjbvSuXf-RxaM0zKFrWNP_Ncq2pjTZVQ1WyE';

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createContactsTable() {
  console.log('🚨 EMERGENCY: Creating missing contacts table...');
  
  const sql = `
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

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Service role can insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;

-- Create policy for authenticated users to read contacts
CREATE POLICY "Authenticated users can read contacts" ON public.contacts
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for anonymous users to insert contacts (for contact form submissions)
CREATE POLICY "Anyone can insert contacts" ON public.contacts
    FOR INSERT
    TO anon
    WITH CHECK (true);

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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE
    ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    console.log('📡 Connecting to Supabase...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Failed to create table via RPC:', error);
      
      // Try alternative approach - create table using direct SQL
      console.log('🔄 Trying alternative approach...');
      const { error: sqlError } = await supabase
        .from('contacts')
        .select('count', { count: 'exact', head: true });
      
      if (sqlError && sqlError.code === '42P01') {
        console.log('✅ Confirmed: Table does not exist');
        console.log('📋 Manual steps required:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Select project: mzqbheqosfjddmbytkzz');
        console.log('3. Open SQL Editor');
        console.log('4. Run the SQL from create-contacts-table.sql');
      }
      
      return false;
    }
    
    console.log('✅ Contacts table created successfully!');
    
    // Test the table
    const { data: testData, error: testError } = await supabase
      .from('contacts')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Table test failed:', testError);
      return false;
    }
    
    console.log('✅ Table test passed! Contact count:', testData.length || 0);
    console.log('🎉 Emergency fix complete! Contact form should now work.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
    console.log('📋 Manual fix required - see CRITICAL_FIX_INSTRUCTIONS.md');
    return false;
  }
}

// Run the emergency fix
createContactsTable()
  .then(success => {
    if (success) {
      console.log('🎉 SUCCESS: Contact system should now be functional!');
      console.log('🔍 Test by submitting the contact form at: https://fellersresources.fly.dev');
    } else {
      console.log('⚠️  Manual intervention required');
      console.log('📖 See: CRITICAL_FIX_INSTRUCTIONS.md');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });