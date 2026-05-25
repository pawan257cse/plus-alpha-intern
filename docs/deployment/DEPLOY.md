# Deployment Guide

## Frontend (Vercel)

1. Push repo to GitHub
2. Import `frontend` folder in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api`
   - `NEXT_PUBLIC_SOCKET_URL=https://your-api.onrender.com`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID=...`
4. Deploy

## Backend (Render)

1. Create Web Service, root: `backend`
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Add environment variables from `backend/.env.example`
5. Enable health check: `/api/health`

## MongoDB Atlas

1. Create free cluster
2. Database Access → create user
3. Network Access → allow `0.0.0.0/0` (or Vercel/Render IPs)
4. Copy connection string to `MONGODB_URI`

## Cloudinary

1. Create account at cloudinary.com
2. Copy cloud name, API key, secret to `.env`

## Razorpay

1. Create test/live keys at dashboard.razorpay.com
2. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

## Gemini AI

1. Get API key from https://aistudio.google.com/
2. Set `GEMINI_API_KEY` on backend

## Google OAuth

1. Google Cloud Console → APIs → OAuth 2.0
2. Authorized origins: `http://localhost:3000`, production URL
3. Set `GOOGLE_CLIENT_ID` on frontend and backend

## Post-Deploy Checklist

- [ ] CORS `CLIENT_URL` matches Vercel URL
- [ ] JWT secrets are strong random strings
- [ ] SMTP configured for OTP emails
- [ ] SSL enabled on production domains
