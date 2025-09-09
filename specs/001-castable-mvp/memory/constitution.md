# Development Constitution: Castable MVP

## Core Principles

### 1. Simplicity First
- **Director Experience**: Every feature must be intuitive and require minimal learning
- **Actor Experience**: Public pages must be immediately usable on any device
- **Admin Experience**: Complex features hidden behind simple interfaces

### 2. Mobile-First Design
- All public pages must work perfectly on mobile devices
- Touch-friendly interfaces with appropriate sizing
- Fast loading and responsive layouts

### 3. Data Privacy & Security
- User data protection is paramount
- Clear data retention policies
- Secure file handling and storage
- GDPR compliance considerations

### 4. Performance & Reliability
- Fast page loads (< 2 seconds)
- Reliable database operations
- Graceful error handling
- 99.9% uptime target

### 5. **Dependency-Aware Testing**
- **Every completed task must be tested** before marking as complete
- **When tests fail, diagnose the root cause**
- **If failure is due to missing dependencies, complete those tasks first**
- **After dependencies are complete, re-test the original task**
- **Continue until all tasks pass before marking complete**
- **Track dependency chains and test in correct order**

## Technical Standards

### Code Quality
- TypeScript for all code
- ESLint configuration enforced
- Consistent naming conventions
- Comprehensive error handling
- Clear documentation

### Database Design
- Normalized schema with proper relationships
- Indexed fields for performance
- Data validation at database level
- Migration scripts for schema changes
- Backup and recovery procedures

### API Design
- RESTful endpoints with clear naming
- Consistent response formats
- Proper HTTP status codes
- Input validation and sanitization
- Rate limiting and security headers

### UI/UX Standards
- Shadcn UI components for consistency
- Tailwind CSS for styling
- Accessible design (WCAG 2.1 AA)
- Consistent spacing and typography
- Loading states and error boundaries

## Quality Gates

### Pre-Development
- [ ] Requirements clearly defined
- [ ] User stories written and reviewed
- [ ] Technical approach documented
- [ ] Dependencies identified

### During Development
- [ ] Code follows established patterns
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Security considerations addressed

### Post-Development
- [ ] **Functionality tested manually**
- [ ] **Database operations verified**
- [ ] **API endpoints tested**
- [ ] **UI/UX validated**
- [ ] **Error scenarios tested**
- [ ] **Performance validated**
- [ ] **Dependencies resolved and tested**
- [ ] **Re-test after dependency completion**
- Code reviewed
- Documentation updated

### **Intelligent Testing Workflow**

#### **Step 1: Initial Test**
- Run tests for the completed task
- Document any failures and their causes

#### **Step 2: Dependency Analysis**
- Identify if failures are due to missing dependencies
- Map out the dependency chain
- Prioritize dependency tasks

#### **Step 3: Dependency Resolution**
- Complete dependency tasks in order
- Test each dependency as it's completed
- Ensure dependencies are fully functional

#### **Step 4: Re-test Original Task**
- Return to the original task
- Run tests again
- Verify all functionality works

#### **Step 5: Mark Complete**
- Only mark task as complete when all tests pass
- Update dependency status
- Move to next priority task

### **Testing Requirements**

#### **Mandatory Testing Checklist**
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

6. **Dependency Testing**
   - [ ] All required dependencies are complete
   - [ ] Dependencies are tested and working
   - [ ] Integration with dependencies verified
   - [ ] No circular dependencies

#### **Testing Tools & Methods**
- **Manual Testing**: Primary method for UI/UX validation
- **Database Scripts**: Verify data operations
- **API Testing**: Postman or similar tools
- **Browser Testing**: Cross-browser compatibility
- **Mobile Testing**: Device-specific validation
- **Playwright**: Automated end-to-end testing
- **Dependency Mapping**: Track task dependencies

#### **Testing Documentation**
- Test results documented in task completion
- Issues found and resolved
- Performance metrics recorded
- User feedback incorporated
- Dependency resolution steps documented

## Data Management Principles

### Data Retention
- Free tier: 30 days after last show performance
- Paid tiers: Retained while subscription active
- Automated purging based on subscription status
- User notification before data deletion

### Data Export
- CSV export for all user data
- PDF reports for show information
- Bulk download capabilities
- Data portability compliance

### Storage Management
- S3 for file storage with encryption
- CDN for performance optimization
- File type validation and size limits
- Automatic cleanup of orphaned files

## Monitoring & Analytics

### User Metrics
- Activation rates and user engagement
- Conversion from free to paid plans
- Feature usage and adoption
- User retention and churn analysis

### System Metrics
- Application performance monitoring
- Database query performance
- Error rates and system health
- Storage usage and costs

### Business Metrics
- Revenue and subscription tracking
- Customer acquisition costs
- Lifetime value calculations
- Market penetration analysis

## Security Standards

### Authentication
- Clerk for user management
- JWT tokens for API access
- Role-based access control
- Session management

### Data Protection
- Encryption at rest and in transit
- Secure file upload handling
- Input sanitization
- SQL injection prevention

### Privacy Compliance
- GDPR compliance measures
- Data minimization principles
- User consent management
- Right to deletion implementation

## Deployment Standards

### Environment Management
- Development, staging, and production environments
- Environment-specific configurations
- Secret management
- Database migration procedures

### CI/CD Pipeline
- Automated testing on commits
- Code quality checks
- Security scanning
- Automated deployment

### Monitoring & Alerting
- Application performance monitoring
- Error tracking and alerting
- Uptime monitoring
- Resource usage alerts

## Documentation Standards

### Code Documentation
- JSDoc comments for functions
- README files for each major component
- API documentation
- Database schema documentation

### User Documentation
- Help guides for directors
- Actor application instructions
- FAQ and troubleshooting
- Video tutorials for complex features

### Technical Documentation
- Architecture decisions
- Deployment procedures
- Monitoring and maintenance
- Security procedures

## Success Metrics

### User Experience
- Task completion rates > 95%
- User satisfaction scores > 4.5/5
- Support ticket volume < 5% of users
- Mobile usage > 60% of traffic

### Technical Performance
- Page load times < 2 seconds
- API response times < 500ms
- Database query times < 100ms
- Uptime > 99.9%

### Business Metrics
- Monthly active users growth
- Conversion rate > 15%
- Customer acquisition cost < $50
- Monthly recurring revenue growth

## Continuous Improvement

### Regular Reviews
- Weekly progress reviews
- Monthly user feedback analysis
- Quarterly technical debt assessment
- Annual architecture review

### Process Optimization
- Development workflow improvements
- Testing process enhancements
- Deployment automation
- Monitoring and alerting refinement

### Learning and Development
- Team skill development
- Technology stack updates
- Best practice adoption
- Industry trend monitoring