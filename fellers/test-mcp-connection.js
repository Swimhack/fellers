// Test MCP connection to Supabase
import { createClient } from '@supabase/supabase-js';

// Test with environment variables first
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mzqbheqosfjddmbytkzz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing MCP Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key present:', !!supabaseKey);

if (!supabaseKey) {
  console.log('❌ Missing VITE_SUPABASE_ANON_KEY');
  console.log('📝 You need to:');
  console.log('1. Get the new anon key from Supabase dashboard');
  console.log('2. Update .env file with new key');
  console.log('3. Update fly.toml with new key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('🧪 Test 1: Basic connection...');
    const { error: healthError } = await supabase
      .from('contacts')
      .select('count', { count: 'exact', head: true });
    
    if (healthError) {
      console.log('❌ Connection failed:', healthError.message);
      console.log('Code:', healthError.code);
      
      if (healthError.code === '42P01') {
        console.log('💡 Table missing - but connection works!');
        console.log('✅ Database connection is functional');
        console.log('📋 Need to create contacts table');
        return { connected: true, tableExists: false };
      } else {
        return { connected: false, tableExists: false, error: healthError };
      }
    }
    
    console.log('✅ Database connection successful!');
    
    // Test 2: Query existing data
    console.log('🧪 Test 2: Query contacts...');
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('❌ Query failed:', error.message);
      return { connected: true, tableExists: false, error };
    }
    
    console.log('✅ Query successful!');
    console.log('📊 Found', data.length, 'contacts');
    
    if (data.length > 0) {
      console.log('📄 Latest contact:', {
        name: data[0].name,
        created: data[0].created_at
      });
    }
    
    return { connected: true, tableExists: true, data };
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return { connected: false, tableExists: false, error };
  }
}

testConnection()
  .then(result => {
    console.log('');
    console.log('🎯 Test Results:');
    console.log('Connected:', result.connected ? '✅' : '❌');
    console.log('Table exists:', result.tableExists ? '✅' : '❌');
    
    if (result.connected && result.tableExists) {
      console.log('🎉 MCP Supabase connection is ready!');
      console.log('🔧 You can now use Supabase MCP tools for database queries');
    } else if (result.connected && !result.tableExists) {
      console.log('⚠️  Database connected but table missing');
      console.log('📋 Run the table creation SQL first');
    } else {
      console.log('❌ Connection failed');
      console.log('🔧 Check API keys and project configuration');
    }
    
    process.exit(result.connected ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });