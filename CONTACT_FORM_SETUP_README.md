# 🚀 Contact Form Setup Guide

Your contact form is failing because the database table doesn't exist yet. This guide will fix that!

## Quick Setup (Recommended)

### Option 1: Run the Automated Setup Script

**Windows:**
1. Double-click `setup-contacts.bat`
2. Wait for it to complete
3. Test your contact form!

**Mac/Linux:**
```bash
npm install dotenv
npm run setup-contacts
```

### Option 2: Manual Setup

If the automated setup fails, follow these steps:

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Open your project: `icfwkxvhdnqncyhyncmj`

2. **Run the SQL Migration**
   - Go to "SQL Editor"
   - Copy and paste the contents of `manual-contacts-setup.sql`
   - Click "Run"

3. **Test the Database**
   - Go to "Table Editor"
   - You should see a new "contacts" table
   - Try inserting a test row

## What the Setup Does

✅ **Creates the contacts table** with proper structure
✅ **Sets up database permissions** so the contact form can save
✅ **Configures email service** (if you have a Resend API key)
✅ **Tests everything** to make sure it works

## After Setup

1. **Test your contact form** - it should now save to database
2. **Check the admin panel** at `/admin/contacts` to see submissions
3. **Verify emails are working** (if configured)

## Environment Variables

Your `.env` file should have:
```env
VITE_SUPABASE_URL=https://icfwkxvhdnqncyhyncmj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RESEND_API_KEY=re_37YYP2iE_KbLqkdskcjngf9XqFMJZv1xG  # Optional for email
```

## Common Issues & Solutions

### "Failed to send your request" Error
- **Cause:** Database table doesn't exist
- **Solution:** Run the setup script or manual SQL

### Email Not Working
- **Cause:** No Resend API key or domain not verified
- **Solution:** 
  1. Get API key from https://resend.com
  2. Verify your domain `fellersresources.com` in Resend
  3. Add `VITE_RESEND_API_KEY` to `.env`

### Database Permission Errors
- **Cause:** Row Level Security policies not configured
- **Solution:** Run the setup script which configures permissions

## Files Created by This Setup

- `manual-contacts-setup.sql` - Backup SQL script to run manually
- `setup-contacts.js` - Automated setup script
- `setup-contacts.bat` - Windows batch file for easy setup

## Need Help?

If you still have issues:
1. Check the browser console for error details
2. Check Supabase logs for database errors
3. Verify your `.env` file has correct values
4. Make sure your domain is verified in Resend (for email)

## Testing Checklist

After setup, verify these work:
- [ ] Contact form submits without errors
- [ ] Submissions appear in `/admin/contacts`
- [ ] Email notifications are received (if configured)
- [ ] Form shows success message after submission