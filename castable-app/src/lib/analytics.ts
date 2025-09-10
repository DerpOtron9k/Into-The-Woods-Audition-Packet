// Analytics utilities for tracking user interactions and events

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
    })
  }
}

// Castable-specific event tracking
export const trackShowCreated = (showId: string, showTitle: string) => {
  trackEvent('show_created', {
    show_id: showId,
    show_title: showTitle,
    timestamp: new Date().toISOString(),
  })
}

export const trackShowViewed = (showId: string, showTitle: string) => {
  trackEvent('show_viewed', {
    show_id: showId,
    show_title: showTitle,
    timestamp: new Date().toISOString(),
  })
}

export const trackApplicationSubmitted = (showId: string, applicantEmail: string) => {
  trackEvent('application_submitted', {
    show_id: showId,
    applicant_email: applicantEmail,
    timestamp: new Date().toISOString(),
  })
}

export const trackFileUploaded = (fileType: string, fileSize: number) => {
  trackEvent('file_uploaded', {
    file_type: fileType,
    file_size: fileSize,
    timestamp: new Date().toISOString(),
  })
}

export const trackUserSignUp = (userId: string, method: string) => {
  trackEvent('user_signup', {
    user_id: userId,
    method: method,
    timestamp: new Date().toISOString(),
  })
}

export const trackUserSignIn = (userId: string, method: string) => {
  trackEvent('user_signin', {
    user_id: userId,
    method: method,
    timestamp: new Date().toISOString(),
  })
}

// Error tracking
export const trackError = (error: Error, context?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      context: context || 'unknown',
    })
  }
}

// Performance tracking
export const trackPerformance = (metricName: string, value: number, unit: string = 'ms') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metricName,
      value: Math.round(value),
      event_category: 'Performance',
      event_label: unit,
    })
  }
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}
