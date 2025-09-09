# Supabase Setup Status

## Current Issue
The Supabase database at `db.wbcqkzbnpxmupabkreyk.supabase.co:5432` is not accessible.

## Possible Causes
1. **Project Inactive**: The Supabase project may be paused or deleted
2. **Credentials Changed**: Database password may have been reset
3. **Network Issues**: Connection may be blocked by firewall
4. **Project Suspended**: Account may have exceeded limits

## Solutions

### Option 1: Create New Supabase Project
1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Get new database credentials
4. Update `.env` file with new credentials

### Option 2: Use Local Development
1. Install PostgreSQL locally
2. Update `.env` to use local database
3. Run `npm run setup` to create tables

### Option 3: Use Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to existing project
supabase link --project-ref YOUR_PROJECT_REF

# Start local development
supabase start
```

## Current Database Schema
The application is ready with the following schema:
- **User**: Clerk user integration
- **Show**: Theater shows/auditions  
- **Character**: Characters in shows
- **Applicant**: Audition applicants

## Next Steps
1. Choose one of the solutions above
2. Update database credentials
3. Run `npm run setup` to initialize database
4. Test connection at `/test-db`
