# Issues Log

## Overview
This document tracks ongoing issues that need monitoring and resolution. These are infrastructure and technical debt items that don't block feature development but should be addressed.

## Active Issues

### 🔴 **High Priority**

#### Database Connection Issues
- **Issue**: Persistent "prepared statement 's0' already exists" errors
- **Impact**: Prevents database migrations and schema updates
- **Affects**: All database operations, testing, development
- **Status**: Active
- **First Reported**: 2025-01-09
- **Last Updated**: 2025-01-09
- **Attempted Fixes**:
  - `npx prisma db push` - Failed
  - `npx prisma migrate dev` - Failed
  - `npx prisma db push --force-reset --accept-data-loss` - Failed
  - `npx prisma db pull` - Failed
- **Workaround**: Using mock data for testing
- **Next Steps**: 
  - Investigate database connection string
  - Check for connection pooling issues
  - Consider database reset/recreation

### 🟡 **Medium Priority**

#### Playwright Authentication Mocking
- **Issue**: Clerk authentication redirects prevent Playwright tests from running
- **Impact**: All end-to-end testing blocked
- **Affects**: Test coverage, CI/CD pipeline, quality assurance
- **Status**: Active
- **First Reported**: 2025-01-09
- **Last Updated**: 2025-01-09
- **Attempted Fixes**:
  - Client-side Clerk mocking - Partial success
  - API route interception - Failed
  - Environment variable overrides - Failed
- **Workaround**: API-level testing, manual testing
- **Next Steps**:
  - Implement test-specific middleware
  - Create authentication bypass for test environment
  - Consider using test-specific Clerk configuration

### 🟢 **Low Priority**

#### Test Infrastructure Stability
- **Issue**: Playwright tests require single worker mode for stability
- **Impact**: Slower test execution, potential resource conflicts
- **Affects**: Test performance, parallel execution
- **Status**: Active
- **First Reported**: 2025-01-09
- **Last Updated**: 2025-01-09
- **Current Workaround**: `workers: 1` in playwright.config.ts
- **Next Steps**:
  - Fix authentication mocking to enable parallel testing
  - Implement proper test isolation
  - Gradually increase worker count as stability improves

## Resolved Issues

### ✅ **Database Schema Migration** (2025-01-09)
- **Issue**: `publicUrl` field not added to Show model
- **Resolution**: Successfully added via Prisma schema update
- **Status**: Resolved

### ✅ **Show Editing Implementation** (2025-01-09)
- **Issue**: Missing show editing capabilities
- **Resolution**: Implemented complete edit workflow with API endpoints
- **Status**: Resolved

## Monitoring Guidelines

### Issue Severity Levels
- 🔴 **High**: Blocks core functionality or development
- 🟡 **Medium**: Affects testing, performance, or user experience
- 🟢 **Low**: Minor inconveniences or optimizations

### Update Frequency
- **High Priority**: Check daily
- **Medium Priority**: Check weekly
- **Low Priority**: Check monthly

### Resolution Criteria
- **High Priority**: Must be resolved before production deployment
- **Medium Priority**: Should be resolved within current sprint
- **Low Priority**: Can be addressed in future iterations

## Notes

- This log should be updated whenever new issues are discovered
- Include attempted fixes and their outcomes
- Document workarounds and their limitations
- Track resolution progress and timelines
- Link to related GitHub issues or tickets when applicable

## Related Documents
- [Constitution](../constitution.md) - Development principles
- [Tasks](../tasks.md) - Task tracking and completion
- [Plan](../plan.md) - Implementation roadmap

