export class FormValidator {
  constructor() {
    this.submissionAttempts = 0;
    this.maxAttempts = 3;
    this.lastSubmission = 0;
    this.minSubmissionInterval = 5000; // 5 seconds
    
    this.validationRules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 30,
        pattern: /^[a-zA-Z\s'.-]+$/,
        message: 'Please enter a valid name (2-30 characters)',
        sanitize: true
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
        sanitize: true,
        maxLength: 254
      },
      phone: {
        required: true,
        pattern: /^[\+]?[\d\s\-\(\)]{7,20}$/,
        message: 'Please enter a valid phone number',
        sanitize: true
      },
      vocalRange: {
        pattern: /^[A-G][#b]?[0-9]-[A-G][#b]?[0-9]$/,
        message: 'Please enter vocal range in format like "G3-F5"',
        sanitize: true
      },
      conflicts: {
        required: true,
        maxLength: 1000,
        message: 'Please provide details about your conflicts',
        sanitize: true
      },
      experience: {
        maxLength: 2000,
        sanitize: true
      },
      skills: {
        maxLength: 1000,
        sanitize: true
      }
    };
    
    this.loadingStates = {
      preparing: { title: 'Preparing submission...', message: 'Validating your information...', progress: 20 },
      uploading: { title: 'Uploading headshot...', message: 'Processing your image...', progress: 60 },
      processing: { title: 'Processing application...', message: 'Saving your audition details...', progress: 80 },
      submitting: { title: 'Submitting to server...', message: 'Finalizing your submission...', progress: 100 }
    };
  }

  init() {
    this.setupEventListeners();
    this.setupFileUpload();
    this.setupLoadingOverlay();
  }

  setupEventListeners() {
    const debouncedValidation = this.debounce((fieldName) => {
      this.validateField(fieldName);
    }, 300);
    
    Object.keys(this.validationRules).forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field) {
        field.addEventListener('blur', () => this.validateField(fieldName));
        field.addEventListener('input', () => {
          this.clearFieldError(fieldName);
          debouncedValidation(fieldName);
        });
        field.addEventListener('focus', () => {
          if (field.value && field.classList.contains('error')) {
            this.validateField(fieldName);
          }
        });
      }
    });
    
    const form = document.getElementById('audition-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
  }

  setupFileUpload() {
    const fileInput = document.getElementById('headshot');
    const uploadArea = document.getElementById('file-upload-area');
    const removeBtn = document.getElementById('remove-file');
    
    if (!fileInput || !uploadArea) return;
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) this.handleFileSelect(files[0]);
    });
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.handleFileSelect(e.target.files[0]);
    });
    
    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removeFile());
    }
  }

  setupLoadingOverlay() {
    this.loadingOverlay = document.getElementById('loading-overlay');
    this.loadingTitle = document.getElementById('loading-title');
    this.loadingMessage = document.getElementById('loading-message');
    this.progressFill = document.getElementById('progress-fill');
  }

  sanitizeInput(value, fieldName) {
    if (typeof value !== 'string') return value;
    
    let sanitized = value
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
    
    if (fieldName === 'email') sanitized = sanitized.toLowerCase();
    if (fieldName === 'vocalRange') sanitized = sanitized.toUpperCase();
    
    return sanitized;
  }

  checkRateLimit() {
    const now = Date.now();
    const timeSinceLastSubmission = now - this.lastSubmission;
    
    if (this.submissionAttempts >= this.maxAttempts) {
      if (timeSinceLastSubmission < this.minSubmissionInterval) {
        const remainingTime = Math.ceil((this.minSubmissionInterval - timeSinceLastSubmission) / 1000);
        throw new Error(`Please wait ${remainingTime} seconds before submitting again.`);
      } else {
        this.submissionAttempts = 0;
      }
    }
    
    this.submissionAttempts++;
    this.lastSubmission = now;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const rule = this.validationRules[fieldName];
    if (!field || !rule) return true;
    
    let value = field.value.trim();
    
    if (rule.sanitize) {
      value = this.sanitizeInput(value, fieldName);
      if (field.value !== value) field.value = value;
    }
    
    let isValid = true;
    let errorMessage = '';
    
    if (rule.required && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} is required`;
    }
    
    if (isValid && value) {
      if (rule.minLength && value.length < rule.minLength) {
        isValid = false;
        errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rule.minLength} characters`;
      } else if (rule.maxLength && value.length > rule.maxLength) {
        isValid = false;
        errorMessage = `${this.getFieldLabel(fieldName)} must be no more than ${rule.maxLength} characters`;
      }
    }
    
    if (isValid && value && rule.pattern && !rule.pattern.test(value)) {
      isValid = false;
      errorMessage = rule.message;
    }
    
    this.showFieldValidation(fieldName, isValid, errorMessage);
    return isValid;
  }

  showFieldValidation(fieldName, isValid, errorMessage = '') {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (!field) return;
    
    field.classList.remove('error', 'success');
    field.setAttribute('aria-invalid', !isValid);
    
    if (isValid) {
      field.classList.add('success');
    } else {
      field.classList.add('error');
    }
    
    if (errorElement) {
      errorElement.classList.toggle('show', !isValid);
      errorElement.textContent = errorMessage;
    }
  }

  clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (field) {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
    }
    
    if (errorElement) {
      errorElement.classList.remove('show');
      errorElement.textContent = '';
    }
  }

  getFieldLabel(fieldName) {
    const labelMap = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      vocalRange: 'Vocal Range',
      conflicts: 'Conflicts'
    };
    return labelMap[fieldName] || fieldName;
  }

  validateForm() {
    return Object.keys(this.validationRules).every(fieldName => this.validateField(fieldName));
  }

  handleFileSelect(file) {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png'];
    
    if (file.size > maxSize) {
      this.showFieldValidation('headshot', false, 'File size must be less than 5MB');
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      this.showFieldValidation('headshot', false, 'Please select a PNG or JPEG image');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('file-preview');
      const previewImage = document.getElementById('preview-image');
      if (preview && previewImage) {
        previewImage.src = e.target.result;
        preview.classList.add('show');
      }
    };
    reader.readAsDataURL(file);
    this.showFieldValidation('headshot', true);
  }

  removeFile() {
    const fileInput = document.getElementById('headshot');
    const preview = document.getElementById('file-preview');
    
    if (fileInput) fileInput.value = '';
    if (preview) preview.classList.remove('show');
    
    this.clearFieldError('headshot');
  }

  showLoadingState(state) {
    if (!this.loadingOverlay) return;
    const stateInfo = this.loadingStates[state];
    if (!stateInfo) return;
    
    if (this.loadingTitle) this.loadingTitle.textContent = stateInfo.title;
    if (this.loadingMessage) this.loadingMessage.textContent = stateInfo.message;
    if (this.progressFill) this.progressFill.style.width = `${stateInfo.progress}%`;
    
    this.loadingOverlay.classList.remove('hidden');
  }

  hideLoadingState() {
    if (this.loadingOverlay) this.loadingOverlay.classList.add('hidden');
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    try {
      this.checkRateLimit();
      
      if (!this.validateForm()) {
        const firstError = document.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      this.showLoadingState('preparing');
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 500));
      this.showLoadingState('submitting');
      
      e.target.submit();
      
    } catch (error) {
      this.hideLoadingState();
      this.showError(error.message);
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: #dc2626; color: white; padding: 1rem;
      border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000; max-width: 300px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentNode) errorDiv.parentNode.removeChild(errorDiv);
    }, 5000);
  }
}
