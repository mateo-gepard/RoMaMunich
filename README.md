# RoMa Munich – Premium 1:1 Mentoring Platform

Eine exklusive Münchner Plattform für hochwertiges Schüler-Mentoring durch Wettbewerbssieger, Frühstudierende und High-Achievers.

## 🎯 Kernwerte

**Exzellenz. Nähe. Struktur.**

## 🚀 Features

- ✅ Premium German-only Platform
- ✅ Calendly Integration für professionelles Booking
- ✅ Elite Tutor-Profile mit Wettbewerbsnachweisen
- ✅ Modernes glassmorphic Design mit Parallax-Effekten
- ✅ Crisp Chat Integration für Live Support
- ✅ DSGVO-konform & datenschutzrechtlich sicher
- ✅ Responsive Design (Mobile-First mit Purple Theme #6E56CF)
- ✅ Custom RoMa Logo Integration
- ✅ Vollständig statisch - keine Backend-Infrastruktur erforderlich

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Purple Theme)
- **Booking:** Calendly
- **Live Chat:** Crisp Chat
- **Deployment:** Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

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

## 🔧 Calendly Setup

1. Erstelle einen Account auf [calendly.com](https://calendly.com)
2. Erstelle einen Event Type "Erstgespräch" (30 Minuten)
3. Konfiguriere deine Verfügbarkeit
4. Die Integration ist bereits fertig!

Details siehe [INTEGRATION.md](INTEGRATION.md)

## 📁 Projektstruktur

```
roma-munich/
├── docs/                      # Technical documentation
├── public/
│   └── images/               # Static images and logo
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes (health check only)
│   │   ├── about/           # About page
│   │   ├── buchen/          # Booking page with Calendly
│   │   ├── how-it-works/    # How it works page
│   │   ├── mentors/         # Mentors showcase
│   │   └── page.tsx         # Homepage
│   ├── components/
│   │   ├── marketing/       # Landing page components
│   │   ├── CalendlyWidget.tsx
│   │   ├── CrispChat.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── hooks/
│   │   └── useTranslations.ts
│   ├── messages/
│   │   └── de.json          # German translations
│   └── styles/
│       └── globals.css      # Purple theme styles
├── package.json
├── tailwind.config.ts       # Purple color scheme
├── tsconfig.json
├── next.config.js
├── README.md                # This file
├── INTEGRATION.md           # Calendly integration guide
└── QUICKSTART.md            # Quick setup guide
```

## 🌐 Deployment

**Vercel (Recommended):**
```bash
# Connect your GitHub repository to Vercel
# No environment variables needed!
# Deploy automatically on push to main
```

Die App ist vollständig statisch und benötigt keine Backend-Infrastruktur.

## 📚 Documentation

- **[INTEGRATION.md](INTEGRATION.md)** - Calendly Integration Guide
- **[QUICKSTART.md](QUICKSTART.md)** - Schnelle Installation & Setup
- **[docs/](docs/)** - Legacy documentation

## 📧 Support

**Email:** romamuenchen@gmail.com  
**Live Chat:** Crisp Chat Widget auf der Website
