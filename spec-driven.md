# Spec-Driven Development for Castable

This project follows the [GitHub Spec Kit](https://github.com/github/spec-kit) methodology for spec-driven development.

## Overview

Spec-Driven Development (SDD) is a methodology that emphasizes creating detailed specifications before implementation, ensuring that all stakeholders understand the requirements and reducing the risk of miscommunication and scope creep.

## Project Structure

```
├── specs/                          # Feature specifications
│   ├── 001-castable-mvp/          # Main MVP feature
│   │   ├── contracts/              # API contracts and schemas
│   │   ├── memory/                 # Development constitution and guidelines
│   │   ├── scripts/                # Automation scripts
│   │   ├── spec.md                 # Feature specification
│   │   ├── plan.md                 # Implementation plan
│   │   └── tasks.md                # Task breakdown
│   └── [future-features]/         # Additional features
├── templates/                      # Reusable templates
│   ├── spec-template.md
│   ├── plan-template.md
│   └── tasks-template.md
└── castable-app/                   # Implementation code
```

## Development Workflow

### 1. Feature Specification
Each feature starts with a detailed specification that includes:
- Problem statement and vision
- User stories and requirements
- Technical requirements
- Success metrics
- Review checklist

### 2. Implementation Planning
After specification approval, create a detailed implementation plan:
- Architecture overview
- Database schema
- API specifications
- Implementation phases
- Testing strategy
- Deployment strategy

### 3. Task Breakdown
Break down the implementation into manageable tasks:
- Phase-based organization
- Clear dependencies
- Acceptance criteria
- Progress tracking

### 4. Implementation
Follow the constitution and guidelines while implementing:
- Code quality standards
- Testing requirements
- Security considerations
- Performance targets

## Key Principles

### 1. Specification First
- Never start coding without a complete specification
- All requirements must be documented and approved
- Regular reviews to ensure alignment

### 2. User-Centric Design
- Every feature must address a real user need
- User experience takes priority over technical elegance
- Mobile-first approach for all interfaces

### 3. Quality Over Speed
- Comprehensive testing is mandatory
- Code reviews for all changes
- Performance and security are non-negotiable

### 4. Continuous Improvement
- Regular retrospectives and process improvements
- Learning from each implementation
- Updating templates and guidelines based on experience

## Getting Started

### For New Features
1. Create a new feature specification:
   ```bash
   ./specs/001-castable-mvp/scripts/create-new-feature.sh "feature-name" "002"
   ```

2. Edit the specification files:
   - `specs/002-feature-name/spec.md` - Feature requirements
   - `specs/002-feature-name/plan.md` - Technical implementation
   - `specs/002-feature-name/tasks.md` - Task breakdown

3. Validate the setup:
   ```bash
   ./specs/002-feature-name/scripts/setup-plan.sh
   ```

### For Existing Features
1. List available features:
   ```bash
   ./specs/001-castable-mvp/scripts/get-feature-paths.sh
   ```

2. Navigate to the feature directory:
   ```bash
   cd specs/001-castable-mvp
   ```

3. Check prerequisites for a task:
   ```bash
   ./scripts/check-task-prerequisites.sh 2.1
   ```

## Current Status

### Active Features
- **001-castable-mvp**: Main MVP implementation
  - Phase 1: Core Infrastructure (4/5 tasks completed)
  - Phase 2: Director Dashboard (0/6 tasks completed)
  - Phase 3: Public Audition Pages (0/6 tasks completed)
  - Phase 4: Applicant Management (0/5 tasks completed)
  - Phase 5: Billing & Plan Management (0/5 tasks completed)

### Next Steps
1. Complete Phase 1.5: Set up Shadcn UI and Radix UI
2. Begin Phase 2: Director Dashboard implementation
3. Follow the task list in `specs/001-castable-mvp/tasks.md`

## Resources

- [GitHub Spec Kit Documentation](https://github.com/github/spec-kit)
- [Castable MVP Specification](specs/001-castable-mvp/spec.md)
- [Implementation Plan](specs/001-castable-mvp/plan.md)
- [Task List](specs/001-castable-mvp/tasks.md)
- [Development Constitution](specs/001-castable-mvp/memory/constitution.md)
