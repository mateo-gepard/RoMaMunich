# 🚀 RoMa Munich – Setup & Installation Guide

## Schnellstart

### 1. Dependencies installieren

```powershell
cd C:\roma-munich
npm install
```

### 2. Datenbank einrichten

```powershell
# PostgreSQL starten (z.B. via Docker)
# docker run --name roma-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Prisma Schema generieren
npx prisma generate

# Datenbank migrieren
npx prisma db push

# Optional: Seed-Daten einfügen
npx prisma db seed
```

### 3. Environment Variables konfigurieren

Kopiere `.env.example` zu `.env`:

```powershell
Copy-Item .env.example .env
```

Dann editiere `.env` und fülle folgende Werte aus:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/roma_munich"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generiere mit: openssl rand -base64 32>"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Development Server starten

```powershell
npm run dev
```

Die Plattform ist dann verfügbar unter: **http://localhost:3000**

---

## 📁 Projektstruktur

```
roma-munich/
├── prisma/
│   └── schema.prisma          # Datenbank-Schema
├── src/
│   ├── app/
│   │   ├── (marketing)/      # Landing Pages
│   │   │   └── page.tsx      # Homepage
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # NextAuth
│   │   │   ├── tutors/       # Mentor-API
│   │   │   ├── matching/     # Matching-System
│   │   │   └── bookings/     # Buchungssystem
│   │   ├── dashboard/        # User Dashboard
│   │   ├── matching/         # Matching-Quiz
│   │   └── layout.tsx        # Root Layout
│   ├── components/
│   │   ├── marketing/        # Landing Page Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ValueProposition.tsx
│   │   │   ├── TutorShowcase.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/               # Reusable UI Components
│   │   └── dashboard/        # Dashboard Components
│   ├── lib/                  # Utilities
│   ├── styles/
│   │   └── globals.css       # Global Styles
│   └── types/                # TypeScript Types
├── public/                   # Static Assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## ✅ Feature-Checkliste

### **Implementierte Core-Features:**

- [x] **Premium Hero Section** – Bilingual (DE/EN), mit Stats
- [x] **Intelligentes Matching-System** – 6-Step Quiz mit personalisierten Empfehlungen
- [x] **Elite Tutor-Profile** – Mit Achievements, Frühstudium, Verfügbarkeit
- [x] **Buchungssystem** – Stripe-Integration für sichere Zahlungen
- [x] **User Dashboard** – Sessions, Lernplan, Fortschritt, Stats
- [x] **Value Proposition Section** – 6 USPs mit Icons
- [x] **Testimonials & Social Proof** – Echte Erfolgsgeschichten
- [x] **Transparentes Pricing** – 3 Pakete (Einzelstunde, 10h, Abitur Sprint)
- [x] **Premium Navigation** – Bilingual, responsive, clean
- [x] **Footer** – Vollständig mit Kontakt, Links, Social Media
- [x] **API Routes** – Tutors, Matching, Bookings, Auth
- [x] **NextAuth Integration** – Sichere Authentifizierung
- [x] **Prisma ORM** – Typsicheres DB-Schema
- [x] **Responsive Design** – Mobile-First, alle Breakpoints
- [x] **Premium UI/UX** – Navy/Gold Farbschema, Serif-Fonts

### **Nächste Schritte (Production-Ready):**

- [ ] **Tutor-Details-Seiten** – Individuelle Profile mit vollständigen Infos
- [ ] **Kalender-Integration** – react-calendar für Terminbuchung
- [ ] **Email-System** – Nodemailer für Bestätigungen, Erinnerungen
- [ ] **Admin-Dashboard** – Verwaltung von Tutoren, Buchungen, Usern
- [ ] **Bewertungssystem** – Reviews & Ratings nach Sessions
- [ ] **Messaging-System** – Direkte Kommunikation zwischen Schülern/Tutoren
- [ ] **Fortschritts-Tracking** – Visualisierung von Lernplänen
- [ ] **Wettbewerbs-Badges** – Olympiade-Verifizierung mit Zertifikaten
- [ ] **Webhook-Handler** – Stripe Payment Confirmation
- [ ] **DSGVO-Compliance** – Cookie-Banner, Privacy Policy
- [ ] **SEO-Optimierung** – Meta Tags, Sitemap, Structured Data
- [ ] **Performance** – Image Optimization, Lazy Loading
- [ ] **Testing** – Jest + React Testing Library
- [ ] **Deployment** – Vercel/Railway + PostgreSQL

---

## 🎨 Design-System

### **Farben:**
- **Navy:** `#1a365d` (Primary)
- **Gold:** `#d4af37` (Accent)
- **Weiß:** `#ffffff` (Background)
- **Grau-Töne:** 50-900

### **Typography:**
- **Headings:** Merriweather (Serif)
- **Body:** Inter (Sans-Serif)

### **Komponenten:**
- `btn-primary` – Haupt-CTA-Button
- `btn-secondary` – Sekundärer Button
- `card-premium` – Premium-Card mit Schatten
- `input-standard` – Standard-Input-Field
- `container-premium` – Max-width Container

---

## 🔧 Development Commands

```powershell
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build
npm start               # Start production server

# Database
npx prisma studio       # Open Prisma Studio (DB GUI)
npx prisma migrate dev  # Create migration
npx prisma db push      # Push schema to DB
npx prisma generate     # Generate Prisma Client

# Linting
npm run lint            # Run ESLint
```

---

## 🌐 Deployment (Empfehlung: Vercel)

### **1. Vercel CLI installieren:**

```powershell
npm i -g vercel
```

### **2. Deploy:**

```powershell
vercel
```

### **3. Environment Variables setzen:**

Im Vercel Dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- Alle anderen aus `.env`

### **4. Datenbank:**

Empfehlung: **Railway** oder **Supabase** für PostgreSQL

```powershell
# Railway
railway login
railway init
railway up
```

---

## 📧 Support & Kontakt

Bei Fragen zum Setup:
- **Email:** info@roma-munich.de
- **Docs:** Siehe README.md

---

## 🏆 Credits

Entwickelt für **RoMa Munich** – Premium 1:1 Mentoring Platform
**Exzellenz. Nähe. Struktur.**
