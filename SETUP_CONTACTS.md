# Contact Form Setup Instructions

## Database Setup

1. **Run the SQL migration in Supabase:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and run the contents of `supabase/migrations/001_create_contacts_table.sql`
   - This will create the `contacts` table with proper structure and permissions

2. **Configure Supabase Edge Functions:**
   - Deploy the edge function in `supabase/functions/send-contact-email/`
   - Set the following environment variables in Supabase Edge Functions settings:
     - `RESEND_API_KEY`: Your Resend API key
     - `FROM_EMAIL`: The sender email address
     - `TO_EMAIL`: The recipient email address for notifications

3. **Environment Variables:**
   - Copy `.env.example` to `.env` (if not already done)
   - Ensure these variables are set:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

## Features

### Contact Form
- Located on the main page at `/#contact`
- Collects: Name, Phone, Email (optional), Location, and Vehicle/Load Details
- Submissions are:
  1. Saved to Supabase database
  2. Email notification sent via Resend

### Admin Contact Management
- Access at `/admin/contacts` (requires admin login)
- Features:
  - View all contact submissions
  - Filter by status (New, Contacted, Completed, Cancelled)
  - Update contact status
  - Add internal notes
  - Track when contacts were reached
  - Click-to-call and click-to-email functionality

## Testing

1. Submit a test contact form on the main site
2. Check the admin panel at `/admin/contacts` to verify submission appears
3. Check email for notification (if Resend is configured)

## Security Notes

- The `.env` file is gitignored and should never be committed
- Service role keys should only be used in edge functions, never in client code
- The admin area is protected by authentication