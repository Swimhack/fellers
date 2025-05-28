
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, phone, email, location, details } = await req.json()

    // Get Mailgun credentials from Supabase secrets
    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY')
    const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN')
    const TO_EMAIL = Deno.env.get('TO_EMAIL') || 'dispatch@fellersresources.com'

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      throw new Error('Mailgun credentials not configured')
    }

    // Prepare the email content
    const emailData = new FormData()
    emailData.append('from', 'dispatch@fellersresources.com')
    emailData.append('to', TO_EMAIL)
    emailData.append('subject', `New Service Request from ${name}`)
    emailData.append('text', `
New service request received:

Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}
Details: ${details}

Please contact this customer as soon as possible.
    `)
    emailData.append('html', `
<h2>New Service Request</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
<p><strong>Email:</strong> ${email !== 'No email provided' ? `<a href="mailto:${email}">${email}</a>` : 'No email provided'}</p>
<p><strong>Location:</strong> ${location}</p>
<p><strong>Details:</strong></p>
<p>${details}</p>
<br>
<p><em>Please contact this customer as soon as possible.</em></p>
    `)

    // Send email via Mailgun
    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      },
      body: emailData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Mailgun error: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log('Email sent successfully:', result)

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
