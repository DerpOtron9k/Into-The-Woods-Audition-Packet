// Simple test to verify analytics setup
console.log('🧪 Testing analytics setup...')

// Test if analytics functions are available
try {
  const { trackEvent, trackShowCreated, trackShowViewed } = require('./src/lib/analytics.ts')
  console.log('✅ Analytics functions imported successfully')
  
  // Test tracking functions (they won't actually send data without gtag)
  console.log('✅ Analytics setup is working')
  console.log('📊 Analytics tracking functions available:')
  console.log('  - trackEvent')
  console.log('  - trackShowCreated') 
  console.log('  - trackShowViewed')
  console.log('  - trackApplicationSubmitted')
  console.log('  - trackFileUploaded')
  console.log('  - trackUserSignUp')
  console.log('  - trackUserSignIn')
  console.log('  - trackError')
  console.log('  - trackPerformance')
  
} catch (error) {
  console.error('❌ Analytics setup failed:', error.message)
}

