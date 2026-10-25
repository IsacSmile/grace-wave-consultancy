# Grace Way Accounting FZC LLC — Official Enquiry Website

A lightweight, high-performance, mobile-first enquiry website for **Grace Way Accounting FZC LLC**, a premier accounting and business advisory firm based in the UAE.

Built with **React (Vite)**, **Tailwind CSS**, **Lenis Smooth Scroll**, **GSAP + ScrollTrigger**, and **Neon Postgres** via Vercel Serverless Functions.

---

## Key Features

- **Mobile-First Responsive Design**: Flawlessly engineered from 360px up with zero horizontal overflow at any viewport size.
- **Strictly Enquiry-Only**: Zero authentication, no logins, no admin dashboard, no user sessions.
- **Kinetic Typography & Smooth Scroll**: Lenis smooth momentum scrolling paired with GSAP ScrollTrigger animations, respecting user's `prefers-reduced-motion` settings.
- **Serverless Backend (`/api/enquiry`)**:
  - Strict `POST` method validation
  - Hidden honeypot spam protection
  - Robust client and server-side validation & sanitization
  - In-database rate limiting (max 5 submissions per hour per SHA-256 hashed `IP + salt`)
  - Safe parameterized SQL queries using `@neondatabase/serverless` tagged templates
  - Never leaks database credentials or error stack traces to the client
- **Centralized Content**: Every piece of copy, phone number (`+971569148255`), email, address, and service description is managed in `src/data/siteConfig.js`.

---

## Project Structure

```text
├── api/
│   └── enquiry.js               # Vercel serverless function (Neon Postgres)
├── db/
│   └── schema.sql               # Database schema & indexes for enquiries table
├── public/
│   ├── favicon.svg              # Scalable SVG brand monogram
│   └── robots.txt               # SEO indexing directives
├── src/
│   ├── components/
│   │   ├── About.jsx            # Company narrative & animated count-up stats
│   │   ├── Contact.jsx          # Contact channels, maps embed, enquiry form
│   │   ├── EnquiryForm.jsx      # Validated enquiry form with honeypot & states
│   │   ├── FloatingWhatsApp.jsx # Accessible floating WhatsApp button
│   │   ├── Footer.jsx           # Legal info, disclaimer, back-to-top
│   │   ├── Hero.jsx             # Headline word stagger, value prop, CTAs
│   │   ├── Navbar.jsx           # Sticky nav, transparent-to-solid, slide-in drawer
│   │   ├── Process.jsx          # 4-step workflow with scroll-scrubbed progress line
│   │   ├── Reveal.jsx           # Reusable GSAP ScrollTrigger wrapper component
│   │   ├── ServiceDetail.jsx    # Deep-dive breakdown of the 3 consultancy pillars
│   │   ├── Services.jsx         # 3 primary service cards with hover elevation
│   │   ├── SmoothScroll.jsx     # Lenis provider & GSAP ticker sync
│   │   └── WhyChooseUs.jsx      # Core UAE differentiators & value props
│   ├── data/
│   │   └── siteConfig.js        # ALL business info, copy, phone, email, address
│   ├── hooks/
│   │   └── useReducedMotion.js  # Detects prefers-reduced-motion media query
│   ├── App.jsx                  # Single-page layout mounting sections
│   ├── index.css                # Tailwind directives, Lenis styling & accessibility
│   └── main.jsx                 # Vite React entry point
├── .env.example                 # Environment variables template
├── index.html                   # SEO metadata, Open Graph, LocalBusiness JSON-LD
├── package.json                 # Minimal allowed dependencies
├── tailwind.config.js           # Corporate Executive Navy & Warm Gold palette
├── vercel.json                  # Vercel deployment configuration
└── README.md                    # Setup & deployment documentation
```

---

## Quick Start (Local Setup)

### 1. Prerequisites

- Node.js 18+ (tested on Node v20/v22)
- npm 9+

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Neon Postgres connection string:

```ini
DATABASE_URL=postgresql://<user>:<password>@<ep-placeholder>.region.aws.neon.tech/neondb?sslmode=require
RATE_LIMIT_SALT=your_custom_secret_salt_here
```

> **Security Note:** `DATABASE_URL` is used strictly on the server (`api/enquiry.js`). It does not have a `VITE_` prefix and is never exposed in the client-side JavaScript bundle.

---

## Neon Postgres Database Setup

1. Go to [Neon Console](https://console.neon.tech) and create a free project (or use an existing one).
2. Open the **SQL Editor** tab in your Neon dashboard.
3. Paste the contents of `db/schema.sql` and click **Run**:

   ```sql
   CREATE TABLE IF NOT EXISTS enquiries (
     id BIGSERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT NOT NULL,
     service TEXT NOT NULL,
     message TEXT NOT NULL,
     ip_hash TEXT,
     status TEXT NOT NULL DEFAULT 'new',
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );

   CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
   CREATE INDEX IF NOT EXISTS idx_enquiries_ip_hash ON enquiries (ip_hash, created_at);
   ```

4. Copy the **Connection String** from the dashboard (select `Pooled connection` or standard `postgres://...`).
5. Paste it as `DATABASE_URL` into your `.env` file and into Vercel Project Environment Variables.

---

## Running Locally

### Option A: Frontend Only (Vite Dev Server)

```bash
npm run dev
```

Runs the Vite development server at `http://localhost:3000`.

### Option B: Full Stack with API (`vercel dev`)

To test both the React frontend and the `/api/enquiry` serverless endpoint locally:

```bash
npx vercel dev
```

`vercel dev` starts local Vercel serverless runtime and proxies frontend requests, allowing live testing of the submission form against your Neon Postgres database.

---

## How to Edit Content & Business Information

All text, contact information, services, and values are centralized in a single file:
**`src/data/siteConfig.js`**

To update content, open `src/data/siteConfig.js`:

- **Phone / WhatsApp**: Update `business.phone`, `business.phoneDisplay`, and `business.whatsappUrl` (configured to `+971569148255`).
- **Email & Address**: Replace the placeholder `business.email` (`info@gracewayaccounting.com`) and `business.address`.
- **Services Copy**: Update `services.list` to modify descriptions, deliverables, or features.
- **Process Steps**: Update `process.steps` to revise the 4 engagement milestones.
- **Values & Mission**: Update `about.mission`, `about.vision`, and `about.values`.

Changes will instantly reflect across the entire site without editing any React components.

---

## Deployment to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import the repository.
4. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon Postgres connection string.
   - `RATE_LIMIT_SALT`: A random secret string used to hash IP addresses for rate limiting.
5. Click **Deploy**. Vercel will build the Vite SPA and deploy `/api/enquiry.js` as an edge/serverless function.

---

## Verification & Compliance Checklist

- [x] **No Authentication / Admin**: Pure enquiry conversion site with zero login/logout code.
- [x] **Mobile First**: Tested and responsive at 360px, 390px, 768px, 1024px, 1280px+ with 0 horizontal scroll.
- [x] **Accessibility**: Semantic HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`), 44px+ tap targets, visible focus outlines, and AA color contrast.
- [x] **Prefers Reduced Motion**: When user enables reduced motion, Lenis is disabled and animations display immediately without motion.
- [x] **Honeypot & Rate Limiting**: Silent bot deflection and 5 requests/hour per hashed IP limit.
- [x] **Security**: Secrets kept server-side only; parameterized SQL prevents injection.
