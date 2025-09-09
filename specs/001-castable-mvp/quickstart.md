# Castable MVP Quickstart Guide

## Overview
Castable is a simple, elegant platform for community theaters to create professional audition pages and manage applicants. This guide covers the essential features and user flows.

## Key User Flows

### Director Experience (Simple & Intuitive)

#### 1. Getting Started
- Sign up with email (Clerk authentication)
- Land on clean, simple dashboard
- See "Create New Show" button prominently displayed

#### 2. Creating a Show (Under 10 Minutes)
- **Step 1**: Basic show info (title, description, dates)
- **Step 2**: Add characters with simple template
- **Step 3**: Upload audition materials (PDFs, MP3s)
- **Step 4**: Choose page template
- **Step 5**: Preview and publish
- **Result**: Unique public URL generated automatically

#### 3. Managing Applicants
- View all applicants in simple grid
- Sort and filter by key fields
- Click applicant for detailed view
- Add private notes and ratings
- Send bulk messages to all applicants
- Export data to spreadsheet

#### 4. Show Management
- Edit show information after publishing
- Close applications when ready
- View page visit statistics
- Save show as template for future use
- Archive old shows

### Actor Experience (Mobile-First)

#### 1. Finding Audition Information
- Visit public audition page URL
- See all show details clearly displayed
- Preview audition materials before applying
- View character requirements and deadlines

#### 2. Applying for Roles
- Fill out simple application form
- Upload headshot with validation
- Apply for multiple roles in one form
- Save application as draft
- Receive confirmation email

#### 3. Managing Application
- Update application if needed
- View application status
- Access director contact information

### Product Owner Experience (Data-Driven)

#### 1. Analytics Dashboard
- User activation and engagement metrics
- Conversion rates from free to paid
- Revenue and subscription tracking
- System performance monitoring

#### 2. Data Management
- Monitor storage usage and costs
- Track data processing errors
- Manage automated data purging
- Export user data for compliance

## Core Features

### For Directors
- **Simple Dashboard**: Clean interface with key metrics
- **Show Creation Wizard**: Single-page, guided process
- **Applicant Management**: AG Grid with intuitive controls
- **Template System**: Save and reuse show configurations
- **Analytics**: Basic metrics on page views and downloads
- **Bulk Operations**: Efficient applicant communication

### For Actors
- **Mobile-Optimized Pages**: Works perfectly on phones
- **Preview Materials**: See audition content before applying
- **Draft Applications**: Save and return to complete later
- **Multi-Role Applications**: Apply for multiple roles at once
- **Confirmation System**: Clear feedback on submissions

### For Product Owners
- **Comprehensive Analytics**: Track all key business metrics
- **Data Management**: Automated purging and export
- **Performance Monitoring**: System health and optimization
- **Compliance Tools**: GDPR compliance and data retention

## Technical Architecture

### Frontend
- **Next.js 14**: Modern React framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Pre-built components
- **Mobile-First**: Responsive design

### Backend
- **Next.js API Routes**: Server-side logic
- **PostgreSQL**: Reliable database
- **Prisma ORM**: Type-safe database access
- **Amazon S3**: File storage
- **Clerk**: Authentication

### Integrations
- **Stripe**: Payment processing
- **Vercel**: Hosting and deployment
- **Sentry**: Error monitoring
- **Analytics**: User behavior tracking

## Success Metrics

### User Experience
- **Time to Value**: < 10 minutes to create first show
- **Activation Rate**: > 60% of users publish within 7 days
- **Mobile Usage**: > 70% of actors use mobile devices
- **Completion Rate**: > 85% of applications completed

### Business Metrics
- **Conversion Rate**: > 5% free to paid conversion
- **User Retention**: > 80% monthly active users
- **Performance**: < 3 second page load times
- **Uptime**: > 99.9% service availability

## Getting Started

### For Developers
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations
5. Start development server: `npm run dev`

### For Users
1. Visit the public audition page URL
2. For directors: Sign up and create your first show
3. For actors: Browse shows and submit applications
4. For product owners: Access analytics dashboard

## Support & Documentation

### User Guides
- Director onboarding guide
- Actor application instructions
- Product owner analytics guide

### Technical Documentation
- API documentation
- Database schema
- Deployment guide
- Monitoring setup

### Support Channels
- In-app help system
- Email support
- Documentation portal
- Community forum

## Future Enhancements

### Phase 2 Features
- Advanced analytics dashboard
- Team collaboration tools
- Custom branding options
- Integration with calendar systems

### Long-term Vision
- National talent network
- Advanced casting tools
- Mobile app development
- AI-powered casting assistance

This quickstart guide emphasizes simplicity for directors and actors while providing comprehensive data management capabilities for product owners. The focus is on creating an intuitive, mobile-first experience that solves real problems in the community theater space.
