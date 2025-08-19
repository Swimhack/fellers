import { createClient } from '@supabase/supabase-js';

// Create a service client that bypasses RLS for contact form submissions
export const submitContact = async (contactData: {
  name: string;
  phone: string;
  email?: string | null;
  location: string;
  details: string;
}) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase configuration');
  }

  // Try Edge Function first (if deployed)
  try {
    const functionUrl = `${supabaseUrl}/functions/v1/submit-contact`;
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify(contactData)
    });
    
    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result.data };
    }
  } catch (error) {
    console.log('Edge Function not available, using direct insert');
  }

  // Fallback to direct insert with anon key
  const supabase = createClient(supabaseUrl, anonKey);
  
  const { data, error } = await supabase
    .from('contacts')
    .insert([{
      ...contactData,
      email: contactData.email || null,
      status: 'new',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    // If RLS blocks it, provide detailed error info
    if (error.code === '42501') {
      console.error('RLS Policy Error - Need to fix database permissions');
      console.error('Run this SQL in Supabase dashboard:');
      console.error(`
        DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;
        CREATE POLICY "Allow anonymous inserts" ON public.contacts
        FOR INSERT TO anon, authenticated
        WITH CHECK (true);
      `);
    }
    throw error;
  }

  return { success: true, data };
};