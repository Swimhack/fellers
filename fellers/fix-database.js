#!/usr/bin/env node

/**
 * Emergency Database Fix Script
 * This script creates the missing contacts table in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZndreHZoZG5xbmN5aHluY21qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzA5OTc3MSwiZXhwIjoyMDU4Njc1NzcxfQ.BIqVDfamjbvSuXf-RxaM0zKFrWNP_Ncq2pjTZVQ1WyE';

console.log('🚨 EMERGENCY DATABASE FIX - Creating contacts table...\n');

async function createContactsTable() {
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        console.log('📊 Creating contacts table...');
        
        // Create the table with a simple approach
        const { data, error } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS public.contacts (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    name TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    email TEXT,
                    location TEXT NOT NULL,
                    details TEXT NOT NULL,
                    status TEXT DEFAULT 'new',
                    notes TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW(),
                    contacted_at TIMESTAMPTZ,
                    contacted_by TEXT
                );

                ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

                CREATE POLICY IF NOT EXISTS "Anyone can insert contacts" ON public.contacts
                    FOR INSERT
                    TO anon
                    WITH CHECK (true);

                CREATE POLICY IF NOT EXISTS "Authenticated users can read contacts" ON public.contacts
                    FOR SELECT
                    TO authenticated
                    USING (true);

                CREATE POLICY IF NOT EXISTS "Authenticated users can update contacts" ON public.contacts
                    FOR UPDATE
                    TO authenticated
                    USING (true)
                    WITH CHECK (true);
            `
        });
        
        if (error) {
            console.error('❌ Error creating table with rpc:', error);
            
            // Try alternative approach - direct table creation
            console.log('🔄 Trying alternative approach...');
            
            const { error: altError } = await supabase
                .from('contacts')
                .select('id')
                .limit(1);
                
            if (altError && altError.code === '42P01') {
                console.log('✅ Confirmed table does not exist - manual creation needed');
                console.log('\n📋 MANUAL STEPS REQUIRED:');
                console.log('1. Go to https://supabase.com/dashboard');
                console.log('2. Navigate to your project: icfwkxvhdnqncyhyncmj');
                console.log('3. Go to SQL Editor');
                console.log('4. Run the SQL from manual-contacts-setup.sql');
                return false;
            }
        } else {
            console.log('✅ Table created successfully!');
        }
        
        // Test the table
        console.log('🔍 Testing table...');
        const { data: testData, error: testError } = await supabase
            .from('contacts')
            .insert({
                name: 'Test User',
                phone: '555-0123',
                email: 'test@example.com',
                location: 'Test Location',
                details: 'Test submission'
            })
            .select()
            .single();
            
        if (testError) {
            console.error('❌ Table test failed:', testError);
            return false;
        }
        
        // Clean up test data
        await supabase
            .from('contacts')
            .delete()
            .eq('id', testData.id);
            
        console.log('✅ Table test passed!');
        console.log('\n🎉 DATABASE FIXED! Contact form should now work.');
        return true;
        
    } catch (error) {
        console.error('❌ Script error:', error);
        return false;
    }
}

createContactsTable().then(success => {
    if (!success) {
        console.log('\n❌ Automatic fix failed. Please run manual SQL script.');
        process.exit(1);
    } else {
        console.log('\n✅ Database fix complete! Run the contact test again.');
        process.exit(0);
    }
});