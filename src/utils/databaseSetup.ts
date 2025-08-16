import { supabase } from '@/integrations/supabase/client';

// Function to check if contacts table exists and create it if not
export const ensureContactsTable = async () => {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // First, try to check if the table exists by attempting a simple query
    const { data, error } = await supabase
      .from('contacts')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('Contacts table does not exist, attempting to create...');
        // Table doesn't exist, try to create it
        return await createContactsTable();
      } else if (error.code === '42501') {
        console.log('Contacts table exists but lacks permissions');
        return { success: false, error: 'Database permissions need to be configured' };
      } else {
        console.error('Unknown database error:', error);
        return { success: false, error: error.message };
      }
    }

    console.log('Contacts table exists and is accessible');
    return { success: true };
  } catch (exception) {
    console.error('Database check exception:', exception);
    return { success: false, error: exception };
  }
};

// Function to create the contacts table (requires service role key)
const createContactsTable = async () => {
  try {
    // This would need to be run with service role permissions
    // For now, just return an error message
    console.error('Cannot create table from client - requires admin access');
    return { 
      success: false, 
      error: 'Table creation requires database admin access. Please run the SQL migration manually.' 
    };
  } catch (error) {
    console.error('Table creation failed:', error);
    return { success: false, error };
  }
};

// Test database connectivity
export const testDatabaseConnection = async () => {
  if (!supabase) {
    return { connected: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.from('contacts').select('count').limit(1);
    
    if (error) {
      return { connected: false, error: error.message, code: error.code };
    }
    
    return { connected: true };
  } catch (exception) {
    return { connected: false, error: exception };
  }
};