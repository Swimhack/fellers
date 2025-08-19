import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupAdminAuth() {
  console.log('Setting up admin authentication...');

  try {
    // Create admin_users table
    const { error: createTableError } = await supabase.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          email TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT true
        );
      `
    }).catch(err => {
      // Table might already exist, that's okay
      console.log('Table might already exist, continuing...');
      return { error: null };
    });

    // Hash the default password
    const defaultPassword = 'fellers123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    // Insert or update the default admin user
    const { data, error } = await supabase
      .from('admin_users')
      .upsert({
        username: 'admin',
        password_hash: passwordHash,
        email: 'admin@fellersresources.com',
        is_active: true
      }, {
        onConflict: 'username'
      });

    if (error) {
      console.error('Error setting up admin user:', error);
      
      // If the table doesn't exist, try creating it directly
      if (error.code === '42P01') {
        console.log('Table does not exist, creating it now...');
        
        // Use direct SQL to create the table
        const { error: execError } = await supabase
          .from('admin_users')
          .select('*')
          .limit(1);
          
        if (execError && execError.code === '42P01') {
          console.log('Admin users table needs to be created manually in Supabase dashboard.');
          console.log('Please run the following SQL in your Supabase SQL editor:');
          console.log(`
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

CREATE POLICY "Enable all operations for authenticated users" ON admin_users
  FOR ALL
  USING (true)
  WITH CHECK (true);
          `);
          console.log('\nThen run this script again to insert the admin user.');
          process.exit(1);
        }
      }
    } else {
      console.log('✅ Admin authentication setup complete!');
      console.log('Username: admin');
      console.log('Password: fellers123');
    }

    // Test the connection
    const { data: testData, error: testError } = await supabase
      .from('admin_users')
      .select('username')
      .eq('username', 'admin')
      .single();

    if (testData) {
      console.log('✅ Admin user verified in database');
    } else if (testError) {
      console.error('❌ Could not verify admin user:', testError);
    }

  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

setupAdminAuth();