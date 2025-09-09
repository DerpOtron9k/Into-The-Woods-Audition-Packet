# Supabase Connection Setup Guide

## 🚨 Current Issue
- **API Key**: Invalid (401 Unauthorized)
- **Database**: Can't reach server (P1001)
- **Project**: May be paused or credentials changed

## 🔧 Step-by-Step Fix

### Step 1: Check Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Look for project: `wbcqkzbnpxmupabkreyk`

### Step 2: Check Project Status
- **If project is paused**: Click "Resume" or "Restore"
- **If project is active**: Continue to Step 3
- **If project not found**: Create new project

### Step 3: Get Database Credentials
1. Go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** connection string
4. It should look like: `postgresql://postgres:[PASSWORD]@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres`

### Step 4: Get API Keys
1. Go to **Settings** → **API**
2. Copy the **anon public** key
3. Copy the **service_role** key (if needed)

### Step 5: Update Environment Variables
Update your `.env` file with the correct values:

```bash
# Clerk Keys (keep existing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVhZGluZy1tb2x5LTE1MC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_PtiPWwalS8JqQU89mni9HGxNiuyu4Z2LcwPaGQTkPI

# Supabase Database (update with correct credentials)
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR_PASSWORD]@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres"

# Supabase Client (update with correct keys)
NEXT_PUBLIC_SUPABASE_URL="https://wbcqkzbnpxmupabkreyk.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
```

### Step 6: Test Connection
After updating `.env`, run:
```bash
npm run db:test
```

## 🆕 Alternative: Create New Supabase Project

If the existing project is not accessible:

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose organization
4. Enter project name: `castable-app`
5. Enter database password
6. Choose region
7. Click **"Create new project"**
8. Wait for project to be ready
9. Get credentials from Settings → Database and Settings → API

## 🔍 Troubleshooting

### Common Issues:
- **401 Unauthorized**: API key is wrong
- **P1001 Can't reach**: Database is paused or credentials wrong
- **Project not found**: Project was deleted or you're in wrong account

### Quick Fixes:
- **Reset database password**: Settings → Database → Reset password
- **Regenerate API keys**: Settings → API → Regenerate
- **Check project status**: Dashboard → Project status

## ✅ Success Indicators

When working correctly, you should see:
- ✅ API key test returns 200 OK
- ✅ Database connection successful
- ✅ Query test returns results
- ✅ `npm run db:push` works
- ✅ `curl http://localhost:3001/api/health` returns healthy status

## 📞 Need Help?

If you're still having issues:
1. Check Supabase status page
2. Verify you're using the correct account
3. Try creating a new project
4. Contact Supabase support

**Current Status**: Waiting for correct Supabase credentials to be provided.
