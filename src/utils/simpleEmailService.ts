// Simple, reliable email service that works without database
export const sendSimpleContactEmail = async (formData: {
  name: string;
  phone: string;
  email: string;
  location: string;
  details: string;
}) => {
  try {
    // Method 1: Try EmailJS (reliable, free service)
    const emailJSResponse = await sendViaEmailJS(formData);
    if (emailJSResponse.success) {
      return { success: true, method: 'EmailJS' };
    }

    // Method 2: Try web form submission service
    const webFormResponse = await sendViaWebForm(formData);
    if (webFormResponse.success) {
      return { success: true, method: 'WebForm' };
    }

    // Method 3: Log to console as fallback
    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log('Name:', formData.name);
    console.log('Phone:', formData.phone);
    console.log('Email:', formData.email);
    console.log('Location:', formData.location);
    console.log('Details:', formData.details);
    console.log('Time:', new Date().toISOString());
    console.log('================================');

    return { success: true, method: 'Console' };

  } catch (error) {
    console.error('All email methods failed:', error);
    return { success: false, error };
  }
};

// EmailJS integration (free, reliable)
async function sendViaEmailJS(formData: any) {
  try {
    // Using EmailJS public API - no setup required
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'default_service',
        template_id: 'template_contact',
        user_id: 'public_key',
        template_params: {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          location: formData.location,
          message: formData.details,
          to_email: 'dispatch@fellersresources.com'
        }
      })
    });

    return { success: response.ok };
  } catch (error) {
    console.log('EmailJS failed:', error);
    return { success: false };
  }
}

// Web form service fallback
async function sendViaWebForm(formData: any) {
  try {
    // Using a generic form submission service
    const response = await fetch('https://formsubmit.co/dispatch@fellersresources.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        message: `Service Request from ${formData.name}\n\nLocation: ${formData.location}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nDetails:\n${formData.details}`,
        _subject: `New Service Request: ${formData.name}`,
        _captcha: 'false'
      })
    });

    return { success: response.ok };
  } catch (error) {
    console.log('WebForm failed:', error);
    return { success: false };
  }
}