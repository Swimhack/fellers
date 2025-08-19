import { chromium } from 'playwright';

async function testContactForm() {
  console.log('🚀 Starting Fellers Resources Contact Form Test');
  console.log('================================================');
  
  const browser = await chromium.launch({ 
    headless: false, // Set to true for headless mode
    slowMo: 1000 // Slow down actions for better visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Array to collect console messages and errors
  const consoleMessages = [];
  const errors = [];
  
  // Listen for console messages
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    console.log('\n📍 Step 1: Navigate to https://fellersresources.fly.dev');
    await page.goto('https://fellersresources.fly.dev');
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded successfully');
    
    console.log('\n📍 Step 2: Scroll down to find the contact form section');
    // Look for contact form - try multiple possible selectors
    let contactForm = null;
    const possibleSelectors = [
      'form[data-testid="contact-form"]',
      'form:has(input[name="name"], input[name="email"])',
      '#contact form',
      '.contact form',
      'form:has(input[type="email"])'
    ];
    
    for (const selector of possibleSelectors) {
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
    
    if (!contactForm || !await contactForm.isVisible()) {
      // Scroll down to look for the form
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      
      // Try to find contact section and scroll to it
      const contactSection = page.locator('section:has-text("Contact"), #contact, .contact').first();
      if (await contactSection.isVisible()) {
        await contactSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        console.log('✅ Scrolled to contact section');
      }
    }
    
    console.log('\n📍 Step 3: Fill out contact form with test data');
    
    // Test data
    const testData = {
      name: "Test Customer",
      phone: "555-123-4567", 
      email: "test@example.com",
      location: "Test Location, TX",
      details: "Test vehicle breakdown - need heavy duty towing"
    };
    
    // Try to fill form fields with various possible selectors
    const fieldMappings = [
      { name: 'name', value: testData.name, selectors: ['input[name="name"]', 'input[placeholder*="name" i]', '#name'] },
      { name: 'phone', value: testData.phone, selectors: ['input[name="phone"]', 'input[placeholder*="phone" i]', '#phone', 'input[type="tel"]'] },
      { name: 'email', value: testData.email, selectors: ['input[name="email"]', 'input[type="email"]', '#email'] },
      { name: 'location', value: testData.location, selectors: ['input[name="location"]', 'input[placeholder*="location" i]', '#location'] },
      { name: 'details', value: testData.details, selectors: ['textarea[name="message"]', 'textarea[name="details"]', 'textarea[placeholder*="details" i]', '#message', '#details'] }
    ];
    
    for (const field of fieldMappings) {
      let filled = false;
      for (const selector of field.selectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible()) {
            await element.fill(field.value);
            console.log(`✅ Filled ${field.name} field`);
            filled = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      if (!filled) {
        console.log(`⚠️  Could not find ${field.name} field`);
      }
    }
    
    console.log('\n📍 Step 4: Submit the form');
    
    // Try to find and click submit button
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Submit")',
      'button:has-text("Send")',
      'button:has-text("Contact")',
      '.submit-btn',
      '#submit'
    ];
    
    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const submitBtn = page.locator(selector).first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          console.log('✅ Form submitted');
          submitted = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!submitted) {
      console.log('⚠️  Could not find submit button');
    }
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    console.log('\n📍 Step 5: Verify success message');
    
    // Look for success messages
    const successSelectors = [
      '.success',
      '.alert-success',
      '[data-testid="success-message"]',
      ':text("success")',
      ':text("sent")',
      ':text("thank you")',
      ':text("received")'
    ];
    
    let successFound = false;
    for (const selector of successSelectors) {
      try {
        const successElement = page.locator(selector).first();
        if (await successElement.isVisible()) {
          const text = await successElement.textContent();
          console.log(`✅ Success message found: "${text}"`);
          successFound = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!successFound) {
      console.log('⚠️  No success message found');
    }
    
    console.log('\n📍 Step 6: Check console for errors');
    
    if (errors.length > 0) {
      console.log('❌ JavaScript Errors Found:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ No JavaScript errors found');
    }
    
    if (consoleMessages.length > 0) {
      console.log('\n📝 Console Messages:');
      consoleMessages.forEach((msg, index) => {
        console.log(`  ${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      });
    }
    
    console.log('\n📍 Step 7: Test admin login');
    
    await page.goto('https://fellersresources.fly.dev/admin');
    await page.waitForLoadState('networkidle');
    
    // Try to find login form
    const usernameSelectors = ['input[name="username"]', 'input[type="text"]', '#username'];
    const passwordSelectors = ['input[name="password"]', 'input[type="password"]', '#password'];
    
    let loginFound = false;
    for (const usernameSelector of usernameSelectors) {
      for (const passwordSelector of passwordSelectors) {
        try {
          const usernameField = page.locator(usernameSelector).first();
          const passwordField = page.locator(passwordSelector).first();
          
          if (await usernameField.isVisible() && await passwordField.isVisible()) {
            await usernameField.fill('admin');
            await passwordField.fill('fellers123');
            
            // Find login button
            const loginBtnSelectors = [
              'button[type="submit"]',
              'input[type="submit"]',
              'button:has-text("Login")',
              'button:has-text("Sign in")'
            ];
            
            for (const btnSelector of loginBtnSelectors) {
              try {
                const loginBtn = page.locator(btnSelector).first();
                if (await loginBtn.isVisible()) {
                  await loginBtn.click();
                  loginFound = true;
                  console.log('✅ Admin login attempted');
                  break;
                }
              } catch (e) {
                // Continue
              }
            }
            break;
          }
        } catch (e) {
          // Continue to next combination
        }
      }
      if (loginFound) break;
    }
    
    if (!loginFound) {
      console.log('⚠️  Could not find admin login form');
    }
    
    // Wait for login response
    await page.waitForTimeout(3000);
    
    console.log('\n📍 Step 8: Navigate to contacts page');
    
    // Check if we're logged in by looking for admin interface
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    // Try to find contacts page or navigation
    const contactsLinkSelectors = [
      'a[href*="contacts"]',
      'a:has-text("Contacts")',
      'nav a:has-text("Contacts")',
      '.nav-link:has-text("Contacts")'
    ];
    
    let contactsPageFound = false;
    for (const selector of contactsLinkSelectors) {
      try {
        const contactsLink = page.locator(selector).first();
        if (await contactsLink.isVisible()) {
          await contactsLink.click();
          await page.waitForTimeout(2000);
          console.log('✅ Navigated to contacts page');
          contactsPageFound = true;
          break;
        }
      } catch (e) {
        // Continue
      }
    }
    
    if (!contactsPageFound) {
      // Try direct navigation
      try {
        await page.goto('https://fellersresources.fly.dev/admin/contacts');
        await page.waitForLoadState('networkidle');
        console.log('✅ Attempted direct navigation to contacts page');
      } catch (e) {
        console.log('⚠️  Could not access contacts page');
      }
    }
    
    // Look for the test submission
    console.log('\n📍 Step 9: Verify test submission appears in admin panel');
    
    const testSubmissionSelectors = [
      ':text("Test Customer")',
      ':text("test@example.com")',
      ':text("555-123-4567")',
      'table tbody tr',
      '.contact-entry',
      '.submission'
    ];
    
    let submissionFound = false;
    for (const selector of testSubmissionSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          const text = await element.textContent();
          if (text.includes('Test Customer') || text.includes('test@example.com')) {
            console.log(`✅ Test submission found: "${text}"`);
            submissionFound = true;
            break;
          }
        }
      } catch (e) {
        // Continue
      }
    }
    
    if (!submissionFound) {
      console.log('⚠️  Test submission not found in admin panel');
    }
    
    // Take a screenshot for reference
    await page.screenshot({ path: '/mnt/c/STRICKLAND/Strickland Technology Marketing/fellersresources.com/fellers/test-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as test-screenshot.png');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n================================================');
  console.log('🏁 Contact Form Test Complete');
  console.log('================================================');
}

// Run the test
testContactForm().catch(console.error);