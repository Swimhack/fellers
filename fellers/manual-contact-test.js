import { chromium } from 'playwright';

async function testContactFormWithSpecificData() {
  console.log('🚀 Starting Manual Contact Form Test with MCP Test Data');
  console.log('=======================================================');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Collect console messages and errors
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
  });
  
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      timestamp: new Date().toISOString()
    });
  });
  
  try {
    console.log('\n📍 Step 1: Navigate to https://fellersresources.fly.dev');
    await page.goto('https://fellersresources.fly.dev');
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded successfully');
    
    console.log('\n📍 Step 2: Locate contact form');
    // Scroll to contact section
    const contactSection = page.locator('#contact').first();
    if (await contactSection.isVisible()) {
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      console.log('✅ Scrolled to contact section');
    }
    
    console.log('\n📍 Step 3: Fill out form with MCP test data');
    
    // Exact test data requested
    const testData = {
      name: "MCP Test Contact",
      phone: "555-MCP-TEST",
      email: "", // Leave email empty as requested
      location: "Test Location",
      details: "Testing MCP setup and database connectivity"
    };
    
    // Fill form fields
    await page.locator('input[name="name"]').fill(testData.name);
    console.log('✅ Filled name: MCP Test Contact');
    
    await page.locator('input[name="phone"]').fill(testData.phone);
    console.log('✅ Filled phone: 555-MCP-TEST');
    
    // Skip email field as requested
    
    await page.locator('input[name="location"]').fill(testData.location);
    console.log('✅ Filled location: Test Location');
    
    await page.locator('textarea[name="details"]').fill(testData.details);
    console.log('✅ Filled details: Testing MCP setup and database connectivity');
    
    console.log('\n📍 Step 4: Submit the form');
    
    // Take screenshot before submission
    await page.screenshot({ path: '/mnt/c/STRICKLAND/Strickland Technology Marketing/fellersresources.com/fellers/before-submit.png' });
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    console.log('✅ Form submitted');
    
    // Wait for response
    await page.waitForTimeout(5000);
    
    console.log('\n📍 Step 5: Check for success/error messages');
    
    // Take screenshot after submission
    await page.screenshot({ path: '/mnt/c/STRICKLAND/Strickland Technology Marketing/fellersresources.com/fellers/after-submit.png' });
    
    // Look for toast notifications
    const toastElements = await page.locator('[data-sonner-toaster] [data-sonner-toast]').all();
    if (toastElements.length > 0) {
      for (const toast of toastElements) {
        const text = await toast.textContent();
        console.log(`📱 Toast message: "${text}"`);
      }
    } else {
      console.log('⚠️  No toast messages found');
    }
    
    // Check form state
    const submitButton = page.locator('button[type="submit"]');
    const buttonText = await submitButton.textContent();
    console.log(`🔘 Submit button text: "${buttonText}"`);
    
    // Log recent console messages related to form submission
    console.log('\n📝 Recent Console Messages (Form Submission):');
    const recentMessages = consoleMessages.slice(-20); // Last 20 messages
    recentMessages.forEach((msg, index) => {
      if (msg.text.includes('CONTACT FORM') || 
          msg.text.includes('Database') || 
          msg.text.includes('Error') ||
          msg.text.includes('success') ||
          msg.text.includes('failed')) {
        console.log(`  ${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      }
    });
    
    if (errors.length > 0) {
      console.log('\n❌ JavaScript Errors:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.message} (${error.timestamp})`);
      });
    }
    
    console.log('\n📍 Step 6: Check database connectivity logs');
    
    // Check for specific database-related console messages
    const dbMessages = consoleMessages.filter(msg => 
      msg.text.includes('Supabase') || 
      msg.text.includes('database') || 
      msg.text.includes('row-level security') ||
      msg.text.includes('RLS') ||
      msg.text.includes('401') ||
      msg.text.includes('contacts')
    );
    
    if (dbMessages.length > 0) {
      console.log('\n🗄️ Database-related Console Messages:');
      dbMessages.forEach((msg, index) => {
        console.log(`  ${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n=======================================================');
  console.log('🏁 Manual Contact Form Test Complete');
  console.log('=======================================================');
}

// Run the test
testContactFormWithSpecificData().catch(console.error);