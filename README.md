# RoMa Munich – Premium 1:1 Mentoring Platform

Eine exklusive Münchner Plattform für hochwertiges Schüler-Mentoring durch Wettbewerbssieger, Frühstudierende und High-Achievers.

## 🎯 Kernwerte

**Exzellenz. Nähe. Struktur.**

## 🚀 Features

- ✅ Premium Hero Section mit bilingualem Support (DE/EN)
- ✅ Intelligentes Matching-System für Mentor-Zuordnung
- ✅ Elite Tutor-Profile mit Wettbewerbsnachweisen
- ✅ Modernes Buchungssystem mit Kalender-Integration
- ✅ Personalisierte Lernpläne & Roadmaps
- ✅ Eltern-Dashboard mit Fortschritts-Tracking
- ✅ Stripe-Integration für sichere Zahlungen
- ✅ DSGVO-konform & datenschutzrechtlich sicher
- ✅ Responsive Design (Mobile-First)
- ✅ Testimonials & Case Studies

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Email:** Nodemailer
- **i18n:** next-intl
- **Animation:** Framer Motion

## 📦 Installation

\`\`\`bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## 📁 Projektstruktur

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Public pages
│   ├── (dashboard)/       # Protected dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── marketing/        # Landing page components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utilities & configurations
├── types/                 # TypeScript definitions
└── styles/               # Global styles
\`\`\`

## 🌐 Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

Empfohlen: Vercel, Railway oder AWS

## 📧 Support

info@roma-munich.de
