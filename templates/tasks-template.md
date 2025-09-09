# Task List: {FEATURE_NAME}

## Phase 1: Core Infrastructure
- [ ] 1.1 Initialize Next.js 14 project with TypeScript and Tailwind CSS
- [ ] 1.2 Install and configure Clerk for authentication
- [ ] 1.3 Set up PostgreSQL database connection and create initial schema
- [ ] 1.4 Configure Amazon S3 for file storage
- [ ] 1.5 Set up Shadcn UI and Radix UI for the component library

## Phase 2: Director Dashboard & Show Management
- [ ] 2.1 Create the main dashboard layout for logged-in users
- [ ] 2.2 Implement the "Show List" view to display all shows created by a director
- [ ] 2.3 Build the single-page "Show Creation Wizard" UI component
- [ ] 2.4 Develop the character definition template component within the wizard
- [ ] 2.5 Implement file upload functionality for audition materials to S3
- [ ] 2.6 Create the API endpoint (`/api/shows`) to save/update show data

## Phase 3: Public Audition Page & Applicant Experience
- [ ] 3.1 Create the dynamic route `[show-id]` for public audition pages
- [ ] 3.2 Build the UI to display all show, character, and audition information
- [ ] 3.3 Implement embedded media players for audio and download links for PDFs
- [ ] 3.4 Develop the actor application form component
- [ ] 3.5 Implement headshot upload functionality on the application form to S3
- [ ] 3.6 Create the API endpoint (`/api/applicants`) for form submissions

## Phase 4: Applicant Viewer & Casting Tools
- [ ] 4.1 Create the protected route and UI for the Applicant Viewer page
- [ ] 4.2 Integrate and configure AG Grid to display applicant data
- [ ] 4.3 Implement server-side sorting and filtering logic for the grid
- [ ] 4.4 Build the "Detailed Applicant View" modal or side panel
- [ ] 4.5 Implement the private notes and rating system for directors

## Phase 5: Billing & Plan Management
- [ ] 5.1 Integrate Stripe for subscription processing
- [ ] 5.2 Create the pricing page and checkout flow
- [ ] 5.3 Implement backend logic to enforce plan limits (1 show, 25 applicants, 100MB storage)
- [ ] 5.4 Develop the data retention cron job/webhook to handle purging of old, free-tier shows
- [ ] 5.5 Set up automated email notifications for the data retention warnings

## Phase 6: Testing & Quality Assurance
- [ ] 6.1 Write unit tests for core components
- [ ] 6.2 Implement integration tests for API endpoints
- [ ] 6.3 Create end-to-end tests for critical user flows
- [ ] 6.4 Performance testing and optimization
- [ ] 6.5 Security audit and vulnerability assessment

## Phase 7: Deployment & Launch
- [ ] 7.1 Set up production environment on Vercel
- [ ] 7.2 Configure production database and S3 buckets
- [ ] 7.3 Set up monitoring and error tracking
- [ ] 7.4 Create user documentation and help guides
- [ ] 7.5 Launch preparation and go-live checklist

## Dependencies & Blockers
- [ ] AWS S3 credentials and bucket configuration
- [ ] Stripe account setup and webhook configuration
- [ ] Production database setup and migration
- [ ] Domain configuration and SSL certificates

## Notes
- All tasks should be completed in order within each phase
- Dependencies must be resolved before dependent tasks can begin
- Each task should have clear acceptance criteria
- Code reviews required for all API endpoints and database changes
