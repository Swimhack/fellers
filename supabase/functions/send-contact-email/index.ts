
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

    // Get Resend credentials from Supabase secrets
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'dispatch@fellersresources.com'
    const TO_EMAIL = Deno.env.get('TO_EMAIL') || 'dispatch@fellersresources.com'

    if (!RESEND_API_KEY) {
      throw new Error('Resend API key not configured')
    }

    // Prepare the email content for Resend
    const emailData = {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `New Service Request from ${name}`,
      text: `
New service request received:

Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}
Details: ${details}

Please contact this customer as soon as possible.
      `,
      html: `
<h2>New Service Request</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
<p><strong>Email:</strong> ${email !== 'No email provided' ? `<a href="mailto:${email}">${email}</a>` : 'No email provided'}</p>
<p><strong>Location:</strong> ${location}</p>
<p><strong>Details:</strong></p>
<p>${details}</p>
<br>
<p><em>Please contact this customer as soon as possible.</em></p>
      `
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Resend error: ${response.status} ${errorText}`)
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
