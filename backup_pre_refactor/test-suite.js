// Comprehensive Testing Suite for Into the Woods Audition Form
// Automated testing for form validation, security, and functionality

class FormTestSuite {
  constructor() {
    this.testResults = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  // Test runner
  async runAllTests() {
    console.log('🧪 Starting Form Test Suite...');
    
    const tests = [
      this.testFormValidation,
      this.testSecurityFeatures,
      this.testFileUpload,
      this.testAccessibility,
      this.testPerformance,
      this.testErrorHandling
    ];

    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        this.recordTest(test.name, false, error.message);
      }
    }

    this.generateReport();
  }

  // Record test result
  recordTest(testName, passed, message = '') {
    this.testResults.push({
      name: testName,
      passed,
      message,
      timestamp: new Date().toISOString()
    });

    if (passed) {
      this.passedTests++;
      console.log(`✅ ${testName}: PASSED`);
    } else {
      this.failedTests++;
      console.log(`❌ ${testName}: FAILED - ${message}`);
    }
  }

  // Test form validation
  async testFormValidation() {
    const validator = new FormValidator();
    
    // Test name validation
    const nameField = document.getElementById('name');
    if (nameField) {
      nameField.value = 'A'; // Too short
      const isValid = validator.validateField('name');
      this.recordTest('Name validation (too short)', !isValid, 'Should reject names shorter than 2 characters');
      
      nameField.value = 'Valid Name';
      const isValid2 = validator.validateField('name');
      this.recordTest('Name validation (valid)', isValid2, 'Should accept valid names');
    }

    // Test email validation
    const emailField = document.getElementById('email');
    if (emailField) {
      emailField.value = 'invalid-email';
      const isValid = validator.validateField('email');
      this.recordTest('Email validation (invalid)', !isValid, 'Should reject invalid email formats');
      
      emailField.value = 'test@example.com';
      const isValid2 = validator.validateField('email');
      this.recordTest('Email validation (valid)', isValid2, 'Should accept valid email formats');
    }

    // Test phone validation
    const phoneField = document.getElementById('phone');
    if (phoneField) {
      phoneField.value = 'abc123';
      const isValid = validator.validateField('phone');
      this.recordTest('Phone validation (invalid)', !isValid, 'Should reject non-numeric phone numbers');
      
      phoneField.value = '5551234567';
      const isValid2 = validator.validateField('phone');
      this.recordTest('Phone validation (valid)', isValid2, 'Should accept valid phone numbers');
    }

    // Test vocal range validation
    const vocalRangeField = document.getElementById('vocal-range');
    if (vocalRangeField) {
      vocalRangeField.value = 'invalid-range';
      const isValid = validator.validateField('vocalRange');
      this.recordTest('Vocal range validation (invalid)', !isValid, 'Should reject invalid vocal range formats');
      
      vocalRangeField.value = 'G3-F5';
      const isValid2 = validator.validateField('vocalRange');
      this.recordTest('Vocal range validation (valid)', isValid2, 'Should accept valid vocal range formats');
    }
  }

  // Test security features
  async testSecurityFeatures() {
    const validator = new FormValidator();

    // Test input sanitization
    const testInputs = [
      { input: '<script>alert("xss")</script>', expected: 'alert("xss")' },
      { input: 'javascript:alert("xss")', expected: 'alert("xss")' },
      { input: 'onclick="alert(\'xss\')"', expected: 'alert(\'xss\')"' }
    ];

    testInputs.forEach((test, index) => {
      const sanitized = validator.sanitizeInput(test.input, 'name');
      const isSecure = !sanitized.includes('<script>') && !sanitized.includes('javascript:') && !sanitized.includes('onclick=');
      this.recordTest(`Input sanitization ${index + 1}`, isSecure, `Should remove dangerous content from: ${test.input}`);
    });

    // Test rate limiting
    try {
      validator.checkRateLimit();
      validator.checkRateLimit();
      validator.checkRateLimit();
      validator.checkRateLimit(); // This should throw
      this.recordTest('Rate limiting', false, 'Should prevent more than 3 submissions in 5 seconds');
    } catch (error) {
      this.recordTest('Rate limiting', true, 'Successfully blocked excessive submissions');
    }

    // Test suspicious pattern detection
    const suspiciousInputs = [
      '<script>alert("xss")</script>',
      'javascript:void(0)',
      'onload=alert("xss")',
      'eval("malicious code")'
    ];

    suspiciousInputs.forEach((input, index) => {
      const form = document.getElementById('audition-form');
      if (form) {
        const nameField = document.getElementById('name');
        if (nameField) {
          nameField.value = input;
          const isSecure = validator.performSecurityChecks();
          this.recordTest(`Suspicious pattern detection ${index + 1}`, !isSecure, `Should detect and block: ${input}`);
        }
      }
    });
  }

  // Test file upload functionality
  async testFileUpload() {
    const validator = new FormValidator();
    const fileInput = document.getElementById('headshot');

    if (fileInput) {
      // Test file type validation
      const mockFile = {
        name: 'test.txt',
        type: 'text/plain',
        size: 1024
      };

      const isValidType = validator.validateFileSecurity(mockFile);
      this.recordTest('File type validation', !isValidType, 'Should reject non-image files');

      // Test file size validation
      const largeFile = {
        name: 'large.jpg',
        type: 'image/jpeg',
        size: 10 * 1024 * 1024 // 10MB
      };

      const isValidSize = validator.validateFileSecurity(largeFile);
      this.recordTest('File size validation', !isValidSize, 'Should reject files larger than 5MB');

      // Test valid file
      const validFile = {
        name: 'headshot.jpg',
        type: 'image/jpeg',
        size: 2 * 1024 * 1024 // 2MB
      };

      const isValidFile = validator.validateFileSecurity(validFile);
      this.recordTest('Valid file upload', isValidFile, 'Should accept valid image files');
    }
  }

  // Test accessibility features
  async testAccessibility() {
    // Test ARIA labels
    const requiredFields = ['name', 'email', 'phone', 'conflicts'];
    requiredFields.forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field) {
        const hasAriaDescribedBy = field.hasAttribute('aria-describedby');
        const hasAriaInvalid = field.hasAttribute('aria-invalid');
        this.recordTest(`ARIA attributes for ${fieldName}`, hasAriaDescribedBy && hasAriaInvalid, 'Should have proper ARIA attributes');
      }
    });

    // Test required field indicators
    const requiredLabels = document.querySelectorAll('label.required');
    this.recordTest('Required field indicators', requiredLabels.length > 0, 'Should have visual indicators for required fields');

    // Test error message accessibility
    const errorMessages = document.querySelectorAll('.error-message[role="alert"]');
    this.recordTest('Error message accessibility', errorMessages.length > 0, 'Should have accessible error messages');

    // Test keyboard navigation
    const focusableElements = document.querySelectorAll('input, select, textarea, button');
    this.recordTest('Keyboard navigation', focusableElements.length > 0, 'Should have focusable elements for keyboard users');
  }

  // Test performance features
  async testPerformance() {
    // Test debounced validation
    const validator = new FormValidator();
    const debouncedFunction = validator.debounce(() => {}, 100);
    
    this.recordTest('Debounced validation', typeof debouncedFunction === 'function', 'Should provide debounced validation function');

    // Test lazy loading setup
    const lazyElements = document.querySelectorAll('[data-lazy-load]');
    this.recordTest('Lazy loading elements', lazyElements.length > 0, 'Should have elements marked for lazy loading');

    // Test Service Worker registration
    const hasServiceWorker = 'serviceWorker' in navigator;
    this.recordTest('Service Worker support', hasServiceWorker, 'Should support Service Worker for caching');

    // Test preload links
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    this.recordTest('Resource preloading', preloadLinks.length > 0, 'Should preload critical resources');
  }

  // Test error handling
  async testErrorHandling() {
    const validator = new FormValidator();

    // Test form validation error handling
    const form = document.getElementById('audition-form');
    if (form) {
      // Clear all fields to trigger validation errors
      const fields = ['name', 'email', 'phone', 'conflicts'];
      fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) field.value = '';
      });

      const isValid = validator.validateForm();
      this.recordTest('Form validation error handling', !isValid, 'Should detect validation errors');

      // Test error message display
      const errorMessages = document.querySelectorAll('.error-message.show');
      this.recordTest('Error message display', errorMessages.length > 0, 'Should display error messages for invalid fields');
    }

    // Test security error handling
    try {
      validator.showSecurityError('Test security error');
      this.recordTest('Security error display', true, 'Should display security error messages');
    } catch (error) {
      this.recordTest('Security error display', false, 'Failed to display security error: ' + error.message);
    }
  }

  // Generate test report
  generateReport() {
    const totalTests = this.passedTests + this.failedTests;
    const passRate = totalTests > 0 ? (this.passedTests / totalTests * 100).toFixed(1) : 0;

    console.log('\n📊 Test Report');
    console.log('================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${this.passedTests}`);
    console.log(`Failed: ${this.failedTests}`);
    console.log(`Pass Rate: ${passRate}%`);

    if (this.failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.message}`);
        });
    }

    // Performance metrics
    const performanceMetrics = {
      loadTime: performance.now(),
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'N/A',
      testDuration: Date.now() - this.startTime
    };

    console.log('\n⚡ Performance Metrics:');
    console.log(`Load Time: ${performanceMetrics.loadTime.toFixed(2)}ms`);
    console.log(`Memory Usage: ${performanceMetrics.memoryUsage}`);
    console.log(`Test Duration: ${performanceMetrics.testDuration}ms`);

    return {
      totalTests,
      passedTests: this.passedTests,
      failedTests: this.failedTests,
      passRate: parseFloat(passRate),
      results: this.testResults,
      performance: performanceMetrics
    };
  }

  // Start timing
  start() {
    this.startTime = Date.now();
  }
}

// Auto-run tests when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only run tests in development/debug mode
  if (window.location.search.includes('test=true') || window.location.hostname === 'localhost') {
    const testSuite = new FormTestSuite();
    testSuite.start();
    testSuite.runAllTests();
  }
});

// Export for manual testing
window.FormTestSuite = FormTestSuite;
