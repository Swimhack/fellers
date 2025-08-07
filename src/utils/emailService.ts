// Alternative email service using direct API calls
export const sendContactEmail = async (contactData: {
  name: string;
  phone: string;
  email: string;
  location: string;
  details: string;
}) => {
  try {
    // Try to send via Resend API directly (if available)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'dispatch@fellersresources.com',
        to: ['dispatch@fellersresources.com'],
        subject: `New Service Request: ${contactData.name}`,
        html: `
          <h2>New Service Request</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Phone:</strong> <a href="tel:${contactData.phone}">${contactData.phone}</a></p>
          <p><strong>Email:</strong> ${contactData.email !== 'No email provided' ? `<a href="mailto:${contactData.email}">${contactData.email}</a>` : 'No email provided'}</p>
          <p><strong>Location:</strong> ${contactData.location}</p>
          <p><strong>Details:</strong></p>
          <p>${contactData.details}</p>
          <br>
          <p><em>Please contact this customer as soon as possible.</em></p>
        `,
        text: `
New service request received:

Name: ${contactData.name}
Phone: ${contactData.phone}
Email: ${contactData.email}
Location: ${contactData.location}
Details: ${contactData.details}

Please contact this customer as soon as possible.
        `
      })
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
};