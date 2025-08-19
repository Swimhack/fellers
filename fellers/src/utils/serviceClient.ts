import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Service client with elevated permissions for contact form submissions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ksmehxxzhtjqilrmikxb.supabase.co';
const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create service client if service key is available, otherwise use regular client
export const serviceClient = serviceKey 
  ? createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client

// Log configuration status
if (!serviceKey) {
  console.warn('VITE_SUPABASE_SERVICE_ROLE_KEY not configured, using regular client for admin operations');
} else {
  console.log('Service client configured with elevated permissions');
}

// Function specifically for contact form submissions
export const submitContactForm = async (contactData: {
  name: string;
  phone: string;
  email?: string | null;
  location: string;
  details: string;
}) => {
  try {
    const { data, error } = await serviceClient
      .from('contacts')
      .insert([{
        ...contactData,
        email: contactData.email || null,
        status: 'new',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return { success: false, error: error.message };
  }
};