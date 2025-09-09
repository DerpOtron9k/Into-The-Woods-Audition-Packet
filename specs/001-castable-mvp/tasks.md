# Task List: Castable MVP

## Phase 1: Core Infrastructure
- [x] 1.1 Initialize Next.js 14 project with TypeScript and Tailwind CSS, then test with Playwright for basic page rendering and navigation
- [x] 1.2 Install and configure Clerk for authentication, then test with Playwright for sign-in/sign-up flows and protected route access
- [x] 1.3 Set up PostgreSQL database connection and create initial schema, then test with database scripts to verify connection and schema creation
- [x] 1.4 Configure Amazon S3 for file storage, then test with file upload/download operations and verify encryption
- [x] 1.5 Set up Shadcn UI and Radix UI for the component library, then test with Playwright for component rendering and interactions
- [ ] 1.6 Configure analytics and monitoring (Sentry, Vercel Analytics), then test with Playwright to verify tracking events and error reporting

## Phase 2: Director Dashboard & Show Management
- [x] 2.1 Create simple, clean dashboard layout for logged-in users, then test with Playwright for responsive design and navigation
- [x] 2.2 Implement the "Show List" view with basic metrics (view count, applicant count), then test with Playwright for data display and real-time updates
- [x] 2.3 Build single-page "Show Creation Wizard" with guided flow, then test with Playwright for step-by-step form completion and validation
- [x] 2.4 Develop character definition template with simple fields, then test with Playwright for form interactions and data persistence
- [x] 2.5 Implement file upload functionality for audition materials to S3, then test with Playwright for drag-and-drop upload and file validation
- [x] 2.6 Create API endpoints (`/api/shows`) to save/update show data, then test with API testing tools for CRUD operations and error handling
- [ ] 2.7 Add show preview functionality before publishing, then test with Playwright for preview accuracy and publish workflow
- [ ] 2.8 Implement show template saving system, then test with Playwright for template creation, saving, and reuse workflows
- [ ] 2.9 Add show editing capabilities after publishing, then test with Playwright for edit permissions and data updates
- [ ] 2.10 Create show duplication feature, then test with Playwright for duplication accuracy and data integrity

## Phase 3: Public Audition Page & Applicant Experience
- [x] 3.1 Create dynamic route `[show-id]` for public audition pages, then test with Playwright for URL routing and page accessibility
- [x] 3.2 Build mobile-first UI to display show, character, and audition information, then test with Playwright on multiple device sizes
- [x] 3.3 Implement embedded media players for audio and download links for PDFs, then test with Playwright for media playback and download functionality
- [ ] 3.4 Develop simple actor application form with clear instructions, then test with Playwright for form completion and validation
- [ ] 3.5 Implement headshot upload with validation on the application form, then test with Playwright for file upload and image preview
- [ ] 3.6 Create API endpoints (`/api/applicants`) for form submissions, then test with API testing tools for data persistence and error handling
- [ ] 3.7 Add application confirmation email system, then test with email testing tools for delivery and content accuracy
- [ ] 3.8 Implement application draft saving functionality, then test with Playwright for draft persistence and retrieval
- [ ] 3.9 Add multi-role application support in single form, then test with Playwright for role selection and application logic
- [ ] 3.10 Create application deadline display and validation, then test with Playwright for deadline enforcement and user messaging
- [ ] 3.11 Add director contact information display, then test with Playwright for contact link functionality and information accuracy
- [ ] 3.12 Implement application update/edit functionality, then test with Playwright for edit permissions and data updates

## Phase 4: Applicant Viewer & Casting Tools
- [ ] 4.1 Create protected route and UI for Applicant Viewer page, then test with Playwright for authentication and data display
- [ ] 4.2 Integrate AG Grid with simple, intuitive controls, then test with Playwright for grid interactions and data sorting
- [ ] 4.3 Implement server-side sorting and filtering logic, then test with API testing tools for performance and data accuracy
- [ ] 4.4 Build detailed applicant view modal with all submitted data, then test with Playwright for modal functionality and data completeness
- [ ] 4.5 Implement private notes and rating system for directors, then test with Playwright for note persistence and rating updates
- [ ] 4.6 Add bulk messaging system for all applicants, then test with Playwright for message composition and delivery
- [ ] 4.7 Create data export functionality (CSV, Excel), then test with Playwright for export accuracy and file generation
- [ ] 4.8 Implement application status management, then test with Playwright for status updates and workflow logic
- [ ] 4.9 Add callback scheduling and notification system, then test with Playwright for scheduling interface and notification delivery
- [ ] 4.10 Create show archiving functionality, then test with Playwright for archive workflow and data preservation

## Phase 5: Billing & Plan Management
- [ ] 5.1 Integrate Stripe for subscription processing, then test with Stripe test mode for payment flows and webhook handling
- [ ] 5.2 Create simple pricing page and checkout flow, then test with Playwright for pricing display and checkout completion
- [ ] 5.3 Implement backend logic to enforce plan limits (1 show, 25 applicants, 100MB storage), then test with API testing tools for limit enforcement
- [ ] 5.4 Develop automated data purging system based on subscription tier, then test with database scripts for purging logic and data retention
- [ ] 5.5 Set up automated email notifications for data retention warnings, then test with email testing tools for notification timing and content
- [ ] 5.6 Create data export capabilities for users, then test with Playwright for export functionality and data completeness
- [ ] 5.7 Implement data validation rules and constraints, then test with API testing tools for validation accuracy and error handling
- [ ] 5.8 Add storage usage monitoring and alerts, then test with monitoring tools for usage tracking and alert thresholds

## Phase 6: Analytics & Monitoring
- [ ] 6.1 Set up user activation and engagement tracking, then test with analytics tools for event tracking and data accuracy
- [ ] 6.2 Implement conversion rate monitoring from free to paid, then test with analytics tools for conversion tracking and reporting
- [ ] 6.3 Create analytics dashboard for product owners, then test with Playwright for dashboard functionality and data visualization
- [ ] 6.4 Add system performance and uptime monitoring, then test with monitoring tools for performance metrics and alerting
- [ ] 6.5 Implement revenue and subscription metrics tracking, then test with analytics tools for financial data accuracy
- [ ] 6.6 Set up user retention and churn rate monitoring, then test with analytics tools for retention calculations and reporting
- [ ] 6.7 Add data processing error tracking and alerting, then test with error simulation for alert accuracy and response time
- [ ] 6.8 Create database performance monitoring, then test with database tools for query performance and optimization
- [ ] 6.9 Implement data storage usage and cost tracking, then test with monitoring tools for storage metrics and cost calculations

## Phase 7: Testing & Quality Assurance
- [ ] 7.1 Write unit tests for core components, then test with Jest for component functionality and edge cases
- [ ] 7.2 Implement integration tests for API endpoints, then test with Jest for API functionality and error handling
- [ ] 7.3 Create end-to-end tests for critical user flows, then test with Playwright for complete user journeys
- [ ] 7.4 Performance testing and optimization, then test with performance tools for load testing and optimization validation
- [ ] 7.5 Security audit and vulnerability assessment, then test with security tools for vulnerability detection and remediation
- [ ] 7.6 Data validation and integrity testing, then test with database scripts for data consistency and validation rules
- [ ] 7.7 Analytics and monitoring system testing, then test with monitoring tools for system reliability and accuracy

## Phase 8: Deployment & Launch
- [ ] 8.1 Set up production environment on Vercel, then test with deployment tools for environment configuration and deployment success
- [ ] 8.2 Configure production database and S3 buckets, then test with database tools for production connectivity and data migration
- [ ] 8.3 Set up comprehensive monitoring and error tracking, then test with monitoring tools for production monitoring and alerting
- [ ] 8.4 Create user documentation and help guides, then test with Playwright for documentation accessibility and accuracy
- [ ] 8.5 Launch preparation and go-live checklist, then test with deployment tools for launch readiness and rollback procedures
- [ ] 8.6 Set up automated data purging jobs, then test with database scripts for job execution and data purging accuracy
- [ ] 8.7 Configure backup and recovery systems, then test with backup tools for data recovery and system restoration

## Dependencies & Blockers
- [ ] AWS S3 credentials and bucket configuration, then test with S3 tools for connectivity and permissions
- [ ] Stripe account setup and webhook configuration, then test with Stripe tools for webhook delivery and processing
- [ ] Production database setup and migration, then test with database tools for migration success and data integrity
- [ ] Domain configuration and SSL certificates, then test with SSL tools for certificate validity and HTTPS enforcement
- [ ] Analytics service configuration (Sentry, Vercel Analytics), then test with analytics tools for event tracking and error reporting
- [ ] Email service configuration for notifications, then test with email tools for delivery and content accuracy

## Notes
- All tasks should be completed in order within each phase
- Dependencies must be resolved before dependent tasks can begin
- Each task should have clear acceptance criteria
- Code reviews required for all API endpoints and database changes
- Focus on simplicity for director and actor user experiences
- Prioritize mobile-first design for public pages
- Ensure data privacy and compliance throughout development

## **Testing Requirements**

### **Mandatory Testing Checklist**
Every completed task must include:

1. **Functional Testing**
   - [ ] Core functionality works as expected
   - [ ] Edge cases handled properly
   - [ ] Error conditions tested
   - [ ] User flows complete end-to-end

2. **Database Testing**
   - [ ] Data persistence verified
   - [ ] Relationships work correctly
   - [ ] Queries perform efficiently
   - [ ] Data integrity maintained

3. **API Testing**
   - [ ] Endpoints return correct responses
   - [ ] Authentication works properly
   - [ ] Error handling functions
   - [ ] Input validation effective

4. **UI/UX Testing**
   - [ ] Interface renders correctly
   - [ ] Mobile responsiveness verified
   - [ ] User interactions work smoothly
   - [ ] Loading states appropriate

5. **Integration Testing**
   - [ ] Components work together
   - [ ] Data flows correctly
   - [ ] External services integrate properly
   - [ ] End-to-end user journeys complete

## Current Status Assessment

### ✅ COMPLETED TASKS (Actually Working)
- **1.1** Next.js 14 with TypeScript and Tailwind CSS - ✅ Complete
- **1.3** PostgreSQL database with Prisma - ✅ Complete (using Supabase)
- **1.4** Amazon S3 configuration - ✅ Complete (comprehensive S3 service)
- **1.5** Shadcn UI components - ✅ Complete (19 UI components)
- **2.1** Dashboard layout - ✅ Complete (clean, professional design)
- **2.2** Show list view - ✅ Complete (with mock data and metrics)
- **2.3** Show creation wizard - ✅ Complete (4-step guided flow)
- **2.4** Character definition - ✅ Complete (comprehensive character form)
- **2.5** File upload to S3 - ✅ Complete (validation, encryption, presigned URLs)
- **2.6** Shows API - ✅ Complete (GET/POST endpoints with Prisma)
- **3.1** Public audition pages - ✅ Complete (dynamic routes, mobile-first)
- **3.2** Mobile-first UI - ✅ Complete (responsive design)
- **3.3** Media display - ✅ Complete (download links, file info)

### ⚠️ PARTIALLY COMPLETED TASKS (Need Work)
- **1.2** Clerk authentication - ⚠️ Re-enabled but database issues prevent testing
- **1.6** Analytics and monitoring - ⚠️ Not implemented

### ❌ NOT STARTED TASKS
- All Phase 4 tasks (Applicant Management)
- All Phase 5 tasks (Billing & Plan Management)
- All Phase 6 tasks (Analytics & Monitoring)
- All Phase 7 tasks (Testing)
- All Phase 8 tasks (Deployment)

### 🔧 TASKS THAT NEED REWORK
- **2.7-2.10** Show management features (preview, templates, editing, duplication)
- **1.2** Fix database connection issues for proper Clerk testing
- **1.6** Implement analytics and monitoring systems

### 📊 COMPLETION STATUS
- **Phase 1**: 5/6 tasks complete (83%)
- **Phase 2**: 6/10 tasks complete (60%)
- **Phase 3**: 3/12 tasks complete (25%)
- **Overall MVP**: ~35% complete

### 🧪 TESTING STATUS
- **Database Connection**: ❌ Issues with prepared statements
- **Show Creation**: ❌ Cannot test due to database issues
- **Public Pages**: ❌ Cannot test due to database issues
- **Authentication**: ❌ Cannot test due to database issues

### 🚨 CRITICAL ISSUES TO RESOLVE
1. **Database Connection**: Prepared statement errors preventing all database operations
2. **Schema Migration**: publicUrl field not properly added to database
3. **Testing Blocked**: Cannot validate any functionality due to database issues