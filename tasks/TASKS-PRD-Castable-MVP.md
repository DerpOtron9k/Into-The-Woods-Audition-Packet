## Tasks

- [x] 1.1 Initialize a new Next.js 14 project with TypeScript and Tailwind CSS.
  - [x] 1.2 Install and configure Clerk for authentication.
  - [x] 1.3 Set up PostgreSQL database connection and create initial schema (users, shows, characters, applicants). [COMPLETED: Supabase Transaction Pooler connection established]
  - [x] 1.4 Configure Amazon S3 for file storage. [COMPLETED: S3 SDK, API endpoints, and file upload components ready - requires AWS credentials]
  - [ ] 1.5 Set up Shadcn UI and Radix UI for the component library.

- [ ] 2.0 Director Dashboard & Show Management
  - [ ] 2.1 Create the main dashboard layout for logged-in users.
  - [ ] 2.2 Implement the "Show List" view to display all shows created by a director.
  - [ ] 2.3 Build the single-page "Show Creation Wizard" UI component.
  - [ ] 2.4 Develop the character definition template component within the wizard.
  - [ ] 2.5 Implement file upload functionality for audition materials to S3.
  - [ ] 2.6 Create the API endpoint (`/api/shows`) to save/update show data.

- [ ] 3.0 Public Audition Page & Applicant Experience
  - [ ] 3.1 Create the dynamic route `[show-id]` for public audition pages.
  - [ ] 3.2 Build the UI to display all show, character, and audition information.
  - [ ] 3.3 Implement embedded media players for audio and download links for PDFs.
  - [ ] 3.4 Develop the actor application form component.
  - [ ] 3.5 Implement headshot upload functionality on the application form to S3.
  - [ ] 3.6 Create the API endpoint (`/api/applicants`) for form submissions.

- [ ] 4.0 Applicant Viewer & Casting Tools
  - [ ] 4.1 Create the protected route and UI for the Applicant Viewer page.
  - [ ] 4.2 Integrate and configure AG Grid to display applicant data.
  - [ ] 4.3 Implement server-side sorting and filtering logic for the grid.
  - [ ] 4.4 Build the "Detailed Applicant View" modal or side panel.
  - [ ] 4.5 Implement the private notes and rating system for directors.

- [ ] 5.0 Billing & Plan Management
  - [ ] 5.1 Integrate Stripe for subscription processing.
  - [ ] 5.2 Create the pricing page and checkout flow.
  - [ ] 5.3 Implement backend logic to enforce plan limits (1 show, 25 applicants, 100MB storage).
  - [ ] 5.4 Develop the data retention cron job/webhook to handle purging of old, free-tier shows.
  - [ ] 5.5 Set up automated email notifications for the data retention warnings.

### Relevant Files

- `app/layout.tsx` - Main app layout, Clerk provider integration.
- `app/(dashboard)/dashboard/page.tsx` - Main view for logged-in directors.
- `app/(dashboard)/shows/create/page.tsx` - The Show Creation Wizard UI.
- `app/shows/[showId]/page.tsx` - Dynamic public page for a single show.
- `app/(dashboard)/shows/[showId]/applicants/page.tsx` - The Applicant Viewer grid UI.
- `components/show-list.tsx` - Component to display a director's shows.
- `components/applicant-grid.tsx` - The AG Grid component for viewing applicants.
- `components/application-form.tsx` - The form for actors to apply.
- `lib/db/schema.ts` - The Drizzle or Prisma schema for the PostgreSQL database.
- `lib/s3.ts` - Helper functions for interacting with Amazon S3.
- `app/api/shows/route.ts` - API endpoint for creating and managing shows.
- `app/api/applicants/route.ts` - API endpoint for handling new applications.
- `app/api/webhooks/stripe/route.ts` - Webhook for handling Stripe events.
