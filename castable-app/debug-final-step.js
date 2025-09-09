const { chromium } = require('playwright');

async function debugFinalStep() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Debugging Final Step...');
    
    // Navigate to the create show page
    await page.goto('http://localhost:3000/dashboard/shows/create');
    await page.waitForLoadState('networkidle');
    
    // Fill in basic info
    await page.fill('#title', 'Test Musical Production');
    await page.fill('#director', 'John Smith');
    await page.fill('#contactEmail', 'john.smith@example.com');
    await page.fill('#organization', 'Test Theater Company');
    await page.fill('#location', '123 Theater St, Test City, TC 12345');
    await page.fill('#contactPhone', '(555) 123-4567');
    
    // Click next to step 2
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);
    
    // Click next to step 3
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);
    
    // Take screenshot of final step
    await page.screenshot({ path: 'debug-final-step.png' });
    console.log('📸 Screenshot saved: debug-final-step.png');
    
    // Get all button text on the final step
    const buttonTexts = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(button => ({
        text: button.textContent?.trim(),
        type: button.type,
        className: button.className,
        disabled: button.disabled
      }));
    });
    console.log('📝 All buttons on final step:', JSON.stringify(buttonTexts, null, 2));
    
    // Check for any text that might be the submit button
    const allText = await page.evaluate(() => {
      return document.body.textContent;
    });
    
    console.log('📄 All text on page:', allText.substring(0, 1000));
    
    // Look for any form elements
    const forms = await page.locator('form').count();
    console.log('📝 Number of forms found:', forms);
    
    // Check if we're on the right step
    const stepIndicator = await page.locator('[class*="step"], [class*="Step"]').count();
    console.log('📊 Step indicators found:', stepIndicator);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    await page.screenshot({ path: 'debug-final-error.png' });
  } finally {
    await browser.close();
  }
}

debugFinalStep().catch(console.error);

