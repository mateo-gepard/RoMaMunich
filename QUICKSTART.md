# ⚡ Quick Start Guide – RoMa Munich

## 1️⃣ Installation (5 Minuten)

```powershell
# 1. In das Projektverzeichnis wechseln
cd C:\roma-munich

# 2. Dependencies installieren
npm install

# 3. Environment-Datei erstellen
Copy-Item .env.example .env

# 4. Prisma Client generieren
npx prisma generate
```

---

## 2️⃣ Datenbank Setup

### Option A: Docker (Empfohlen für Development)

```powershell
# PostgreSQL via Docker starten
docker run --name roma-postgres `
  -e POSTGRES_USER=roma `
  -e POSTGRES_PASSWORD=roma2024 `
  -e POSTGRES_DB=roma_munich `
  -p 5432:5432 `
  -d postgres:15
```

### Option B: Lokale PostgreSQL-Installation

1. PostgreSQL von https://www.postgresql.org/download/windows/ installieren
2. Datenbank erstellen: `CREATE DATABASE roma_munich;`

### Datenbank initialisieren

```powershell
# Schema in DB übertragen
npx prisma db push

# Test-Daten einfügen (3 Tutoren, 1 Student)
npm run db:seed
```

---

## 3️⃣ Environment Variables konfigurieren

Editiere `.env` mit deinen Werten:

```env
# Datenbank (anpassen an deine Config)
DATABASE_URL="postgresql://roma:roma2024@localhost:5432/roma_munich"

# NextAuth (generiere Secret mit: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dein-secret-hier"

# Stripe (Test-Keys von dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# E-Mail (optional für Development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 4️⃣ Development Server starten

```powershell
npm run dev
```

✅ **Die Plattform läuft jetzt auf:**
- **Homepage:** http://localhost:3000
- **Matching-Quiz:** http://localhost:3000/matching
- **Dashboard:** http://localhost:3000/dashboard
- **Prisma Studio:** `npx prisma studio` → http://localhost:5555

---

## 5️⃣ Test-Accounts

Nach dem Seeding kannst du dich anmelden:

| Rolle | Email | Passwort |
|-------|-------|----------|
| Tutor 1 | max.mueller@roma-munich.de | password123 |
| Tutor 2 | sophie.weber@roma-munich.de | password123 |
| Student | anna.schmidt@example.com | student123 |

---

## 🛠️ Nützliche Commands

```powershell
# Development
npm run dev                 # Start dev server

# Database
npx prisma studio          # DB GUI öffnen
npx prisma db push         # Schema ändern
npm run db:seed            # Seed-Daten neu laden
npx prisma migrate dev     # Migration erstellen

# Build
npm run build              # Production build
npm start                  # Production server starten

# Code Quality
npm run lint               # ESLint ausführen
```

---

## 🐛 Troubleshooting

### Problem: "Cannot find module 'next'"
```powershell
npm install
```

### Problem: "Prisma Client not found"
```powershell
npx prisma generate
```

### Problem: "Database connection failed"
- Prüfe ob PostgreSQL läuft: `docker ps` oder im Task Manager
- Prüfe `DATABASE_URL` in `.env`
- Teste Verbindung: `npx prisma db push`

### Problem: "Port 3000 already in use"
```powershell
# Port ändern
$env:PORT=3001; npm run dev
```

---

## 📚 Nächste Schritte

1. **Lies FEATURES.md** – Übersicht aller implementierten Features
2. **Lies SETUP.md** – Detaillierte Setup-Anleitung
3. **Lies ROADMAP.md** – Was kommt als nächstes?
4. **Spiele mit dem Matching-System** – http://localhost:3000/matching
5. **Erkunde das Dashboard** – http://localhost:3000/dashboard

---

## 🚀 Deployment (später)

Für Production-Deployment siehe **SETUP.md** → Section "Deployment"

Empfohlener Stack:
- **Frontend:** Vercel (kostenloses Hosting)
- **Database:** Railway oder Supabase (kostenloser Starter-Plan)
- **Domain:** roma-munich.de

---

**Fragen?** Siehe README.md oder SETUP.md

**Viel Erfolg!** 🎯
