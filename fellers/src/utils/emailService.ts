import { supabase } from '@/integrations/supabase/client';

// Email service using Supabase Edge Function to avoid CORS issues
export const sendContactEmail = async (contactData: {
  name: string;
  phone: string;
  email: string;
  location: string;
  details: string;
}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    console.log('Sending email via Supabase Edge Function...');
    
    // Use Supabase Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-contact-email', {
      body: {
        name: contactData.name,
        phone: contactData.phone,
        email: contactData.email,
        location: contactData.location,
        details: contactData.details
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    if (data?.success) {
      console.log('Email sent successfully via Supabase Edge Function:', data);
      return { success: true, data };
    } else {
      throw new Error('Email function returned failure');
    }
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
};