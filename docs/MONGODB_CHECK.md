# MongoDB kaam kar raha hai ya nahi — kaise check karein

## Quick test

```bash
cd backend
npm run seed:admin
```

**Success:** Terminal mein dikhega:
- `✅ MongoDB connected`
- `✅ Admin user created` (ya updated)
- Email / Password print hoga

**Fail:** Error message padho (neeche common fixes).

## Admin login

| Field | Value |
|--------|--------|
| **URL** | http://localhost:3000/login |
| **Email** | `admin@plusalphaintern.com` |
| **Password** | `Admin@123456` |

Login ke baad admin panel: **http://localhost:3000/admin**

Pehle backend chalana zaroori hai:

```bash
cd backend
npm run dev
```

Alag terminal mein frontend:

```bash
cd frontend
npm run dev
```

## Common errors

### `querySrv ECONNREFUSED`
- Internet check karo
- MongoDB Atlas → **Network Access** → IP allow (`0.0.0.0/0` test ke liye)
- Antivirus / VPN DNS block kar sakta hai — band karke dubara `npm run seed:admin`

### `bad auth` / `Authentication failed`
- `backend/.env` mein password galat hai — Atlas user password dubara copy karo

### `ECONNREFUSED 127.0.0.1`
- Local MongoDB nahi — sirf Atlas URI use karo `MONGODB_URI=...`

---

**Security:** `.env` kabhi share ya GitHub par mat daalo.
