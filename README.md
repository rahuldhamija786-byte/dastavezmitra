# DASTAVEZ MITRA - Documentation & Assistance Services

> **Documentation Ka Kaam? DASTAVEZ MITRA Se Sampark Kijiye.**
> RTO, Vehicle Documentation, Marriage Registration, Affidavit, Agreement aur anya documentation services ke liye assistance.
>
> 📍 **Service Location:** Services currently available in Gurugram only.
> 🏢 **Court Office Desk:** Seat No. 4, R C Khatana Lane, Hall No. 8, District and Sessions Court, Gurugram

Official website repository for **DASTAVEZ MITRA** — a modern, mobile-first documentation assistance and lead CRM platform.

---

## 📱 Dedicated Contact Channels

- **WhatsApp Support (Chat & Documents):** [9871592002](https://wa.me/919871592002)
- **Calling Helpline (Direct Phone):** [9540403071](tel:+919540403071)
- **Instagram:** [@dastavezmitra](https://instagram.com/dastavezmitra)
- **Location:** Gurugram Only

---

## 🚀 Services Provided (Prioritized with Required Documents)

### 🌟 Services with Confirmed Required Documents
1. **Vehicle NOC – Form 28**
2. **International Driving Licence**
3. **Learner Licence**
4. **Duplicate RC**
5. **HP Cancel**
6. **Marriage Registration** *(शादी रजिस्टर करने हेतु आवश्यक दस्तावेज़)*
7. **Gazette Notification / Name Change** *(Under 18 & 18 and Above)*

### 📁 Other Documentation Services
8. **RC Transfer**
9. **Vehicle Documentation / RTO Work**
10. **RTA Work**
11. **Traffic Challan Assistance**
12. **Same Day Marriage Assistance**
13. **Arya Samaj Marriage**
14. **Live-In Relationship Agreement**
15. **Affidavit Preparation**
16. **Agreement Drafting**
17. **Will / Testament Documentation**
18. **Legal Heir Certificate**
19. **GPA / General Power of Attorney**
20. **SPA / Special Power of Attorney**
21. **Other Documentation Services**

---

## 🛠️ Architecture & Features

- **Split Contact CTAs**: Dual actions across the entire site — **WhatsApp to 9871592002** and **Call to 9540403071**.
- **Mobile-First UX**: Responsive from 320px screens up to desktop with sticky dual action bar, touch drawer, and clean typography.
- **Secure Visitor Lead Capture**: Online enquiry form with 10-digit Indian mobile validation, honeypot bot trap, rate limiting, and explicit user consent.
- **Internal Admin CRM Dashboard (`#/admin`)**:
  - Secure password-authenticated dashboard with HMAC-SHA256 session tokens.
  - Metrics cards (Total Leads, Today's Leads, New, Contacted, Follow-up, Converted, Closed).
  - Search, filter by status/service, sort, 1-click WhatsApp/Call actions, and CSV export.
- **Serverless API Layer**:
  - `POST /api/leads` — Public lead creation with validation and throttling.
  - `GET /api/leads` — Authenticated lead listing.
  - `POST /api/admin-login` — Secure admin authentication.
  - `POST /api/update-lead` — Lead pipeline status & notes updater.
  - `GET /api/stats` — Real-time CRM statistics.
- **Security Headers & Privacy**: Strict CSP, X-Frame-Options, X-Content-Type-Options via `vercel.json`.
- **18-Clause Legal Terms**: Comprehensive terms governing independent documentation assistance, document genuineness responsibilities, and statutory limitations.

---

## 🔐 Environment Variables Configuration (Vercel)

To configure production secrets in your Vercel Project Settings > Environment Variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | Password used to log into the `#/admin` CRM dashboard | e.g. `your_secure_password_2026` |
| `JWT_SECRET` | Secret key used for signing session tokens | e.g. `random_64_character_hex_string` |
| `DATABASE_URL` *(Optional)* | Cloud PostgreSQL / Supabase / Neon connection URI | `postgresql://...` |

*(If `DATABASE_URL` is unset, the system uses resilient serverless cache storage with zero downtime).*

---

## 💻 Local Development

1. Clone repository:
   ```bash
   git clone https://github.com/rahuldhamija786-byte/dastavezmitra.git
   cd dastavezmitra
   ```

2. Start local server with API support:
   ```bash
   node dev-server.js
   ```

3. Open `http://localhost:3000` in your browser.

---

## ⚖️ Disclaimer

DASTAVEZ MITRA is a documentation and assistance service. Service availability, processing time, required documents and applicable procedures may vary depending on the service, authority and individual case. Information on this website is for general guidance and should be verified for the specific service.
