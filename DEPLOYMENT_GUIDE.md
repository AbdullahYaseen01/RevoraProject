# 🚀 Quick Netlify Deployment Guide

## ⚡ SUPER FAST DEPLOYMENT (5 minutes)

### Step 1: Go to Netlify
1. Open: https://netlify.com
2. Click "Sign up" (if you don't have an account)
3. Use GitHub to sign up (recommended)

### Step 2: Deploy Your Site
1. Click "New site from Git"
2. Choose "GitHub"
3. Select: `AbdullahYaseen01/RevoraProject`
4. Click "Deploy site" (Netlify will auto-detect settings)

### Step 3: Set Environment Variables
1. Go to Site Settings → Environment Variables
2. Add these variables:

```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmV2YXJhYWkiLCJhIjoiY21iODdhMzJ4MDBnczJtcHd2NXpibW1laSJ9.e6-3MRdJxZaLUxoUUSEFcg
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
DATABASE_URL=postgresql://username:password@localhost:5432/revara_db
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=your-super-secret-key-here
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@revara.com
FROM_NAME=Revara
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-32-character-key-here
```

### Step 4: Redeploy
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"

## 🎯 Your site will be live at: `https://random-name.netlify.app`

## 🔧 Quick Database Setup (Optional)
If you need a database, use Neon (free):
1. Go to: https://neon.tech
2. Create account
3. Create new project
4. Copy the connection string
5. Paste it as `DATABASE_URL` in Netlify

## ✅ That's it! Your site is live!
