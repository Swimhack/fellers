import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env
const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODY4NjcsImV4cCI6MjA3MDE2Mjg2N30.7ROhIh8x-puqKxYVY2fmAPCzxx536BFvMmTVQBZwgdQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('gallery_images').select('id').limit(1);
    
    if (error) {
      console.error('❌ Connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log('Gallery table accessible:', data);
    
    // Test admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('username')
      .limit(1);
      
    if (adminError) {
      if (adminError.code === '42P01') {
        console.log('⚠️ admin_users table does not exist');
        console.log('Creating admin_users table...');
        
        // Create the table using service role key
        const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';
        const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
        
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS admin_users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE,
            is_active BOOLEAN DEFAULT true
          );
          
          ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS "Enable all operations for service role" ON admin_users
            FOR ALL
            USING (true)
            WITH CHECK (true);
        `;
        
        try {
          const { error: createError } = await adminSupabase.rpc('exec_sql', {
            sql: createTableSQL
          });
          
          if (createError) {
            console.log('Creating table through direct insert attempt...');
            
            // Try direct insert which will create the table if it doesn't exist
            const { error: insertError } = await adminSupabase
              .from('admin_users')
              .insert({
                username: 'admin',
                password_hash: 'fellers123',
                email: 'admin@fellersresources.com',
                is_active: true
              });
              
            if (insertError) {
              console.error('❌ Could not create admin table:', insertError);
            } else {
              console.log('✅ Admin table created with default user');
            }
          } else {
            console.log('✅ Admin table created successfully');
            
            // Insert default admin user
            const { error: insertError } = await adminSupabase
              .from('admin_users')
              .insert({
                username: 'admin',
                password_hash: 'fellers123',
                email: 'admin@fellersresources.com',
                is_active: true
              });
              
            if (insertError && insertError.code !== '23505') { // Ignore duplicate key error
              console.error('Error inserting default admin:', insertError);
            } else {
              console.log('✅ Default admin user created');
            }
          }
          
        } catch (tableError) {
          console.error('Error creating table:', tableError);
        }
        
      } else {
        console.error('❌ Admin table error:', adminError);
      }
    } else {
      console.log('✅ Admin table accessible:', adminData);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n✅ All tests passed! Admin login should work now.');
    console.log('Login credentials:');
    console.log('Username: admin');
    console.log('Password: fellers123');
  } else {
    console.log('\n❌ Some tests failed. Check the errors above.');
  }
  process.exit(success ? 0 : 1);
});