# Mental Health AI Chatbot (Production-Style MERN)

A production-style mental health support chatbot with:
- Secure auth (JWT)
- Compassion-first AI responses
- Sentiment + crisis risk scoring
- Crisis banner and admin alerts
- React + Vite frontend
- Express + MongoDB backend

## Important Safety Note
This app is **not a replacement for medical care** and should not be presented as a licensed therapist.
In crisis scenarios, it should provide immediate local helpline guidance and emergency escalation.

## Stack
- Client: React, Vite, Redux Toolkit, Axios
- Server: Node.js, Express, MongoDB, Mongoose, JWT, Helmet, Rate limiting
- AI: OpenAI-compatible SDK (works with OpenAI or Groq-compatible endpoint)
- Sentiment: `sentiment` package

## Quick Start
1. Install dependencies
   - `npm install`
2. Configure env
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`
3. Run in dev
   - `npm run dev`

## Production Checklist
- Set strong JWT secret
- Restrict CORS to your frontend domain
- Use HTTPS and secure cookie/token handling
- Enable monitoring/logs and incident alerting
- Add tests for auth/chat/crisis paths

## Where To Deploy
Recommended stack for fastest launch:
- Backend API: Render (free web service)
- Frontend UI: Vercel (free static hosting)
- Database: MongoDB Atlas (free M0 cluster)

Alternative options:
- Full AWS: EC2 + S3 + CloudFront + Atlas
- Railway for backend + Vercel for frontend

## Deploy Now (Render + Vercel)
1. Push project to GitHub.
2. Create MongoDB Atlas cluster and copy connection string.
3. Deploy backend on Render:
   - Create new Web Service from this repo.
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/health`
   - Add environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `JWT_EXPIRE=7d`
     - `CLIENT_URL` (your Vercel URL)
     - `OPENAI_API_KEY`
     - `OPENAI_MODEL=gpt-4o-mini`
     - Optional email alert vars (`SMTP_*`, `ALERT_EMAIL_*`)
4. Deploy frontend on Vercel:
   - Import same GitHub repo.
   - Set project root to `client`.
   - Add env var: `VITE_API_URL=https://YOUR_RENDER_SERVICE.onrender.com/api`
5. Update backend CORS:
   - Set Render env `CLIENT_URL` to your Vercel domain exactly.
6. Test live endpoints:
   - Backend health: `https://YOUR_RENDER_SERVICE.onrender.com/health`
   - Open Vercel app and test login + chat.

## Deployment Config Files Included
- `render.yaml` for Render backend service blueprint
- `client/vercel.json` for SPA route rewrites

## Enable Auto Deploy (GitHub Actions)
This repo now includes webhook-based CD in `.github/workflows/ci.yml`.
On every push to `main`, GitHub Actions will:
- Build frontend
- Trigger Render deploy hook
- Trigger Vercel deploy hook

### 1. Create Deploy Hooks
- Render:
   - Service -> Settings -> Deploy Hook -> Create Hook
   - Copy URL
- Vercel:
   - Project -> Settings -> Git -> Deploy Hooks -> Create Hook
   - Branch: `main`
   - Copy URL

### 2. Add GitHub Repository Secrets
GitHub -> Repository -> Settings -> Secrets and variables -> Actions -> New repository secret

Add:
- `RENDER_DEPLOY_HOOK_URL` = your Render deploy hook URL
- `VERCEL_DEPLOY_HOOK_URL` = your Vercel deploy hook URL

### 3. Push to Main
Run:
- `git add .`
- `git commit -m "Setup CI/CD deploy hooks"`
- `git push origin main`

After push, check the Actions tab to confirm both deploy jobs succeeded.
