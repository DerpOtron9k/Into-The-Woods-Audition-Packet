# Product Requirements Document: Castable MVP

## 1. Overview

*   **Problem Statement:** Community theaters, schools, and local production companies lack simple, affordable, and professional tools for creating audition packets and managing applicants, forcing them to use cumbersome, manual processes like single HTML files and spreadsheets.
*   **Vision:** To provide the easiest, most elegant way for these organizations to create professional, interactive audition pages and manage their applicants from a centralized dashboard.
*   **Target Audience:** Community theater directors, high school drama teachers, independent producers, and leaders of church or youth groups.
*   **Key Goals:**
    *   Enable a director to create and publish a complete, professional audition page in under 10 minutes.
    *   Provide a simple, intuitive applicant viewer to streamline the casting process.
    *   Establish a scalable SaaS foundation to move beyond the limitations of the original prototype.

## 2. User Stories

*   **As a Director,** I want to use a guided wizard to quickly build a professional-looking audition page, so I can attract more actors and spend less time on administrative setup.
*   **As a Director,** I want a simple, centralized dashboard to view, sort, and filter all applicant information, so my casting team can easily review submissions and make decisions.
*   **As an Actor,** I want to easily find all audition materials (sides, music) and submit my application from a single, mobile-responsive page, so the process is convenient and accessible.

## 3. Scope

*   **In-Scope (MVP):**
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
1.  **"Hobbyist" Free Plan:**
    *   Must be the default for new users.
    *   Strictly enforce a limit of **1 active show** at a time.
    *   Strictly enforce a limit of **25 applicants** per show.
    *   Strictly enforce a total account storage limit of **100 MB**.
    *   A "Powered by Castable" badge must be displayed on the public audition page.
2.  **"Pro" Paid Plan:**
    *   Provide an upgrade path to a paid plan.
    *   The Pro plan must offer unlimited shows, unlimited applicants, and a higher storage limit.
    *   Integrate with Stripe for subscription processing.
3.  **Data Retention Policy:**
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





