# Implementation Plan: Castable MVP

## 1. Architecture Overview

### 1.1. System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 14    │    │   PostgreSQL    │    │   Amazon S3     │
│   Frontend      │◄──►│   Database      │    │   File Storage  │
│   (Vercel)      │    │   (Supabase)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Clerk       │    │     Stripe      │    │   AG Grid       │
│  Authentication │    │   Payments      │    │   Data Grid     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2. Technology Stack
- **Frontend:** Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes and Server Actions
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **File Storage:** Amazon S3
- **Payment Processing:** Stripe
- **Data Grid:** AG Grid
- **UI Components:** Shadcn UI with Radix UI
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics + Custom metrics
- **Monitoring:** Sentry for error tracking

### 1.3. Key Components
- Director Dashboard (Protected Route) - Simple, clean interface
- Show Creation Wizard (Single-page, guided flow)
- Public Audition Pages (Mobile-first, actor-friendly)
- Applicant Management System (AG Grid with simple controls)
- Billing & Subscription Management
- Analytics Dashboard (Product Owner insights)
- Data Management System (Automated purging, export)

## 2. Database Schema

### 2.1. Core Tables
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'hobbyist',
    storage_used BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shows table
CREATE TABLE shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    audition_dates JSONB,
    performance_dates JSONB,
    template_id VARCHAR(50) DEFAULT 'classic',
    public_url VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    application_deadline TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Characters table
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id UUID REFERENCES shows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    vocal_info TEXT,
    description TEXT,
    age_range VARCHAR(50),
    experience_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Applicants table
CREATE TABLE applicants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id UUID REFERENCES shows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    character_applied_for VARCHAR(255),
    headshot_url VARCHAR(500),
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    application_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Show materials table
CREATE TABLE show_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id UUID REFERENCES shows(id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Show templates table
CREATE TABLE show_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    template_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id),
    show_id UUID REFERENCES shows(id),
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_shows_user_id ON shows(user_id);
CREATE INDEX idx_applicants_show_id ON applicants(show_id);
CREATE INDEX idx_characters_show_id ON characters(show_id);
CREATE INDEX idx_show_materials_show_id ON show_materials(show_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
```

## 3. API Specification

### 3.1. REST Endpoints

#### Shows API
- `GET /api/shows` - Get all shows for authenticated user
- `POST /api/shows` - Create new show
- `GET /api/shows/[id]` - Get specific show
- `PUT /api/shows/[id]` - Update show
- `DELETE /api/shows/[id]` - Delete show
- `POST /api/shows/[id]/preview` - Preview show before publishing
- `POST /api/shows/[id]/close` - Close applications for show
- `POST /api/shows/[id]/duplicate` - Duplicate show as template

#### Applicants API
- `GET /api/shows/[id]/applicants` - Get all applicants for a show
- `POST /api/shows/[id]/applicants` - Submit new application
- `GET /api/shows/[id]/applicants/[applicantId]` - Get specific applicant
- `PUT /api/shows/[id]/applicants/[applicantId]` - Update applicant (notes, rating)
- `POST /api/shows/[id]/applicants/bulk-message` - Send message to all applicants
- `GET /api/shows/[id]/applicants/export` - Export applicants to CSV

#### Public API
- `GET /api/public/shows/[publicUrl]` - Get public show data
- `POST /api/public/shows/[publicUrl]/apply` - Submit public application
- `POST /api/public/shows/[publicUrl]/draft` - Save application draft
- `PUT /api/public/shows/[publicUrl]/draft/[draftId]` - Update application draft

#### File Upload API
- `POST /api/upload` - Upload files to S3
- `DELETE /api/upload/[fileId]` - Delete file from S3

#### Analytics API
- `GET /api/analytics/overview` - Get user analytics overview
- `GET /api/analytics/shows/[id]` - Get show-specific analytics
- `GET /api/analytics/export` - Export analytics data

#### Data Management API
- `GET /api/data/export` - Export user data
- `POST /api/data/purge` - Trigger data purging
- `GET /api/data/usage` - Get storage usage information

### 3.2. WebSocket Events (Future Enhancement)
- `show:updated` - Real-time show updates
- `applicant:new` - New applicant notification
- `applicant:updated` - Applicant data changes

## 4. Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
- [x] Set up Next.js 14 project with TypeScript
- [x] Configure Clerk authentication
- [x] Set up PostgreSQL database with Prisma
- [x] Configure Amazon S3 for file storage
- [ ] Set up Shadcn UI component library
- [ ] Configure analytics and monitoring

### Phase 2: Director Dashboard (Week 3-4)
- [ ] Create simple, clean dashboard layout
- [ ] Implement show list view with basic metrics
- [ ] Build single-page show creation wizard
- [ ] Add character definition with simple template
- [ ] Implement file upload for audition materials
- [ ] Add show preview functionality
- [ ] Create show template saving system

### Phase 3: Public Audition Pages (Week 5-6)
- [ ] Create mobile-first public show pages
- [ ] Build simple actor application form
- [ ] Implement application draft saving
- [ ] Add headshot upload with validation
- [ ] Create media players for audio/PDFs
- [ ] Add application confirmation system
- [ ] Implement multi-role application support

### Phase 4: Applicant Management (Week 7-8)
- [ ] Integrate AG Grid with simple controls
- [ ] Implement sorting and filtering
- [ ] Build detailed applicant view modal
- [ ] Add notes and rating system
- [ ] Create bulk messaging system
- [ ] Add data export functionality
- [ ] Implement application status management

### Phase 5: Billing & Data Management (Week 9-10)
- [ ] Integrate Stripe for payments
- [ ] Create simple pricing page
- [ ] Implement plan limits enforcement
- [ ] Add automated data purging system
- [ ] Create data export capabilities
- [ ] Set up email notifications
- [ ] Implement data validation rules

### Phase 6: Analytics & Monitoring (Week 11-12)
- [ ] Set up user activation tracking
- [ ] Implement conversion rate monitoring
- [ ] Create analytics dashboard
- [ ] Add performance monitoring
- [ ] Set up error tracking
- [ ] Implement data quality monitoring

## 5. Testing Strategy

### 5.1. Unit Tests
- Component testing with React Testing Library
- API endpoint testing with Jest
- Database operation testing
- Data validation testing

### 5.2. Integration Tests
- End-to-end user flows with Playwright
- Authentication flow testing
- File upload testing
- Payment flow testing

### 5.3. Performance Tests
- Load testing for public pages
- Database query optimization
- File upload performance
- Analytics data processing

## 6. Deployment Strategy

### 6.1. Environment Setup
- Development: Local with Supabase
- Staging: Vercel preview deployments
- Production: Vercel with production database

### 6.2. CI/CD Pipeline
- GitHub Actions for automated testing
- Vercel for automatic deployments
- Database migrations with Prisma
- Automated data purging jobs

## 7. Security Considerations

### 7.1. Authentication & Authorization
- Clerk for user authentication
- Row Level Security (RLS) in PostgreSQL
- API route protection
- Data access controls

### 7.2. Data Protection
- File upload validation
- Input sanitization
- Rate limiting on public endpoints
- Data encryption at rest

### 7.3. Privacy & Compliance
- GDPR compliance for EU users
- Data retention policies by tier
- Secure file storage
- Data export capabilities

## 8. Monitoring & Analytics

### 8.1. Application Monitoring
- Vercel Analytics for performance
- Error tracking with Sentry
- Database performance monitoring
- File storage monitoring

### 8.2. Business Metrics
- User activation rates
- Conversion tracking
- Usage analytics
- Revenue metrics
- Data storage costs

### 8.3. Data Management
- Automated data purging
- Data quality monitoring
- Storage usage tracking
- Backup and recovery