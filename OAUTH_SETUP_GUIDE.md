# OAuth Setup Guide for Revara

## Overview
This guide will help you set up Google and GitHub OAuth authentication for your Revara application.

## 🔧 **Step 1: Google OAuth Setup**

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Create a new project or select existing one

### 2. Enable Google+ API
- Go to "APIs & Services" → "Library"
- Search for "Google+ API" and enable it

### 3. Create OAuth Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth client ID"
- Choose "Web application"
- Add authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (development)
  - `https://yourdomain.com/api/auth/callback/google` (production)

### 4. Get Your Credentials
- Copy the Client ID and Client Secret
- Update your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🐙 **Step 2: GitHub OAuth Setup**

### 1. Go to GitHub Settings
- Visit: https://github.com/settings/developers
- Click "New OAuth App"

### 2. Create OAuth App
- **Application name**: Revara
- **Homepage URL**: `http://localhost:3000` (development)
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

### 3. Get Your Credentials
- Copy the Client ID and Client Secret
- Update your `.env` file:
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 📝 **Step 3: Update Environment Variables**

Add these to your `.env` file:
```env
# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

## 🚀 **Step 4: Test the Integration**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the signup page:**
   - Go to `http://localhost:3000/auth/signup`
   - Click "Continue with Google" or "Continue with GitHub"
   - Complete the OAuth flow

3. **Expected behavior:**
   - User gets redirected to Google/GitHub
   - After authorization, user returns to `/dashboard`
   - User account is automatically created in your database

## ✅ **Features Now Active:**

### **Signup Page (`/auth/signup`):**
- ✅ Active Google sign-in button with loading state
- ✅ Active GitHub sign-in button with loading state
- ✅ Smooth animations and hover effects
- ✅ Error handling for failed OAuth attempts

### **Signin Page (`/auth/signin`):**
- ✅ Active Google sign-in button with loading state
- ✅ Active GitHub sign-in button with loading state
- ✅ Consistent styling with signup page
- ✅ Proper error handling

### **User Experience:**
- ✅ Loading spinners during OAuth process
- ✅ Disabled state prevents multiple clicks
- ✅ Professional hover and focus effects
- ✅ Automatic account creation for new OAuth users
- ✅ Seamless redirect to dashboard after sign-in

## 🔒 **Security Notes:**

- OAuth credentials are stored securely in environment variables
- Users can sign in with existing accounts or create new ones
- All OAuth flows are handled by NextAuth.js
- User data is automatically synced with your database

## 🎯 **Next Steps:**

1. **Get your OAuth credentials** from Google and GitHub
2. **Update your `.env` file** with the real credentials
3. **Test the sign-in flow** on both signup and signin pages
4. **Deploy to production** with production OAuth URLs

Your OAuth buttons are now fully active and ready to use! 🎉
