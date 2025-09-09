const { chromium } = require('playwright');

async function debugShowPage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Debugging Show Creation Page...');
    
    // Navigate to the create show page
    await page.goto('http://localhost:3000/dashboard/shows/create');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-show-page.png' });
    console.log('📸 Screenshot saved: debug-show-page.png');
    
    // Get page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Get page content
    const content = await page.content();
    console.log('📄 Page content length:', content.length);
    
    // Look for any form elements
    console.log('🔍 Looking for any form elements...');
    
    // Check for forms
    const forms = await page.locator('form').count();
    console.log('📝 Number of forms found:', forms);
    
    // Check for inputs
    const inputs = await page.locator('input').count();
    console.log('📝 Number of inputs found:', inputs);
    
    // Check for buttons
    const buttons = await page.locator('button').count();
    console.log('📝 Number of buttons found:', buttons);
    
    // Get all input types
    const inputTypes = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.map(input => ({
        type: input.type,
        placeholder: input.placeholder,
        name: input.name,
        id: input.id,
        className: input.className
      }));
    });
    console.log('📝 Input details:', JSON.stringify(inputTypes, null, 2));
    
    // Get all button text
    const buttonTexts = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(button => ({
        text: button.textContent?.trim(),
        type: button.type,
        className: button.className
      }));
    });
    console.log('📝 Button details:', JSON.stringify(buttonTexts, null, 2));
    
    // Check for any error messages
    const errorElements = await page.locator('[class*="error"], [class*="Error"], .text-red-500, .text-red-600').count();
    console.log('❌ Error elements found:', errorElements);
    
    // Get the first 1000 characters of the page content
    console.log('📄 First 1000 characters of page content:');
    console.log(content.substring(0, 1000));
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    await page.screenshot({ path: 'debug-error.png' });
  } finally {
    await browser.close();
  }
}

debugShowPage().catch(console.error);

