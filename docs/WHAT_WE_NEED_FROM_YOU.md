# Plus Alpha Intern — Aapko Kya Dena Hoga (Setup Checklist)

Demo sites (InternSpark, techintern) jaisa platform chalane ke liye ye details humein chahiye. **Copy nahi karenge** — sirf aapki apni company ki real information use hogi.

---

## 1. Company / Brand (Zaroori)

| Item | Example | Aapka |
|------|---------|-------|
| Company name | Plus Alpha Intern | _____________ |
| Tagline | AI-powered internships... | _____________ |
| Logo file | PNG/SVG (transparent) | `imges/logo.png` upload karein |
| Office address | City, State, PIN | _____________ |
| MSME / Udyam number (agar hai) | UDYAM-XX-... | _____________ |
| AICTE note (disclaimer text) | Private initiative, not govt affiliated | _____________ |

---

## 2. Contact (Zaroori)

| Item | Example |
|------|---------|
| Primary email | hello@plusalphaintern.com |
| Support email | support@plusalphaintern.com |
| Phone / WhatsApp | +91 XXXXXXXXXX |
| Google Map link (optional) | https://maps.google.com/... |

---

## 3. Gmail / Email (OTP & notifications)

| Item | Kaise milega |
|------|----------------|
| Gmail address | jo OTP bhejega (e.g. `noreply@yourdomain.com` ya Gmail) |
| App Password | Google Account → Security → 2FA ON → App Password |
| SMTP values | `backend/.env` mein `SMTP_USER`, `SMTP_PASS` |

**Note:** Sirf Gmail password mat do — **App Password** use karo.

---

## 4. MongoDB (Database — Zaroori)

| Item | Kaise |
|------|--------|
| MongoDB Atlas account | mongodb.com free cluster |
| Connection string | `MONGODB_URI=mongodb+srv://USER:PASS@cluster.../plus-alpha-intern` |

---

## 5. Google Login (Optional lekin recommended)

| Item | Kahan se |
|------|----------|
| Google Cloud project | console.cloud.google.com |
| OAuth Client ID | APIs → Credentials → OAuth 2.0 |
| Authorized URLs | `http://localhost:3000`, production domain |

Frontend: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`  
Backend: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

---

## 6. Razorpay (Payment — jab fees lagein)

| Item | Kahan se |
|------|----------|
| Razorpay account | dashboard.razorpay.com |
| Key ID (Test/Live) | `RAZORPAY_KEY_ID` |
| Key Secret | `RAZORPAY_KEY_SECRET` |
| Internship fee amount | e.g. ₹499, ₹999 (aap decide) |

---

## 7. Gemini AI (AI features)

| Item | Kahan se |
|------|----------|
| API Key | aistudio.google.com → Get API Key |
| Env | `GEMINI_API_KEY` in `backend/.env` |

---

## 8. Cloudinary (Resume / task uploads)

| Item | Kahan se |
|------|----------|
| Cloud name, API Key, Secret | cloudinary.com dashboard |

---

## 9. Internship program details (Content)

| Item | Detail |
|------|--------|
| Kitne domains? | abhi 19 listed — add/remove list bhejein |
| Duration | 4–8 weeks / 15 days / 60 hours — jo aap offer karte ho |
| Fee structure | Free / paid / reimbursement amount |
| Certificate text | "Internship & Experience Certificate" wording |
| Offer letter template | PDF ya Word (baad mein upload) |
| Faculty/mentor names | naam, photo, subject (agar website par dikhana ho) |
| Partner colleges | logo + naam (agar "Trusted by colleges" section chahiye) |

---

## 10. Legal pages (Aapki policy text)

- Privacy Policy (full text ya draft)
- Terms & Conditions
- Refund Policy
- Disclaimer (no fake placement guarantee)

---

## 11. Deployment (Jab live karna ho)

| Service | Use |
|---------|-----|
| Vercel | Frontend |
| Render / Railway | Backend |
| Custom domain | e.g. `plusalphaintern.com` |
| DNS | domain provider se point karna |

---

## Quick send format (WhatsApp / message mein bhej sakte ho)

```
Company: 
Address: 
Email: 
Phone: 
MSME/Udyam: 
MongoDB URI: (ya "tum bana do")
Razorpay: test keys / abhi nahi
Fee amount: 
Domains list: (default 19 OK / custom list)
Logo: attached
Faculty list: yes/no
```

---

## Security — mat bhejna public chat mein

- Production JWT secrets
- Live Razorpay secret (test OK for dev)
- Database password plain text group mein

Sirf `.env` files locally ya secure share (password manager).
