// Direct database fix using Supabase REST API
import fetch from 'node-fetch';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZndreHZoZG5xbmN5aHluY21qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzA5OTc3MSwiZXhwIjoyMDU4Njc1NzcxfQ.BIqVDfamjbvSuXf-RxaM0zKFrWNP_Ncq2pjTZVQ1WyE';

async function createContactsTable() {
  console.log('🚨 FIXING: Creating contacts table directly...');
  
  const sql = `
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

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;

CREATE POLICY "Anyone can insert contacts" ON public.contacts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated users can read contacts" ON public.contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update contacts" ON public.contacts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
  `;

  try {
    // Use Supabase REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({ sql: sql })
    });

    if (!response.ok) {
      console.log('❌ RPC method failed, trying direct table creation...');
      
      // Try creating a test record to see if table exists
      const testResponse = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Range': '0-0'
        }
      });

      if (testResponse.status === 404 || testResponse.status === 406) {
        console.log('✅ Confirmed: Table does not exist');
        console.log('📋 MANUAL ACTION REQUIRED:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Select project: mzqbheqosfjddmbytkzz');
        console.log('3. Open SQL Editor');
        console.log('4. Paste and run the SQL from the console output above');
        return false;
      }
      
      console.log('✅ Table may already exist, testing...');
    }

    // Test if table works by attempting to read
    const testRead = await fetch(`${supabaseUrl}/rest/v1/contacts?select=count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Prefer': 'count=exact'
      }
    });

    if (testRead.ok) {
      console.log('✅ Contacts table is working!');
      
      // Test insert
      const testInsert = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: 'Database Test',
          phone: '555-TEST-123',
          email: 'test@example.com',
          location: 'Test Location',
          details: 'Database connectivity test'
        })
      });

      if (testInsert.ok) {
        console.log('✅ Database insert test PASSED!');
        console.log('🎉 Contact form should now work!');
        return true;
      } else {
        const error = await testInsert.text();
        console.log('❌ Insert test failed:', error);
        return false;
      }
    } else {
      const error = await testRead.text();
      console.log('❌ Table read test failed:', error);
      return false;
    }

  } catch (error) {
    console.error('❌ Database fix failed:', error);
    return false;
  }
}

createContactsTable()
  .then(success => {
    if (success) {
      console.log('🎉 SUCCESS: Database is ready!');
      console.log('🔍 Test the contact form at: https://fellersresources.fly.dev');
    } else {
      console.log('⚠️  Manual database setup required');
      console.log('📖 See console output above for instructions');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });