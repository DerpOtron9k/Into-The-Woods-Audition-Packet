# Feature Specification: Castable MVP

## 1. Overview

*   **Problem Statement:** Community theaters, schools, and local production companies lack simple, affordable, and professional tools for creating audition packets and managing applicants, forcing them to use cumbersome, manual processes like single physical paper, spreadsheets, facebook, and email.
*   **Vision:** To provide the easiest, most elegant way for these organizations to create professional, interactive audition pages and manage their applicants from a centralized dashboard.
*   **Target Audience:** Community theater directors, high school drama teachers, independent producers, and leaders of church or youth groups.
*   **Key Goals:**
    *   Enable a director to create and publish a complete, professional audition page in under 10 minutes.
    *   Provide a simple, intuitive applicant viewer to streamline the casting process.
    *   Establish a scalable SaaS foundation to move beyond the limitations of the original prototype.

## 2. User Stories

### Director Stories
*   **As a Director,** I want to use a guided wizard to quickly build a professional-looking audition page, so I can attract more actors and spend less time on administrative setup.
*   **As a Director,** I want a simple, centralized dashboard to view, sort, and filter all applicant information, so my casting team can easily review submissions and make decisions.
*   **As a Director,** I want to be able to preview my audition page before publishing it, so I can ensure it looks professional and complete.
*   **As a Director,** I want to be able to edit my show information after publishing, so I can make updates without recreating the entire page.
*   **As a Director,** I want to see how many people have viewed my audition page, so I can gauge interest in my production.
*   **As a Director,** I want to be able to close applications when I have enough applicants, so I can stop receiving submissions when I'm ready.
*   **As a Director,** I want to be able to send messages to all applicants at once, so I can communicate important updates efficiently.
*   **As a Director,** I want to be able to export applicant data to a spreadsheet, so I can work with the data in my preferred format.
*   **As a Director,** I want to be able to set different application deadlines for different roles, so I can manage complex casting needs.
*   **As a Director,** I want to be able to add notes and ratings to individual applicants, so I can track my thoughts during the review process.
*   **As a Director,** I want to be able to save a previous show setup as a show template, so I can quickly create similar auditions for future productions.
*   **As a Director,** I want to be able to see which audition materials are most downloaded, so I can understand what actors find most useful.
*   **As a Director,** I want to be able to schedule callback auditions and notify specific applicants, so I can manage the casting process efficiently.
*   **As a Director,** I want to be able to archive old shows while keeping the data, so I can maintain a clean dashboard without losing historical information.

### Visual Template Designer Stories
*   **As a Director,** I want to use a visual drag-and-drop interface to design my audition page, so I can create a professional-looking page without any design skills.
*   **As a Director,** I want to choose from multiple layout templates (Single Column, Two Column, Grid, Hero, Card Grid, Sidebar), so I can pick the layout that best fits my show.
*   **As a Director,** I want to drag and drop components (Header, Show Info, Character Cards, Application Form, Contact Info) onto my page, so I can arrange them exactly how I want.
*   **As a Director,** I want to preview my page on mobile, tablet, and desktop devices, so I can ensure it looks great on all screen sizes.
*   **As a Director,** I want to customize colors, fonts, and spacing to match my theater's branding, so my audition page feels cohesive with my organization.
*   **As a Director,** I want to save my page design as a template, so I can quickly create similar pages for future shows.
*   **As a Director,** I want to see exactly how my page will look to actors before publishing, so I can make adjustments and ensure it's perfect.
*   **As a Director,** I want to upload my theater's logo and use custom fonts (Pro tier), so I can maintain consistent branding across all my audition pages.
*   **As a Director,** I want access to an extended color palette and more font options (Pro tier), so I can create more sophisticated designs.
*   **As a Director,** I want to use advanced layout options like custom grid positioning (Pro tier), so I can create unique page layouts that stand out.

### Actor Stories
*   **As an Actor,** I want to easily find all audition materials (sides, music) and submit my application from a single, mobile-responsive page, so the process is convenient and accessible.
*   **As an Actor,** I want to easily preview all audition materials before applying, so I can make an informed decision about whether to audition for a role.
*   **As an Actor,** I want to receive a confirmation email after submitting my application, so I know my submission was received successfully.
*   **As an Actor,** I want to be able to update my application information if I made a mistake, so I don't have to resubmit everything.
*   **As an Actor,** I want to see clear instructions about what materials I need to prepare for the audition, so I can come fully prepared.
*   **As an Actor,** I want to know the deadline for applications, so I can submit my materials on time.
*   **As an Actor,** I want to be able to apply for multiple roles in the same show with one application, so I don't have to fill out the form multiple times.
*   **As an Actor,** I want to see the director's contact information if I have questions, so I can reach out directly.
*   **As an Actor,** I want the audition page to work well on my phone, so I can apply even when I'm not at my computer.
*   **As an Actor,** I want to know if there are any specific requirements (age range, experience level, etc.) before I start filling out the application, so I don't waste time if I'm not eligible.
*   **As an Actor,** I want to be able to save my application as a draft and come back to it later, so I can take my time filling it out properly.

### Product Owner Stories
*   **As a Product Owner,** I want to track user activation and engagement metrics, so I can understand how well the product is meeting user needs and identify areas for improvement.
*   **As a Product Owner,** I want to monitor conversion rates from free to paid plans, so I can optimize the pricing strategy and upgrade flow.
*   **As a Product Owner,** I want to collect user feedback and feature requests, so I can prioritize development based on actual user needs.
*   **As a Product Owner,** I want to analyze usage patterns and popular features, so I can make data-driven decisions about product development.
*   **As a Product Owner,** I want to track customer acquisition costs and lifetime value, so I can optimize marketing spend and business model.
*   **As a Product Owner,** I want to monitor system performance and uptime, so I can ensure a reliable user experience.
*   **As a Product Owner,** I want to track revenue and subscription metrics, so I can monitor business growth and financial health.
*   **As a Product Owner,** I want to track user retention and churn rates, so I can identify why users leave and improve retention strategies.

## 3. Scope

*   **In-Scope (MVP):**
    *   A conversion-focused landing page with compelling value proposition, social proof, and interactive demo.
    *   Secure user accounts (Director sign-up/login).
    *   A guided, single-page wizard for creating and editing shows.
    *   Automatic generation of a public, mobile-responsive audition page.
    *   A selection of 1-2 pre-designed templates for the audition page.
    *   An AG Grid-powered applicant viewer with robust sorting and filtering.
    *   Integration with Stripe for a simple, two-tier billing system (Freemium & Pro).
    *   Automated data retention policy for free-tier shows.
*   **Out-of-Scope (MVP):**
    *   A national talent network or actor profiles.
    *   Direct messaging tools between directors and actors.
    *   Advanced team collaboration features (multiple logins per theater).
    *   Complex analytics or reporting dashboards.
    *   Third-party integrations (e.g., calendar sync, social media posting).
    *   A migration tool for data from the prototype.

## 4. Requirements

### 4.1. Functional Requirements

#### **Director Dashboard & Show Creation**
1.  **Authentication:** Users must be able to sign up, log in, and manage their account using Clerk.
2.  **Show List:** After login, directors must see a central dashboard listing their created shows.
3.  **Show Creation Wizard:**
    *   Provide a "Create New Show" button that launches a single-page creation wizard.
    *   The wizard must have fields for: Production Title, Description, Audition Dates (can be TBD), and Performance Dates (can be TBD).
    *   The wizard must allow directors to define characters using a template (with fields for Character Name, Vocal Info, Description) and allow for customization.
    *   The wizard must allow uploading of audition materials (PDFs, MP3s) for each character, stored in Amazon S3.
    *   Directors must be able to select one of two initial page templates.
4.  **Public Page Generation:** Upon saving a show, the system must generate a unique, publicly accessible URL for the audition page (e.g., `castable.app/shows/[show-id]`).

#### **Landing Page & Marketing Site**
1. **Hero Section:**
   *   Must feature a compelling headline: "Stop Wrestling with Paper Audition Packets"
   *   Must include a clear value proposition: "Create professional, interactive audition pages in under 10 minutes. Attract better actors. Streamline your casting process."
   *   Must display dual CTAs: "Start Your Free Trial" (primary) and "Watch Demo" (secondary) above the fold
   *   Must include social proof: "4.9/5 rating • 500+ theaters • No credit card required"
   *   Must include a hero video or animated demo showing the 10-minute creation process
2. **Problem/Solution Narrative:**
   *   Must include a "Before vs After" visual comparison showing messy paper packets vs. professional digital pages
   *   Must highlight pain points: "Your paper audition packets are costing you talent"
   *   Must include data-driven messaging: "73% of actors prefer digital audition materials"
   *   Must clearly demonstrate how Castable solves these problems with specific benefits
3. **Social Proof & Trust Building:**
   *   Must display testimonials from real theater directors with photos, names, and theater companies
   *   Must show usage statistics: "Used by 500+ theaters nationwide"
   *   Must include trust badges: "Secure", "Mobile-Optimized", "Professional", "No Tech Skills Required"
   *   Must showcase sample audition pages from real productions with before/after comparisons
   *   Must include video testimonials showing specific results and time savings
4. **Interactive Demo Section:**
   *   Must include an embedded demo or interactive preview of the platform
   *   Must provide a "Try the Template Designer" mini interactive tool
   *   Must show live previews of different page templates with device responsiveness
   *   Must include a "See it in action" section with step-by-step process visualization
5. **Feature Showcase Grid:**
   *   Must highlight "Create in 10 Minutes" with step-by-step visual process
   *   Must demonstrate "Mobile-First Design" with responsive previews on multiple devices
   *   Must showcase "Professional Templates" with a gallery of beautiful examples
   *   Must preview "Easy Applicant Management" with dashboard screenshots
   *   Must emphasize "No Tech Skills Required" with simple interface examples
   *   Must highlight "Secure & Private" with security features and data protection
6. **Pricing Transparency:**
   *   Must display clear pricing tiers with feature comparison table
   *   Must emphasize "Start free, upgrade when ready" messaging
   *   Must include "No credit card required" for free tier prominently
   *   Must show "14-day free trial" with clear timeline explanation
   *   Must include value stacking: "5 professional templates + setup assistance"
7. **Theater Community & Resources:**
   *   Must include "Join the Theater Director Community" section
   *   Must offer free resources: "Audition Page Best Practices Guide"
   *   Must provide "Weekly Live Setup Sessions" for new users
   *   Must include "Template Library" with downloadable examples
8. **FAQ Section:**
   *   Must address common concerns about switching from paper processes
   *   Must answer technical questions about setup and usage
   *   Must include "How long does setup take?" and "What if I need help?"
   *   Must address pricing and billing questions
9. **Conversion Optimization:**
   *   Must include multiple strategically placed CTA buttons throughout the page
   *   Must implement email capture for lead nurturing with theater-specific content
   *   Must track conversion metrics and user behavior with analytics
   *   Must include urgency elements: "Limited time: Free setup assistance for first 100 theaters"
   *   Must provide clear next steps after sign-up with onboarding guidance

#### **Public Audition Page**
1.  **Display:** The page must be mobile-responsive and display all show, character, and audition information entered by the director.
2.  **Media:** The page must have embedded media players for audition audio tracks (MP3s) and links to download sheet music (PDFs).
3.  **Application Form:**
    *   Include a simple application form for actors.
    *   The form must include a file uploader for headshots, which are stored in S3.

#### **Applicant Viewer**
1.  **Access:** From the Director Dashboard, clicking a show must open the Applicant Viewer for that show.
2.  **Grid View:** Display all applicants in a sortable, filterable AG Grid.
3.  **Filtering & Sorting:** The grid must support sorting and filtering by all key fields (Name, Role Applied For, Submission Date, etc.).
4.  **Detailed View:** Clicking on an applicant must open a detailed view showing all their submitted data, their uploaded headshot, and a private section for director's notes/ratings.

#### **Billing & Tiers**
1.  **"Castable" Free Plan ($0/month):**
    *   Must be the default for new users.
    *   Strictly enforce a limit of **1 active show** at a time.
    *   Strictly enforce a limit of **25 applicants** per show.
    *   Strictly enforce a total account storage limit of **250 MB**.
    *   **Visual Template Designer**: Full drag-and-drop interface, all layout templates, all core components, all device previews, 5 color themes, 5 font families.
    *   A "Powered by Castable" badge must be displayed on the public audition page.
2.  **"Pro" Paid Plan ($20/month):**
    *   Provide an upgrade path to a paid plan.
    *   The Pro plan must offer unlimited shows, unlimited applicants, and **2GB storage**.
    *   **Enhanced Template Designer**: Logo upload, 15 font families, 20 color themes, advanced layout positioning.
    *   Integrate with Stripe for subscription processing.
3.  **"Enterprise" White-Label Plan ($99/month):**
    *   Remove "Powered by Castable" branding.
    *   Custom domain support.
    *   Custom font upload.
    *   Advanced white-label customization.
4.  **Data Retention Policy:**
    *   For free-tier accounts, the system must automatically trigger a data export and deletion process 60 days after a show's final performance date has passed.
    *   The system must send several warning email notifications to the user before the final data purge.

### 4.2. Technical Requirements
*   **Frontend:** Next.js 14 (App Router)
*   **Hosting:** Vercel
*   **Backend:** Node.js (via Next.js API Routes / Server Actions)
*   **Database:** PostgreSQL
*   **File Storage:** Amazon S3
*   **Authentication:** Clerk
*   **Payment Processing:** Stripe

## 5. Success Metrics

*   **Activation Rate:** >60% of new users publish their first show within 7 days of signing up.
*   **Time-to-Value:** The average time from starting the "Create New Show" wizard to publishing the public page is under 10 minutes.
*   **Conversion Rate:** >5% of free-tier users who hit a usage limit (e.g., try to create a second show) convert to a paid plan.

## 6. Review & Acceptance Checklist

- [x] Problem statement clearly defines the user pain point
- [x] Vision statement aligns with business objectives
- [x] Target audience is well-defined and realistic
- [x] User stories follow the "As a... I want... so that..." format
- [x] Scope is clearly defined with in-scope and out-of-scope items
- [x] Functional requirements are specific and testable
- [x] Technical requirements align with chosen tech stack
- [x] Success metrics are measurable and realistic
- [x] All requirements are traceable to user stories
- [x] Dependencies and assumptions are clearly stated