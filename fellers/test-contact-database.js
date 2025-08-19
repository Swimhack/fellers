import { createClient } from '@supabase/supabase-js';

// Use correct API keys from .env file
const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODY4NjcsImV4cCI6MjA3MDE2Mjg2N30.7ROhIh8x-puqKxYVY2fmAPCzxx536BFvMmTVQBZwgdQ';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';

async function testContactDatabase() {
  console.log('🧪 Testing Contact Form Database Integration');
  console.log('==========================================');
  
  try {
    console.log('\n📍 Step 1: Test anonymous client connection');
    
    // Create anonymous client (this is what the contact form uses)
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test the exact data structure from the failed form submission
    const testData = {
      name: "MCP Test Contact",
      phone: "555-MCP-TEST",
      email: null,
      location: "Test Location", 
      details: "Testing MCP setup and database connectivity",
      status: 'new'
    };
    
    console.log('Attempting to insert test data:', testData);
    
    const { data: insertData, error: insertError } = await anonClient
      .from('contacts')
      .insert([testData])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Anonymous insert failed:', insertError);
      console.error('Full error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      
      // Try with service role to debug
      console.log('\n📍 Step 1b: Testing with service role for debugging');
      
      const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: serviceData, error: serviceError } = await serviceClient
        .from('contacts')
        .insert([testData])
        .select()
        .single();
        
      if (serviceError) {
        console.error('❌ Service role insert also failed:', serviceError);
      } else {
        console.log('✅ Service role insert successful - RLS issue confirmed');
        console.log('Service role inserted:', serviceData);
      }
      
    } else {
      console.log('✅ Anonymous insert successful!');
      console.log('Inserted data:', insertData);
    }
    
    console.log('\n📍 Step 2: Check existing contacts');
    
    // Use service role to check database contents
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: allContacts, error: selectError } = await serviceClient
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (selectError) {
      console.error('❌ Failed to read contacts:', selectError);
    } else {
      console.log(`✅ Total contacts in database: ${allContacts.length}`);
      
      if (allContacts.length > 0) {
        console.log('\n📋 Recent contacts:');
        allContacts.slice(0, 5).forEach((contact, index) => {
          console.log(`  ${index + 1}. ${contact.name} (${contact.phone}) - ${new Date(contact.created_at).toLocaleString()}`);
        });
      }
    }
    
    console.log('\n📍 Step 3: Test RLS policies directly');
    
    // Check RLS status
    const { data: rlsStatus, error: rlsError } = await serviceClient
      .rpc('check_rls_status', {});
      
    if (rlsError) {
      console.log('⚠️  Could not check RLS status directly');
    } else {
      console.log('RLS Status:', rlsStatus);
    }
    
    console.log('\n📍 Step 4: Attempt to fix RLS policies');
    
    try {
      // Execute RLS fix
      const fixSQL = `
        -- Disable RLS temporarily
        ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
        
        -- Drop all existing policies
        DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;
        DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;
        DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;
        DROP POLICY IF EXISTS "Service role can insert contacts" ON public.contacts;
        
        -- Re-enable RLS
        ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
        
        -- Create permissive policy for inserts
        CREATE POLICY "Allow all inserts" ON public.contacts
          FOR INSERT 
          WITH CHECK (true);
          
        -- Create policy for authenticated reads
        CREATE POLICY "Allow authenticated reads" ON public.contacts
          FOR SELECT 
          TO authenticated
          USING (true);
          
        -- Create policy for authenticated updates
        CREATE POLICY "Allow authenticated updates" ON public.contacts
          FOR UPDATE 
          TO authenticated
          USING (true) 
          WITH CHECK (true);
      `;
      
      // Note: We can't execute raw SQL via the JS client without a custom function
      console.log('⚠️  RLS policy fix requires manual execution in Supabase dashboard');
      console.log('SQL to execute:');
      console.log(fixSQL);
      
    } catch (fixError) {
      console.error('❌ RLS fix failed:', fixError);
    }
    
    console.log('\n📍 Step 5: Final test after potential fix');
    
    // Try one more anonymous insert
    const finalTestData = {
      name: "Final Test Contact",
      phone: "555-FINAL-TEST",
      email: "test@example.com",
      location: "Final Test Location",
      details: "Final connectivity test",
      status: 'new'
    };
    
    const { data: finalData, error: finalError } = await anonClient
      .from('contacts')
      .insert([finalTestData])
      .select()
      .single();
    
    if (finalError) {
      console.error('❌ Final test failed:', finalError);
    } else {
      console.log('✅ Final test successful!');
      console.log('Final test data:', finalData);
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
  }
  
  console.log('\n==========================================');
  console.log('🏁 Database Test Complete');
  console.log('==========================================');
}

// Run the test
testContactDatabase().catch(console.error);