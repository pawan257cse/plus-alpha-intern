# Plus Alpha Intern — API Reference

Base URL: `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <token>`

## Authentication

### Register
```
POST /auth/register
Body: { name, email, password, role?: "student" | "company" }
```

### Verify OTP
```
POST /auth/verify-otp
Body: { email, otp }
Response: { token, user }
```

### Login
```
POST /auth/login
Body: { email, password }
```

### Google Login
```
POST /auth/google
Body: { credential: "<google-id-token>" }
```

## Internships

```
GET /internships?domain=&location=&minStipend=&isRemote=&search=&page=1&limit=12
GET /internships/:id
POST /internships/:id/apply          [student]
POST /internships/:id/save           [student]
GET  /internships/applications/me    [student]
GET  /internships/leaderboard
```

## AI (Gemini)

```
POST /ai/resume-analyzer
Body: { resumeText: string }

POST /ai/internship-recommendation
Body: { skills?: string[], interests: string }

POST /ai/career-roadmap
Body: { goal: string, skills?: string[] }

POST /ai/skill-gap
Body: { targetRole: string, skills?: string[] }

POST /ai/mock-interview
Body: { role, question, answer }
```

## Certificates

```
GET /certificates/verify/:verificationId   (public)
GET /certificates/me                       [auth]
```

## Admin

```
GET  /admin/stats      [admin]
GET  /admin/users      [admin]
PATCH /admin/users/:id/verify [admin]
```
