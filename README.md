# RoMa Munich – Premium 1:1 Mentoring Platform

Eine exklusive Münchner Plattform für hochwertiges Schüler-Mentoring durch Wettbewerbssieger, Frühstudierende und High-Achievers.

## 🎯 Kernwerte

**Exzellenz. Nähe. Struktur.**

## 🚀 Features

- ✅ Premium German-only Platform
- ✅ Intelligentes Matching-System für Mentor-Zuordnung
- ✅ Elite Tutor-Profile mit Wettbewerbsnachweisen
- ✅ Modernes Buchungssystem mit Email-Benachrichtigungen
- ✅ Session-Verwaltung mit Bewertungssystem
- ✅ Master Tutor Dashboard mit Editing-Rechten
- ✅ Firestore Integration für Bookings & Messages
- ✅ Crisp Chat Integration für Live Support
- ✅ Email-System mit Resend API
- ✅ DSGVO-konform & datenschutzrechtlich sicher
- ✅ Responsive Design (Mobile-First mit Purple Theme #6E56CF)
- ✅ Custom RoMa Logo Integration

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Purple Theme)
- **Database:** Firestore (Firebase)
- **Authentication:** NextAuth.js
- **Email:** Resend API
- **Live Chat:** Crisp Chat
- **Deployment:** Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Resend credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Required Environment Variables

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Resend Email API
RESEND_API_KEY=re_your_resend_key

# Crisp Chat (Optional)
NEXT_PUBLIC_CRISP_WEBSITE_ID=your_crisp_website_id
```

## 📁 Projektstruktur

```
roma-munich/
├── docs/                      # Technical documentation
│   ├── IMPROVEMENTS_SUMMARY.md
│   ├── MESSAGING_SYSTEM.md
│   ├── CRISP_SETUP.md
│   └── ...
├── prisma/
│   ├── schema.prisma         # Database schema (legacy)
│   └── seed.ts
├── public/
│   └── images/               # Static images and logo
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes (bookings, messages, auth)
│   │   ├── dashboard/       # Protected dashboard pages
│   │   ├── login/           # Authentication pages
│   │   ├── register/
│   │   ├── matching/        # Tutor matching system
│   │   ├── booking/         # Session booking
│   │   └── ...              # Marketing pages
│   ├── components/
│   │   ├── marketing/       # Landing page components
│   │   ├── providers/       # Context providers
│   │   ├── ClientLayout.tsx
│   │   └── CrispChat.tsx
│   ├── hooks/
│   │   └── useTranslations.ts
│   ├── lib/                 # Utilities & configurations
│   │   ├── authOptions.ts
│   │   ├── firebase.ts
│   │   └── prisma.ts
│   ├── messages/
│   │   └── de.json          # German translations
│   ├── styles/
│   │   └── globals.css      # Purple theme styles
│   └── types/
├── .env.local               # Environment variables (not in git)
├── .env.example             # Environment template
├── package.json
├── tailwind.config.ts       # Purple color scheme
├── tsconfig.json
├── next.config.js
├── vercel.json              # Vercel deployment config
├── README.md                # This file
├── QUICKSTART.md            # Quick setup guide
└── SETUP.md                 # Detailed setup instructions
```

## 🌐 Deployment

**Vercel (Recommended):**
```bash
# Connect your GitHub repository to Vercel
# Add environment variables in Vercel dashboard
# Deploy automatically on push to main
```

**Environment Variables for Production:**
- Add all variables from `.env.local` to Vercel dashboard
- Ensure `NEXTAUTH_URL` points to your production domain
- Configure Resend domain for production emails

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Schnelle Installation & Setup
- **[SETUP.md](SETUP.md)** - Detaillierte Konfigurationsanleitung  
- **[docs/](docs/)** - Technische Dokumentation zu Features
  - Messaging System
  - Crisp Chat Integration
  - Email System mit Resend
  - Zapier Integration

## 👤 Master Tutor Account

**Email:** romamuenchen@gmail.com

**Berechtigungen:**
- Alle Sessions anzeigen (inkl. stornierte)
- Session-Titel bearbeiten
- Sessions bestätigen/ablehnen
- Alle Nachrichten empfangen

## 📧 Support

**Email:** romamuenchen@gmail.com  
**Live Chat:** Crisp Chat Widget auf der Website
