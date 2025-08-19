import { chromium } from 'playwright';

async function testConsolidatedContactSystem() {
  console.log('🚀 Starting Consolidated Contact Form System Test');
  console.log('=' .repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false, // Set to true for headless testing
    slowMo: 1000 // Slow down for visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track console errors
  const consoleErrors = [];
  const consoleWarnings = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('❌ Console Error:', msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
      console.log('⚠️  Console Warning:', msg.text());
    }
  });
  
  // Track network errors
  const networkErrors = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push(`${response.status()} - ${response.url()}`);
      console.log(`❌ Network Error: ${response.status()} - ${response.url()}`);
    }
  });
  
  let testResults = {
    formSubmission: false,
    databaseIntegration: false,
    supabaseConnection: true,
    emailService: true,
    overallSystem: false
  };
  
  try {
    console.log('\n📍 Step 1: Navigating to main website...');
    await page.goto('https://fellersresources.fly.dev', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Website loaded successfully');
    
    // Wait for page to be fully loaded
    await page.waitForTimeout(2000);
    
    console.log('\n📍 Step 2: Looking for contact form...');
    
    // Try multiple selectors for the contact form
    const contactFormSelectors = [
      'form[data-testid="contact-form"]',
      'form:has(input[name="name"]):has(input[name="email"])',
      '.contact-form',
      '#contact-form',
      'form:has(input[placeholder*="Name"i])'
    ];
    
    let contactForm = null;
    for (const selector of contactFormSelectors) {
      try {
        contactForm = await page.locator(selector).first();
        if (await contactForm.isVisible()) {
          console.log(`✅ Found contact form using selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!contactForm || !(await contactForm.isVisible())) {
      // Try scrolling to find the form
      console.log('🔍 Scrolling to find contact form...');
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(2000);
      
      // Try again
      for (const selector of contactFormSelectors) {
        try {
          contactForm = await page.locator(selector).first();
          if (await contactForm.isVisible()) {
            console.log(`✅ Found contact form after scrolling: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
    }
    
    if (!contactForm || !(await contactForm.isVisible())) {
      throw new Error('Could not locate contact form on the page');
    }
    
    console.log('\n📍 Step 3: Filling out contact form...');
    
    // Fill out the form fields
    const testData = {
      name: 'System Test User',
      phone: '555-999-1234',
      email: 'systemtest@example.com',
      location: 'Test City, TX',
      details: 'Consolidated system test - heavy truck breakdown'
    };
    
    // Try different field selectors
    const fieldSelectors = {
      name: ['input[name="name"]', 'input[placeholder*="Name"i]', '#name'],
      phone: ['input[name="phone"]', 'input[placeholder*="Phone"i]', '#phone'],
      email: ['input[name="email"]', 'input[placeholder*="Email"i]', '#email'],
      location: ['input[name="location"]', 'input[placeholder*="Location"i]', '#location'],
      details: ['textarea[name="details"]', 'textarea[name="message"]', 'textarea[placeholder*="Details"i]', '#details', '#message']
    };
    
    for (const [fieldName, selectors] of Object.entries(fieldSelectors)) {
      let filled = false;
      for (const selector of selectors) {
        try {
          const field = page.locator(selector);
          if (await field.isVisible()) {
            await field.fill(testData[fieldName]);
            console.log(`✅ Filled ${fieldName}: ${testData[fieldName]}`);
            filled = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      if (!filled) {
        console.log(`⚠️  Could not find field: ${fieldName}`);
      }
    }
    
    console.log('\n📍 Step 4: Submitting form...');
    
    // Submit the form
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Submit")',
      'button:has-text("Send")',
      '.submit-btn'
    ];
    
    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const submitBtn = page.locator(selector);
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          console.log(`✅ Clicked submit button: ${selector}`);
          submitted = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!submitted) {
      throw new Error('Could not find or click submit button');
    }
    
    // Wait for submission response
    await page.waitForTimeout(3000);
    
    // Look for success message
    const successSelectors = [
      '.success-message',
      '.alert-success',
      '[data-testid="success-message"]',
      'text=Thank you',
      'text=Success',
      'text=Message sent'
    ];
    
    let successFound = false;
    for (const selector of successSelectors) {
      try {
        const successMsg = page.locator(selector);
        if (await successMsg.isVisible()) {
          console.log('✅ Success message found!');
          successFound = true;
          testResults.formSubmission = true;
          break;
        }
      } catch (e) {
        // Continue
      }
    }
    
    if (!successFound) {
      console.log('⚠️  No success message found - checking for other indicators...');
      // Check if form was cleared (another indicator of success)
      try {
        const nameField = page.locator('input[name="name"]').first();
        const value = await nameField.inputValue();
        if (value === '') {
          console.log('✅ Form was cleared - likely successful submission');
          testResults.formSubmission = true;
        }
      } catch (e) {
        // Continue
      }
    }
    
    console.log('\n📍 Step 5: Testing admin panel access...');
    
    // Navigate to admin panel
    await page.goto('https://fellersresources.fly.dev/admin', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Login to admin
    try {
      const usernameField = page.locator('input[name="username"], input[type="text"]').first();
      const passwordField = page.locator('input[name="password"], input[type="password"]').first();
      
      if (await usernameField.isVisible() && await passwordField.isVisible()) {
        await usernameField.fill('admin');
        await passwordField.fill('fellers123');
        
        const loginBtn = page.locator('button[type="submit"], button:has-text("Login")').first();
        await loginBtn.click();
        
        await page.waitForTimeout(3000);
        console.log('✅ Admin login attempted');
      }
    } catch (e) {
      console.log('⚠️  Admin login failed:', e.message);
    }
    
    console.log('\n📍 Step 6: Checking contacts in admin panel...');
    
    // Look for contacts page or contact data
    const contactsSelectors = [
      'a:has-text("Contacts")',
      'a:has-text("Contact")',
      '.contacts-link',
      '[href*="contact"]'
    ];
    
    for (const selector of contactsSelectors) {
      try {
        const contactsLink = page.locator(selector);
        if (await contactsLink.isVisible()) {
          await contactsLink.click();
          await page.waitForTimeout(2000);
          console.log('✅ Navigated to contacts section');
          break;
        }
      } catch (e) {
        // Continue
      }
    }
    
    // Look for the test submission in the contacts list
    try {
      const testSubmission = page.locator('text=System Test User');
      if (await testSubmission.isVisible()) {
        console.log('✅ Test submission found in admin contacts!');
        testResults.databaseIntegration = true;
      } else {
        console.log('❌ Test submission not found in admin contacts');
      }
    } catch (e) {
      console.log('⚠️  Could not verify test submission in admin panel');
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
  
  // Check for Supabase-related errors
  const supabaseErrors = consoleErrors.filter(error => 
    error.toLowerCase().includes('supabase') || 
    error.toLowerCase().includes('database') ||
    error.toLowerCase().includes('connection')
  );
  
  if (supabaseErrors.length > 0) {
    console.log('❌ Supabase connection errors detected:', supabaseErrors);
    testResults.supabaseConnection = false;
  }
  
  // Check for email-related errors
  const emailErrors = consoleErrors.filter(error => 
    error.toLowerCase().includes('email') || 
    error.toLowerCase().includes('emailjs')
  );
  
  if (emailErrors.length > 0) {
    console.log('❌ Email service errors detected:', emailErrors);
    testResults.emailService = false;
  }
  
  // Overall system assessment
  testResults.overallSystem = testResults.formSubmission && testResults.databaseIntegration && testResults.supabaseConnection;
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 CONSOLIDATED CONTACT SYSTEM TEST RESULTS');
  console.log('=' .repeat(60));
  
  console.log(`Database Integration: ${testResults.databaseIntegration ? '✅' : '❌'} (Is the submission visible in admin panel?)`);
  console.log(`Supabase Connection: ${testResults.supabaseConnection ? '✅' : '❌'} (Any connection errors in console?)`);
  console.log(`Email Service: ${testResults.emailService ? '✅' : '❌'} (Any email-related errors?)`);
  console.log(`Form Submission: ${testResults.formSubmission ? '✅' : '❌'} (Did form submit successfully?)`);
  console.log(`Overall System: ${testResults.overallSystem ? '✅' : '❌'} (Is the consolidated system working?)`);
  
  if (consoleErrors.length > 0) {
    console.log('\n🐛 Console Errors Found:');
    consoleErrors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (networkErrors.length > 0) {
    console.log('\n🌐 Network Errors Found:');
    networkErrors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (consoleWarnings.length > 0) {
    console.log('\n⚠️  Console Warnings:');
    consoleWarnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('\n' + '=' .repeat(60));
  
  if (testResults.overallSystem) {
    console.log('🎉 SUCCESS: Consolidated contact system is working correctly!');
  } else {
    console.log('⚠️  ISSUES DETECTED: Please review the test results above');
  }
  
  await browser.close();
  return testResults;
}

// Run the test
testConsolidatedContactSystem().catch(console.error);