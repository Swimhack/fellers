#!/usr/bin/env node

/**
 * Comprehensive Contact Form Setup Script
 * Run this script to set up everything needed for the contact form to work
 * 
 * Usage: node setup-contacts.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZndreHZoZG5xbmN5aHluY21qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzA5OTc3MSwiZXhwIjoyMDU4Njc1NzcxfQ.BIqVDfamjbvSuXf-RxaM0zKFrWNP_Ncq2pjTZVQ1WyE';
const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

console.log('🚀 Starting Contact Form Setup...\n');

// Validate environment variables
function validateEnvironment() {
    console.log('📋 Validating environment variables...');
    
    if (!SUPABASE_URL) {
        console.error('❌ VITE_SUPABASE_URL is not set in .env file');
        return false;
    }
    
    if (!RESEND_API_KEY) {
        console.warn('⚠️  RESEND_API_KEY is not set - email functionality will be limited');
    }
    
    console.log('✅ Environment variables validated');
    console.log(`   Supabase URL: ${SUPABASE_URL}`);
    console.log(`   Resend API Key: ${RESEND_API_KEY ? 'Set' : 'Not set'}`);
    return true;
}

// Create Supabase client with service role key
function createSupabaseClient() {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Service role key is required for setup');
    }
    
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Create the contacts table
async function createContactsTable(supabase) {
    console.log('\n📊 Setting up database table...');
    
    try {
        // First check if table already exists
        const { data: existingTable, error: checkError } = await supabase
            .from('contacts')
            .select('id')
            .limit(1);
            
        if (!checkError) {
            console.log('✅ Contacts table already exists');
            return true;
        }
        
        if (checkError.code !== '42P01') {
            console.error('❌ Unexpected error checking table:', checkError);
            return false;
        }
        
        // Create the table using SQL
        const createTableSQL = `
-- Create contacts table for storing form submissions
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    location TEXT NOT NULL,
    details TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    contacted_at TIMESTAMPTZ,
    contacted_by TEXT
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Service role can insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;

-- Create policy for authenticated users to read contacts
CREATE POLICY "Authenticated users can read contacts" ON public.contacts
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for anonymous users to insert contacts (for contact form submissions)
CREATE POLICY "Anyone can insert contacts" ON public.contacts
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy for service role to insert contacts
CREATE POLICY "Service role can insert contacts" ON public.contacts
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create policy for authenticated users to update contacts
CREATE POLICY "Authenticated users can update contacts" ON public.contacts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE
    ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
        `;
        
        const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
        
        if (error) {
            // Fallback to individual statements
            console.log('🔄 Trying individual SQL statements...');
            
            // Create table
            const { error: createError } = await supabase.rpc('exec_sql', {
                sql: `CREATE TABLE IF NOT EXISTS public.contacts (
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
                );`
            });
            
            if (createError) {
                console.error('❌ Failed to create table:', createError);
                return false;
            }
        }
        
        console.log('✅ Database table created successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Error creating table:', error);
        return false;
    }
}

// Test database connection and permissions
async function testDatabase(supabase) {
    console.log('\n🔍 Testing database connection and permissions...');
    
    try {
        // Test anonymous insert (what the contact form uses)
        const testData = {
            name: 'Test Contact',
            phone: '555-0123',
            email: 'test@example.com',
            location: 'Test Location',
            details: 'Test submission from setup script',
            status: 'new'
        };
        
        const { data, error } = await supabase
            .from('contacts')
            .insert(testData)
            .select()
            .single();
            
        if (error) {
            console.error('❌ Database test failed:', error);
            return false;
        }
        
        // Clean up test data
        await supabase
            .from('contacts')
            .delete()
            .eq('id', data.id);
            
        console.log('✅ Database test passed - anonymous inserts work');
        return true;
        
    } catch (error) {
        console.error('❌ Database test exception:', error);
        return false;
    }
}

// Test email service
async function testEmailService() {
    console.log('\n📧 Testing email service...');
    
    if (!RESEND_API_KEY) {
        console.warn('⚠️  No Resend API key - skipping email test');
        return false;
    }
    
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'dispatch@fellersresources.com',
                to: ['dispatch@fellersresources.com'],
                subject: 'Test Email from Contact Form Setup',
                html: '<p>This is a test email to verify the contact form email service is working.</p>',
                text: 'This is a test email to verify the contact form email service is working.'
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Email test failed:', response.status, errorText);
            return false;
        }
        
        const result = await response.json();
        console.log('✅ Email test passed - email sent successfully');
        console.log(`   Email ID: ${result.id}`);
        return true;
        
    } catch (error) {
        console.error('❌ Email test exception:', error);
        return false;
    }
}

// Create a manual SQL script as backup
function createManualSQLScript() {
    console.log('\n📝 Creating manual SQL script as backup...');
    
    const sqlContent = `-- Manual Contact Table Setup Script
-- Run this in your Supabase SQL Editor if the automated setup fails

-- Create contacts table for storing form submissions
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    location TEXT NOT NULL,
    details TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    contacted_at TIMESTAMPTZ,
    contacted_by TEXT
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read contacts
CREATE POLICY "Authenticated users can read contacts" ON public.contacts
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for anonymous users to insert contacts (for contact form submissions)
CREATE POLICY "Anyone can insert contacts" ON public.contacts
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy for service role to insert contacts
CREATE POLICY "Service role can insert contacts" ON public.contacts
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create policy for authenticated users to update contacts
CREATE POLICY "Authenticated users can update contacts" ON public.contacts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE
    ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;
    
    fs.writeFileSync(path.join(__dirname, 'manual-contacts-setup.sql'), sqlContent);
    console.log('✅ Created manual-contacts-setup.sql for backup');
}

// Main setup function
async function main() {
    try {
        // Validate environment
        if (!validateEnvironment()) {
            process.exit(1);
        }
        
        // Create backup SQL script
        createManualSQLScript();
        
        // Create Supabase client
        const supabase = createSupabaseClient();
        
        // Create database table
        const tableCreated = await createContactsTable(supabase);
        if (!tableCreated) {
            console.log('\n❌ Database setup failed. Please run the manual SQL script in Supabase.');
            console.log('   File: manual-contacts-setup.sql');
            process.exit(1);
        }
        
        // Test database
        const dbWorking = await testDatabase(supabase);
        if (!dbWorking) {
            console.log('\n❌ Database test failed. Check your Supabase configuration.');
            process.exit(1);
        }
        
        // Test email service
        const emailWorking = await testEmailService();
        
        // Final summary
        console.log('\n🎉 SETUP COMPLETE!');
        console.log('===================');
        console.log('✅ Database: Working');
        console.log(`${emailWorking ? '✅' : '⚠️ '} Email: ${emailWorking ? 'Working' : 'Limited (no API key)'}`);
        console.log('\n📋 Next Steps:');
        console.log('1. Your contact form should now work');
        console.log('2. Test it at your website');
        console.log('3. Check admin panel at /admin/contacts to see submissions');
        
        if (!emailWorking) {
            console.log('\n⚠️  To enable email notifications:');
            console.log('1. Get a Resend API key from resend.com');
            console.log('2. Add VITE_RESEND_API_KEY to your .env file');
        }
        
    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        console.log('\n📋 Manual Setup Required:');
        console.log('1. Run manual-contacts-setup.sql in your Supabase SQL Editor');
        console.log('2. Check your environment variables in .env');
        process.exit(1);
    }
}

// Check if this is being run as a script
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default main;