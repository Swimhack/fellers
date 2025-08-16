
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging for environment variables
console.log('Supabase configuration check:');
console.log('URL present:', !!supabaseUrl);
console.log('Key present:', !!supabaseAnonKey);
console.log('URL:', supabaseUrl);

// Create a null client if environment variables are missing
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Test connection on initialization
if (supabase) {
  supabase.from('contacts').select('count', { count: 'exact', head: true })
    .then(({ error, count }) => {
      if (error) {
        console.error('❌ Supabase connection test failed:', error);
      } else {
        console.log('✅ Supabase connected successfully. Contact count:', count);
      }
    });
} else {
  console.error('❌ Supabase not configured - missing environment variables');
}
