# MongoDB link yahan add karo

## Step 1 — File kholo

```
backend/.env
```

## Step 2 — Password lagao

Is line mein `APNA_ASLI_PASSWORD` ko Atlas ka **real password** se replace karo:

```
MONGODB_URI=mongodb+srv://plusalphaintern_db_user:APNA_ASLI_PASSWORD@cluster0.rqe9we2.mongodb.net/plus-alpha-intern?retryWrites=true&w=majority&appName=Cluster0
```

**Example:** agar password `MyPass123` hai to:

```
MONGODB_URI=mongodb+srv://plusalphaintern_db_user:MyPass123@cluster0.rqe9we2.mongodb.net/plus-alpha-intern?retryWrites=true&w=majority&appName=Cluster0
```

> Password mein `@`, `#`, `%` ho to URL-encode karna padega (e.g. `@` → `%40`).

## Step 3 — Atlas settings

1. [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access** → **Add IP** → `0.0.0.0/0` (Allow from anywhere) ya apna IP
2. **Database Access** → user `plusalphaintern_db_user` active ho

## Step 4 — Backend chalao

```bash
cd backend
npm install
npm run seed:admin
npm run dev
```

Success: terminal mein `MongoDB connected` dikhega.

## Admin login

- Email: `admin@plusalphaintern.com`
- Password: `Admin@123456`

---

`.env` file kabhi GitHub par upload mat karo — sirf apne computer par rakho.
