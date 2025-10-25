# Database Setup Guide - Step by Step Solution

## 🚨 Current Problem
**Error**: `Can't reach database server at 'localhost:5432'`
**Cause**: PostgreSQL is not installed or running on your system

## 🎯 Solution Options

### Option 1: Use Free Cloud Database (Recommended)
**Neon PostgreSQL** - Free cloud database service

#### Step 1: Create Neon Account
1. **Go to**: https://neon.tech/
2. **Click**: "Sign Up" (free account)
3. **Sign up** with GitHub, Google, or email

#### Step 2: Create Database
1. **Click**: "Create Project"
2. **Name**: `revora-project`
3. **Database**: `revora_db`
4. **Region**: Choose closest to you
5. **Click**: "Create Project"

#### Step 3: Get Connection String
1. **Go to**: Dashboard → Your Project
2. **Click**: "Connection Details"
3. **Copy**: Connection String (looks like: `postgresql://username:password@hostname/database`)

#### Step 4: Update Environment Variables
Replace your current `DATABASE_URL` in `.env.local`:

```bash
# Replace this line in .env.local:
DATABASE_URL=postgresql://postgres:password@localhost:5432/revora_db

# With your Neon connection string:
DATABASE_URL=postgresql://username:password@hostname.neon.tech/revora_db
```

### Option 2: Install PostgreSQL Locally

#### Step 1: Download PostgreSQL
1. **Go to**: https://www.postgresql.org/download/windows/
2. **Download**: PostgreSQL installer for Windows
3. **Run**: Installer as Administrator

#### Step 2: Install PostgreSQL
1. **Follow**: Installation wizard
2. **Set password**: for `postgres` user (remember this!)
3. **Port**: Keep default `5432`
4. **Complete**: Installation

#### Step 3: Start PostgreSQL Service
```powershell
# Start PostgreSQL service
net start postgresql-x64-15

# Or start via Services
services.msc
# Find "postgresql" service and start it
```

#### Step 4: Create Database
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE revora_db;

# Exit
\q
```

## 🔧 Quick Fix Commands

### Check if PostgreSQL is running:
```powershell
Get-Service -Name "*postgres*"
Get-Process -Name "*postgres*"
```

### Test database connection:
```powershell
psql -h localhost -p 5432 -U postgres -d revora_db
```

## 🎯 Recommended Action

**Use Neon (Option 1)** because:
- ✅ **No installation required**
- ✅ **Free tier available**
- ✅ **Always accessible**
- ✅ **No local setup needed**
- ✅ **Works immediately**

## 📋 Next Steps After Database Setup

1. **Update** `.env.local` with new `DATABASE_URL`
2. **Run** database migrations:
   ```bash
   npx prisma db push
   ```
3. **Restart** development server:
   ```bash
   npm run dev --turbopack
   ```
4. **Test** the application

## 🚀 Quick Start with Neon

1. **Sign up**: https://neon.tech/
2. **Create project**: `revora-project`
3. **Copy connection string**
4. **Update** `.env.local`
5. **Run**: `npx prisma db push`
6. **Restart**: `npm run dev --turbopack`

**Your application will work immediately!** 🎉
