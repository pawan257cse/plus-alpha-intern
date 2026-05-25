# MongoDB Atlas Setup — Plus Alpha Intern (Step by Step)

## Step 1: Account banao
1. Browser mein jao: **https://www.mongodb.com/cloud/atlas**
2. **Sign Up** karo (Google se bhi ho sakta hai)
3. Email verify karo

## Step 2: Free cluster banao
1. **Create** → **Deployment** → **Database**
2. **M0 FREE** select karo
3. Provider: **AWS** (ya default)
4. Region: **Mumbai (ap-south-1)** — India ke liye fast
5. Cluster name: `plus-alpha-cluster` (kuch bhi)
6. **Create Deployment** click karo

## Step 3: Database user (username + password)
1. **Database Access** (left menu) → **Add New Database User**
2. Authentication: **Password**
3. Username: `plusalpha` (ya apna)
4. Password: **strong password** — copy karke safe rakho
5. Role: **Atlas admin** ya **Read and write to any database**
6. **Add User**

## Step 4: Network access (IP allow)
1. **Network Access** → **Add IP Address**
2. Development ke liye: **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Production mein sirf server IP daalna better hai
3. **Confirm**

## Step 5: Connection string copy karo
1. **Database** → **Connect** → **Drivers**
2. Driver: **Node.js**, Version: latest
3. Connection string copy — example:
```
mongodb+srv://plusalpha:YOUR_PASSWORD@plus-alpha-cluster.xxxxx.mongodb.net/plus-alpha-intern?retryWrites=true&w=majority
```
4. `YOUR_PASSWORD` ki jagah apna password paste karo
5. `<password>` mein special characters ho to URL-encode karna pad sakta hai (`@` → `%40`)

## Step 6: Project mein lagao
1. File kholo: `backend/.env`
2. Line update karo:
```env
MONGODB_URI=mongodb+srv://plusalpha:YOUR_PASSWORD@cluster....mongodb.net/plus-alpha-intern?retryWrites=true&w=majority
```

## Step 7: Admin user + settings seed
Terminal:
```bash
cd backend
npm run seed:admin
npm run dev
```

## Step 8: Test
- Browser: `http://localhost:5000/api/health` → success message
- Login admin → **Admin → Fee Settings** → total fee set karo (e.g. ₹999)

---

## Common errors

| Error | Fix |
|-------|-----|
| `ECONNREFUSED 127.0.0.1` | Atlas URI `.env` mein nahi hai — Step 6 dubara |
| `bad auth` | Username/password galat — Database Access se reset |
| `IP not whitelisted` | Network Access mein IP allow karo |

---

## Razorpay (baad mein jab keys milen)

`backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
```

Admin panel → Fee Settings → **Enable Razorpay** ON

Admin → **Verify Payments** se har payment approve karo.
