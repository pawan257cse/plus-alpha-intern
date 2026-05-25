# Plus Alpha Intern

AI-powered internship, learning, and certification platform for students.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, Shadcn-style UI |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT, Email OTP, Google OAuth |
| AI | Google Gemini API |
| Payments | Razorpay |
| Storage | Cloudinary |
| Real-time | Socket.io |

## Project Structure

```
plusintern/
├── frontend/          # Main Next.js app (port 3000)
├── backend/           # Express API (port 5000)
├── admin-panel/       # Admin dashboard scaffold (port 3001)
├── shared/            # Shared types & constants
├── docs/              # API & deployment guides
└── imges/             # Static assets
```

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with MongoDB URI, JWT secret, GEMINI_API_KEY, etc.
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all required keys.

**Minimum to run locally:**
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Random secure string
- `GEMINI_API_KEY` — For AI features ([Google AI Studio](https://aistudio.google.com/))

## API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register student/company |
| POST | `/auth/login` | Login |
| POST | `/auth/verify-otp` | Verify email OTP |
| POST | `/auth/google` | Google OAuth |
| GET | `/internships` | List internships |
| POST | `/internships/:id/apply` | Apply (student) |
| GET | `/courses` | List courses |
| POST | `/ai/resume-analyzer` | AI resume analysis |
| POST | `/ai/career-roadmap` | AI career roadmap |
| GET | `/certificates/verify/:id` | Public cert verification |
| GET | `/admin/stats` | Admin analytics |

Full docs: [docs/api/README.md](docs/api/README.md)

## Deployment

- **Frontend:** Vercel — set `NEXT_PUBLIC_API_URL` to production API
- **Backend:** Render or Railway — set all env vars from `.env.example`
- **Database:** MongoDB Atlas

See [docs/deployment/DEPLOY.md](docs/deployment/DEPLOY.md)

## Features

- Premium landing page with glassmorphism & animations
- Student dashboard with XP, streaks, leaderboard
- Internship listing, apply, save, track status
- Courses with progress & auto-certificates
- Gemini AI: resume analyzer, recommendations, roadmap, mock interview, skill gap
- Admin analytics dashboard
- Certificate verification
- Dark/light mode, fully responsive

## License

MIT
