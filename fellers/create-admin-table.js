import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cWJoZXFvc2ZqZGRtYnl0a3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU4Njg2NywiZXhwIjoyMDcwMTYyODY3fQ.2MdD875fF0UMqTJ66KiFlLniCKG-aDkvpY3-ZMe0R50';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createAdminTable() {
  console.log('Creating admin_users table...');
  
  try {
    // First, try to create table by inserting data (this will auto-create the table)
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        username: 'admin',
        password_hash: 'fellers123',
        email: 'admin@fellersresources.com',
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      if (error.code === 'PGRST204' || error.code === '42P01') {
        console.log('Table does not exist. Please create it manually in Supabase dashboard.');
        console.log('\nSQL to run in Supabase SQL Editor:');
        console.log(`
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for service role" ON admin_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO admin_users (username, password_hash, email, is_active)
VALUES ('admin', 'fellers123', 'admin@fellersresources.com', true);
        `);
        return false;
      } else {
        console.error('Error creating admin table:', error);
        return false;
      }
    }

    console.log('✅ Admin table created and default user inserted:', data);
    
    // Verify the user was created
    const { data: verifyData, error: verifyError } = await supabase
      .from('admin_users')
      .select('username, email, is_active')
      .eq('username', 'admin')
      .single();

    if (verifyData) {
      console.log('✅ Default admin user verified:', verifyData);
      return true;
    } else {
      console.error('❌ Could not verify admin user:', verifyError);
      return false;
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

createAdminTable().then(success => {
  if (success) {
    console.log('\n✅ Admin authentication is ready!');
    console.log('Login with:');
    console.log('Username: admin');
    console.log('Password: fellers123');
  } else {
    console.log('\n❌ Manual setup required. Please run the SQL provided above in your Supabase dashboard.');
  }
  process.exit(success ? 0 : 1);
});