import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMzM4NjYsImV4cCI6MjA0OTgwOTg2Nn0.W7_pLkOhzXlUwL_lRLmhDkWZKhgvjyPfHMtEE-kDfmA';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDIzMzg2NiwiZXhwIjoyMDQ5ODA5ODY2fQ.bqeUrnr7pL9Pq5lPvOo9f9-P9t4_h2I6LCGb6hZEA4M';

async function fixRLSAndTest() {
  console.log('🔧 Fixing RLS Policies and Testing Contact Form');
  console.log('===============================================');
  
  try {
    // Create service role client for admin operations
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('\n📍 Step 1: Check current RLS policies');
    
    // Check if policies exist
    const { data: policies, error: policiesError } = await serviceClient
      .rpc('exec_sql', {
        sql: `
          SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
          FROM pg_policies 
          WHERE tablename = 'contacts';
        `
      });
    
    if (policiesError) {
      console.log('⚠️  Could not check policies directly, proceeding with setup');
    } else {
      console.log('Current policies:', policies);
    }
    
    console.log('\n📍 Step 2: Recreate RLS policies');
    
    // SQL to fix RLS policies
    const fixRLSSQL = `
      -- Drop existing policies
      DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;
      DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;
      DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;
      DROP POLICY IF EXISTS "Service role can insert contacts" ON public.contacts;
      
      -- Ensure RLS is enabled
      ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
      
      -- Create new policies
      CREATE POLICY "Anyone can insert contacts" ON public.contacts
        FOR INSERT 
        TO anon, authenticated
        WITH CHECK (true);
        
      CREATE POLICY "Authenticated users can read contacts" ON public.contacts
        FOR SELECT 
        TO authenticated
        USING (true);
        
      CREATE POLICY "Authenticated users can update contacts" ON public.contacts
        FOR UPDATE 
        TO authenticated
        USING (true) 
        WITH CHECK (true);
    `;
    
    const { error: fixError } = await serviceClient.rpc('exec_sql', { sql: fixRLSSQL });
    
    if (fixError) {
      console.error('❌ Failed to fix RLS policies:', fixError);
      // Try alternative approach
      console.log('\n📍 Step 2b: Trying alternative RLS fix');
      
      const { error: altError } = await serviceClient
        .from('contacts')
        .select('count(*)')
        .then(() => {
          console.log('✅ Table accessible via service role');
        });
        
      if (altError) {
        console.error('❌ Alternative check failed:', altError);
      }
    } else {
      console.log('✅ RLS policies updated successfully');
    }
    
    console.log('\n📍 Step 3: Test with anonymous client');
    
    // Create anonymous client for testing
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test data
    const testData = {
      name: "MCP Test Contact",
      phone: "555-MCP-TEST",
      email: null,
      location: "Test Location",
      details: "Testing MCP setup and database connectivity",
      status: 'new'
    };
    
    console.log('Testing insert with data:', testData);
    
    const { data: insertData, error: insertError } = await anonClient
      .from('contacts')
      .insert([testData])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      console.error('Error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
    } else {
      console.log('✅ Insert test successful!');
      console.log('Inserted data:', insertData);
    }
    
    console.log('\n📍 Step 4: Verify with service role');
    
    // Check total count with service role
    const { data: countData, error: countError } = await serviceClient
      .from('contacts')
      .select('*', { count: 'exact' });
    
    if (countError) {
      console.error('❌ Count check failed:', countError);
    } else {
      console.log(`✅ Total contacts in database: ${countData.length}`);
      
      // Show recent submissions
      const recentContacts = countData
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);
        
      console.log('\n📋 Recent contact submissions:');
      recentContacts.forEach((contact, index) => {
        console.log(`  ${index + 1}. ${contact.name} (${contact.phone}) - ${contact.created_at}`);
      });
    }
    
    console.log('\n📍 Step 5: Test form submission via API simulation');
    
    // Simulate the exact form submission that happens in the browser
    try {
      const formSubmissionData = {
        name: "API Test Contact",
        phone: "555-API-TEST", 
        email: null,
        location: "API Test Location",
        details: "Testing API form submission",
        status: 'new'
      };
      
      const { data: apiTestData, error: apiTestError } = await anonClient
        .from('contacts')
        .insert([formSubmissionData])
        .select()
        .single();
        
      if (apiTestError) {
        console.error('❌ API simulation test failed:', apiTestError);
      } else {
        console.log('✅ API simulation test successful!');
        console.log('API test data:', apiTestData);
      }
    } catch (apiError) {
      console.error('❌ API simulation error:', apiError);
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
  
  console.log('\n===============================================');
  console.log('🏁 RLS Fix and Test Complete');
  console.log('===============================================');
}

// Run the script
fixRLSAndTest().catch(console.error);