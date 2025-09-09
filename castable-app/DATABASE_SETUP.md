# Database Setup Guide

## Current Configuration

### Supabase Database
- **URL**: `postgresql://postgres:wKB1eLf3bSQpbwiV@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres`
- **Status**: Connection issues detected

### Local Development (Recommended)
- **URL**: `postgresql://postgres:password@localhost:5432/castable_dev`
- **Status**: Ready for setup

## Setup Options

### Option 1: Use Local PostgreSQL (Recommended for Development)

1. **Install PostgreSQL locally** or use Docker:
   ```bash
   # Using Docker
   docker run --name castable-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=castable_dev -p 5432:5432 -d postgres:15
   ```

2. **Update .env file**:
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/castable_dev"
   DIRECT_URL="postgresql://postgres:password@localhost:5432/castable_dev"
   ```

3. **Setup database**:
   ```bash
   npm run db:setup
   ```

### Option 2: Fix Supabase Connection

1. **Check Supabase project status**:
   - Visit [Supabase Dashboard](https://supabase.com/dashboard)
   - Ensure project is active and running
   - Verify database credentials

2. **Update connection string** if needed:
   ```bash
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
   ```

3. **Test connection**:
   ```bash
   npm run db:test
   ```

## Database Schema

The application uses the following tables:

- **User**: Clerk user integration
- **Show**: Theater shows/auditions
- **Character**: Characters in shows
- **Applicant**: Audition applicants

## Available Scripts

- `npm run db:setup` - Create database tables
- `npm run db:test` - Test database connection
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## Next Steps

1. Choose setup option above
2. Run database setup
3. Test connection
4. Start development server
